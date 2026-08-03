import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { batchUploadAssets } from "./asset-processor";
import { resolveAssetEntry } from "./asset-processor/resolver";
import type { AssetManifestEntry } from "./asset-processor/types";

/**
 * Recursively retrieves a list of files from a directory that match specific extensions.
 *
 * @param dir - The directory to search in.
 * @param ext - An array of file extensions to include (e.g. `[".md", ".mdx"]`).
 * @returns A promise that resolves to an array of absolute file paths.
 */
async function getFiles(dir: string, ext: string[]): Promise<string[]> {
	const dirents = await readdir(dir, { withFileTypes: true, recursive: true });
	return dirents
		.filter(
			(dirent) => dirent.isFile() && ext.some((e) => dirent.name.endsWith(e)),
		)
		.map((dirent) => path.join(dirent.parentPath, dirent.name));
}

/**
 * Loads markdown content from a directory and constructs a lookup record based on the parsed frontmatter.
 * This is used for associating categories and tags defined in individual markdown files with posts.
 *
 * @param dir - The directory containing category or tag markdown files.
 * @returns A promise resolving to a record mapping slugs to their respective metadata (title, url, type).
 */
async function loadLookups(dir: string) {
	const files = await getFiles(dir, [".md", ".mdx"]);
	const lookup: Record<string, { title: string; url: string; type: string }> =
		{};

	for (const file of files) {
		const content = await Bun.file(file).text();
		const { data } = matter(content);
		// Assuming slug is the filename without extension, or specified in frontmatter
		const slug = data.slug || path.basename(file, path.extname(file));
		lookup[slug] = {
			title: data.title || "",
			url: data.url || `/${path.basename(dir)}/${slug}`,
			type: data.type || (dir.includes("categories") ? "category" : "tag"),
		};
	}
	return lookup;
}

/**
 * The main prebuild routine executed before building the site.
 *
 * Responsibilities:
 * 1. Copies all files from `content/` to a temporary `.content/` directory.
 * 2. Processes all assets located in `content/assets`, uploading them to Cloudflare R2 and updating the `asset-manifest.json`.
 * 3. Replaces local image references in Markdown/MDX frontmatter (e.g. `imageSrc`) with their public R2 URLs.
 * 4. Resolves `catSlugs` and `tagSlugs` in frontmatter against loaded category and tag dictionaries, injecting the full data into the post.
 *
 * By modifying files in `.content/`, we ensure the original `content/` files remain untouched by automated processing,
 * while Fumadocs is configured to build the site from the processed `.content/` directory.
 */
export async function processFrontmatter() {
	const contentDir = path.join(process.cwd(), "content");
	const dotContentDir = path.join(process.cwd(), ".content");
	const manifestPath = path.join(process.cwd(), "asset-manifest.json");

	let assetManifest: Record<string, AssetManifestEntry> = {};
	try {
		const manifestFile = Bun.file(manifestPath);
		if (await manifestFile.exists()) {
			assetManifest = await manifestFile.json();
		}
	} catch (err) {
		console.warn(`[warn] Failed to read asset-manifest.json: ${err}`);
	}

	// Clear .content/ if it exists
	await rm(dotContentDir, { recursive: true, force: true });

	const categoriesLookup = await loadLookups(
		path.join(contentDir, "categories"),
	);
	const tagsLookup = await loadLookups(path.join(contentDir, "tags"));

	// Batch upload all assets first
	const assetsDir = path.join(contentDir, "assets");
	const uploadOptions = {
		generatePlaiceholder: true,
		r2Endpoint: process.env.R2_ENDPOINT_URL || "",
		r2Bucket: process.env.R2_BUCKET_NAME || "",
		r2AccessKey: process.env.R2_ACCESS_KEY_ID || "",
		r2SecretKey: process.env.R2_SECRET_ACCESS_KEY || "",
		r2PublicUrl: process.env.R2_PUBLIC_URL || "",
	};
	assetManifest = await batchUploadAssets(
		assetsDir,
		assetManifest,
		uploadOptions,
	);

	// Get all files in content/
	const allFiles = await readdir(contentDir, {
		withFileTypes: true,
		recursive: true,
	});

	for (const dirent of allFiles) {
		if (!dirent.isFile()) continue;

		const file = path.join(dirent.parentPath, dirent.name);
		const destFile = file.replace(contentDir, dotContentDir);

		// Only process .md/.mdx files that have images in their front matter
		if (file.endsWith(".md") || file.endsWith(".mdx")) {
			const rawContent = await Bun.file(file).text();
			const parsed = matter(rawContent);
			const { data, content } = parsed;

			if (data.imageSrc) {
				// Resolve categories
				if (data.catSlugs && Array.isArray(data.catSlugs)) {
					const newCategories = data.catSlugs
						.map((slug: string) => categoriesLookup[slug])
						.filter(Boolean);
					data.categories = newCategories;
					delete data.catSlugs;
				}

				// Resolve tags
				if (data.tagSlugs && Array.isArray(data.tagSlugs)) {
					const newTags = data.tagSlugs
						.map((slug: string) => tagsLookup[slug])
						.filter(Boolean);
					data.tags = newTags;
					delete data.tagSlugs;
				}

				// Process featured image
				const entry = resolveAssetEntry(data.imageSrc, file, assetManifest);
				if (entry) {
					data.featured_image = {
						...entry,
						altText: data.altText || "",
					};
				}
				delete data.imageSrc;

				const newFileContent = matter.stringify(content, data);
				await Bun.write(destFile, newFileContent);
				console.log(`[success] Processed and wrote ${destFile}`);
			} else {
				// Just copy the file using Bun.write
				const fileBuffer = await Bun.file(file).arrayBuffer();
				await Bun.write(destFile, fileBuffer);
			}
		} else if (file.includes("assets/")) {
			console.log(`[info] Asset: ${file} was uploaded`);
		}
	}

	await Bun.write(manifestPath, JSON.stringify(assetManifest, null, 2));
	console.log(`[success] Wrote asset-manifest.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	processFrontmatter().catch(console.error);
}
