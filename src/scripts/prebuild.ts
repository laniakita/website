import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { type ImageManifestEntry, processAsset } from "./asset-processor";

async function getFiles(dir: string, ext: string[]): Promise<string[]> {
	const dirents = await readdir(dir, { withFileTypes: true, recursive: true });
	return dirents
		.filter(
			(dirent) => dirent.isFile() && ext.some((e) => dirent.name.endsWith(e)),
		)
		.map((dirent) => path.join(dirent.parentPath, dirent.name));
}

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

export async function processFrontmatter() {
	const contentDir = path.join(process.cwd(), "content");
	const dotContentDir = path.join(process.cwd(), ".content");
	const manifestPath = path.join(process.cwd(), "asset-manifest.json");

	let assetManifest: Record<string, ImageManifestEntry> = {};
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

	// Get all files in content/
	const allFiles = await readdir(contentDir, {
		withFileTypes: true,
		recursive: true,
	});

	for (const dirent of allFiles) {
		if (!dirent.isFile()) continue;

		const file = path.join(dirent.parentPath, dirent.name);
		const destFile = file.replace(contentDir, dotContentDir);

		// Only process .md/.mdx files in posts/
		if (
			file.includes("/posts/") &&
			(file.endsWith(".md") || file.endsWith(".mdx"))
		) {
			const rawContent = await Bun.file(file).text();
			const parsed = matter(rawContent);
			const { data, content } = parsed;

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
			if (data.imageSrc) {
				const entry = await processAsset(data.imageSrc, assetManifest, file, {
					generatePlaiceholder: true,
				});
				if (entry) {
					data.featured_image = {
						...entry,
						altText: data.altText || "",
					};
				}
				delete data.imageSrc;
			}

			// We no longer process AST here! Just write the updated frontmatter + original content.
			const newFileContent = matter.stringify(content, data);
			await Bun.write(destFile, newFileContent);
			console.log(`[success] Processed and wrote ${destFile}`);
		} else if (!file.includes("/assets/images/")) {
			// Just copy the file using Bun.write
			const fileBuffer = await Bun.file(file).arrayBuffer();
			await Bun.write(destFile, fileBuffer);
		}
	}

	await Bun.write(manifestPath, JSON.stringify(assetManifest, null, 2));
	console.log(`[success] Wrote asset-manifest.json`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	processFrontmatter().catch(console.error);
}
