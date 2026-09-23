import fs from "node:fs";
import path from "node:path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import { visit } from "unist-util-visit";
import { resolveAssetEntry } from "../src/scripts/asset-processor/resolver";
import type { AssetManifestEntry } from "../src/scripts/asset-processor/types";

let assetManifestCache: Record<string, AssetManifestEntry> | null = null;

function getManifest(): Record<string, AssetManifestEntry> {
	if (!assetManifestCache) {
		const manifestPath = path.join(process.cwd(), "asset-manifest.json");
		try {
			assetManifestCache = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
		} catch {
			assetManifestCache = {};
		}
	}
	return assetManifestCache || {};
}

/**
 * Parses a filename (kebab-case or snake_case) into a human-readable title.
 * Example: `my_cool-image_01.png` -> `My Cool Image 01`
 */
export function parseTitleFromFilename(src: string): string {
	if (!src) return "";

	// Remove query params or hashes
	const cleanSrc = (src.split("?")[0] ?? "").split("#")[0] ?? "";

	// Get base filename without extension
	const ext = path.extname(cleanSrc);
	const basename = path.basename(cleanSrc, ext);

	// Replace dashes and underscores with spaces
	const words = basename.replace(/[-_]+/g, " ").trim();

	// Capitalize each word
	return words.replace(/\b\w/g, (char) => char.toUpperCase());
}

export interface ExtractedImage {
	src: string;
	alt?: string;
	title?: string;
}

/**
 * Extracts inline images from MDX source code synchronously using Remark AST parsing.
 */
export function extractImagesFromMdx(source: string, filePath: string): ExtractedImage[] {
	if (!source) return [];

	const manifest = getManifest();
	const extracted: ExtractedImage[] = [];

	try {
		const tree = remark().use(remarkMdx).parse(source);

		// biome-ignore lint/suspicious/noExplicitAny: AST nodes are dynamic
		visit(tree, (node: any) => {
			if (node.type === "image" && typeof node.url === "string") {
				let resolvedSrc = node.url;
				if (!resolvedSrc.startsWith("http")) {
					const entry = resolveAssetEntry(node.url, filePath, manifest);
					if (entry) {
						resolvedSrc = entry.src;
					}
				}

				const alt = node.alt || undefined;
				const title = node.title || parseTitleFromFilename(node.url);

				extracted.push({
					src: resolvedSrc,
					alt,
					title,
				});
			} else if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
				if (node.name === "img" || node.name === "Image") {
					// biome-ignore lint/suspicious/noExplicitAny: AST attributes are dynamic
					const srcAttr = node.attributes?.find((a: any) => a.name === "src");
					if (srcAttr && typeof srcAttr.value === "string") {
						let resolvedSrc = srcAttr.value;
						if (!resolvedSrc.startsWith("http")) {
							const entry = resolveAssetEntry(srcAttr.value, filePath, manifest);
							if (entry) {
								resolvedSrc = entry.src;
							}
						}

						// biome-ignore lint/suspicious/noExplicitAny: AST attributes are dynamic
						const altAttr = node.attributes?.find((a: any) => a.name === "alt");
						// biome-ignore lint/suspicious/noExplicitAny: AST attributes are dynamic
						const titleAttr = node.attributes?.find((a: any) => a.name === "title");

						const alt = typeof altAttr?.value === "string" ? altAttr.value : undefined;
						const title =
							typeof titleAttr?.value === "string" ? titleAttr.value : parseTitleFromFilename(srcAttr.value);

						extracted.push({
							src: resolvedSrc,
							alt,
							title,
						});
					}
				}
			}
		});
	} catch (err) {
		console.error(`[image-extractor] Failed to parse MDX for ${filePath}:`, err);
	}

	return extracted;
}
