import { visit } from "unist-util-visit";
import { normalizePublicAssetUrl } from "../utils/assets";

export function remarkNormalizePublicPaths() {
	// biome-ignore lint/suspicious/noExplicitAny: AST nodes are dynamic
	return (tree: any) => {
		// biome-ignore lint/suspicious/noExplicitAny: AST nodes are dynamic
		visit(tree, (node: any) => {
			if (node.type === "image" && typeof node.url === "string") {
				node.url = normalizePublicAssetUrl(node.url);
			} else if (
				(node.type === "mdxJsxFlowElement" || node.type === "mdxJsxTextElement") &&
				(node.name === "img" || node.name === "Image")
			) {
				// biome-ignore lint/suspicious/noExplicitAny: AST attributes are dynamic
				const srcAttr = node.attributes?.find((a: any) => a.name === "src");
				if (srcAttr && typeof srcAttr.value === "string") {
					srcAttr.value = normalizePublicAssetUrl(srcAttr.value);
				}
			}
		});
	};
}
