import crypto from "node:crypto";
import { readdir, rm } from "node:fs/promises";
import path from "node:path";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import matter from "gray-matter";
import { getPlaiceholder } from "plaiceholder";

// R2 Client
const s3Client = new S3Client({
	region: "auto",
	endpoint: process.env.R2_ENDPOINT_URL || "",
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
	},
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

async function getFiles(dir: string, ext: string[]): Promise<string[]> {
	const dirents = await readdir(dir, { withFileTypes: true, recursive: true });
	return dirents
		.filter(
			(dirent) => dirent.isFile() && ext.some((e) => dirent.name.endsWith(e)),
		)
		.map((dirent) => path.join(dirent.parentPath || dirent.path, dirent.name));
}

function calculateHash(buffer: Buffer): string {
	return crypto.createHash("md5").update(buffer).digest("hex");
}

async function uploadToR2(fileName: string, buffer: Buffer, mimeType: string) {
	if (!process.env.R2_ENDPOINT_URL) {
		console.warn("⚠️ R2_ENDPOINT_URL not set. Skipping upload for:", fileName);
		return;
	}

	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: mimeType,
	});

	await s3Client.send(command);
	console.log(`✅ Uploaded ${fileName} to R2`);
}

async function loadLookups(dir: string) {
	const files = await getFiles(dir, [".md", ".mdx"]);
	const lookup: Record<string, any> = {};

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

		const file = path.join(dirent.parentPath || dirent.path, dirent.name);
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

			// Process image
			if (data.imageSrc) {
				let imagePath = data.imageSrc;
				// Handle legacy paths like `content/assets/...` or relative paths
				if (imagePath.startsWith("content/")) {
					imagePath = path.join(process.cwd(), imagePath);
				} else if (imagePath.startsWith(".")) {
					imagePath = path.resolve(path.dirname(file), imagePath);
				} else {
					imagePath = path.join(contentDir, "assets", path.basename(imagePath));
				}

				try {
					const imageBuffer = Buffer.from(
						await Bun.file(imagePath).arrayBuffer(),
					);
					const localHash = calculateHash(imageBuffer);

					if (
						!data.featured_image ||
						data.featured_image.localHash !== localHash
					) {
						console.log(`🔄 Processing image for ${file}...`);

						const {
							base64,
							metadata: { width, height },
						} = await getPlaiceholder(imageBuffer);
						const ext = path.extname(imagePath);
						const fileName = `assets/${localHash}${ext}`;

						let mimeType = "image/jpeg";
						if (ext === ".png") mimeType = "image/png";
						else if (ext === ".webp") mimeType = "image/webp";

						await uploadToR2(fileName, imageBuffer, mimeType);

						data.featured_image = {
							src: `${PUBLIC_URL}/${fileName}`,
							base64,
							width,
							height,
							localHash,
							altText: data.altText || "",
						};
					}
				} catch (err) {
					console.error(
						`❌ Failed to process image ${data.imageSrc} for ${file}:`,
						err,
					);
				}

				delete data.imageSrc;
			}

			const newFileContent = matter.stringify(content, data);
			await Bun.write(destFile, newFileContent);
			console.log(`📝 Processed and wrote ${destFile}`);
		} else {
			// Just copy the file using Bun.write
			const fileBuffer = await Bun.file(file).arrayBuffer();
			await Bun.write(destFile, fileBuffer);
		}
	}
}

if (import.meta.url === `file://${process.argv[1]}`) {
	processFrontmatter().catch(console.error);
}
