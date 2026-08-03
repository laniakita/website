import fs from "node:fs";
import path from "node:path";
import type { Node } from "unist";
import { visit } from "unist-util-visit";
import {
	type ImageManifestEntry,
	type ProcessAssetOptions,
	processAsset,
} from "./asset-processor";

let assetManifestCache: Record<string, ImageManifestEntry> | null = null;

function getManifest(): Record<string, ImageManifestEntry> {
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

export type RemarkImgProcessorOptions = ProcessAssetOptions;

export function remarkImgProcessor(options: RemarkImgProcessorOptions) {
	const generateLqip = options.generatePlaiceholder ?? true;

	// The second argument to a unified plugin transformer is a VFile.
	return async (tree: Node, file: { path: string }) => {
		const manifest = getManifest();
		const filePath = file.path;
		const promises: Promise<void>[] = [];

		visit(
			tree,
			// biome-ignore lint/suspicious/noExplicitAny: AST nodes are too dynamic for strict types
			(node: any) => {
				if (node.type === "image" && typeof node.url === "string") {
					if (!node.url.startsWith("http")) {
						promises.push(
							processAsset(node.url, manifest, filePath, {
								generatePlaiceholder: generateLqip,
								...options,
							}).then((entry) => {
								if (entry) {
									node.url = entry.src;
									if (entry.css && generateLqip) {
										node.data = node.data || {};
										node.data.hProperties = node.data.hProperties || {};
										// We keep it as a string for standard markdown images which don't support objects well
										node.data.hProperties["data-lqip"] = entry.css;
									}
								}
							}),
						);
					}
				} else if (
					node.type === "mdxJsxFlowElement" ||
					node.type === "mdxJsxTextElement"
				) {
					if (
						node.name === "img" ||
						node.name === "Image" ||
						node.name === "video"
					) {
						// biome-ignore lint/suspicious/noExplicitAny: AST nodes are too dynamic for strict types
						const srcAttr = node.attributes?.find((a: any) => a.name === "src");
						if (srcAttr && typeof srcAttr.value === "string") {
							const url = srcAttr.value;
							if (!url.startsWith("http")) {
								promises.push(
									processAsset(url, manifest, filePath, {
										generatePlaiceholder: generateLqip,
										...options,
									}).then((entry) => {
										if (entry) {
											srcAttr.value = entry.src;
											if (entry.css && generateLqip && node.attributes) {
												node.attributes.push({
													type: "mdxJsxAttribute",
													name: "data-lqip",
													// Pass as a JS expression so it's a real object in props
													value: {
														type: "mdxJsxAttributeValueExpression",
														value: entry.css,
													},
												});
											}
										}
									}),
								);
							}
						}
					}
				}
			},
		);

		await Promise.all(promises);
	};
}
