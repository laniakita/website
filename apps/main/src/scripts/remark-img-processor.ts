import fs from "node:fs";
import path from "node:path";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import { resolveAssetEntry } from "./asset-processor/resolver";
import type { AssetManifestEntry } from "./asset-processor/types";

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
	// biome-ignore lint/style/noNonNullAssertion: `assetManifestCache` gets set to empty object if parse fails, so it's always defined.
	return assetManifestCache!;
}

/**
 * Configuration options for the remark-img-processor plugin.
 */
export interface RemarkImgProcessorOptions {
	/**
	 * Whether to attach the generated LQIP (Low Quality Image Placeholder) CSS string
	 * as a `data-lqip` attribute to discovered `img` nodes. Defaults to true.
	 */
	addLqipAttribute?: boolean;
}

/**
 * A remark/rehype plugin that processes local image/video references in Markdown and MDX.
 * It resolves local paths against the `asset-manifest.json` cache and replaces them with
 * their public R2 URLs. It also injects a `data-lqip` attribute for lazy loading placeholders.
 *
 * @param options - Plugin configuration options.
 * @returns A unified transformer function.
 */
export function remarkImgProcessor(options: RemarkImgProcessorOptions = {}) {
	const addLqipAttribute = options.addLqipAttribute == null ? true : options.addLqipAttribute;

	// The second argument to a unified plugin transformer is a VFile.
	return (tree: Node, file: { path: string }) => {
		const manifest = getManifest();
		const filePath = file.path;

		visit(
			tree,
			// biome-ignore lint/suspicious/noExplicitAny: AST nodes are too dynamic for strict types
			(node: any) => {
				if (node.type === "image" && typeof node.url === "string") {
					if (!node.url.startsWith("http")) {
						const entry = resolveAssetEntry(node.url, filePath, manifest);
						if (entry) {
							node.url = entry.src;
							if (entry.imgData?.css && addLqipAttribute) {
								node.data = node.data || {};
								node.data.hProperties = node.data.hProperties || {};
								// We keep it as a string for standard markdown images which don't support objects well
								node.data.hProperties["data-lqip"] = entry.imgData.css;
							}
						}
					}
				} else if (node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") {
					if (node.name === "img" || node.name === "Image" || node.name === "video") {
						// biome-ignore lint/suspicious/noExplicitAny: AST nodes are too dynamic for strict types
						const srcAttr = node.attributes?.find((a: any) => a.name === "src");
						if (srcAttr && typeof srcAttr.value === "string") {
							const url = srcAttr.value;
							if (!url.startsWith("http")) {
								const entry = resolveAssetEntry(url, filePath, manifest);
								if (entry) {
									srcAttr.value = entry.src;
									if (entry.imgData?.css && addLqipAttribute && node.attributes) {
										node.attributes.push({
											type: "mdxJsxAttribute",
											name: "data-lqip",
											// Pass as a JS expression so it's a real object in props
											value: {
												type: "mdxJsxAttributeValueExpression",
												value: entry.imgData.css,
											},
										});
									}
								}
							}
						}
					}
				}
			},
		);
	};
}
