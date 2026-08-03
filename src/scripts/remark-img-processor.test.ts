import { beforeEach, describe, expect, it, mock } from "bun:test";

const mockResolveAssetEntry = mock(
	(
		_assetPath: string,
		_currentFilePath: string,
		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		_assetManifest: Record<string, any>,
	) => ({
		src: "https://mock.cdn/img.jpg",
		imgData: {
			css: '{"backgroundImage":"linear-gradient(to right, red, blue)"}',
			width: 800,
			height: 600,
		},
		localHash: "mock-hash",
	}),
);

mock.module("./asset-processor/resolver", () => ({
	resolveAssetEntry: mockResolveAssetEntry,
}));

mock.module("node:fs", () => ({
	default: {
		readFileSync: () => "{}",
	},
}));

import type { Parent } from "unist";
// Must import after mocking
import { remarkImgProcessor } from "./remark-img-processor";

describe("remarkImgProcessor", () => {
	beforeEach(() => {
		mockResolveAssetEntry.mockClear();
	});

	const mockOptions = {
		addLqipAttribute: true,
	};

	it("should replace markdown image urls and inject data-lqip", async () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "image",
					url: "./local-image.jpg",
					alt: "Local",
				},
				{
					type: "mdxJsxFlowElement",
					name: "img",
					attributes: [{ name: "src", value: "./jsx-image.jpg" }],
				},
			],
		} as unknown as Parent;

		const plugin = remarkImgProcessor(mockOptions);
		await plugin(tree, { path: "/fake/path/post.md" });

		expect(mockResolveAssetEntry).toHaveBeenCalledTimes(2);

		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const mdImage = tree.children[0] as any;
		expect(mdImage.url).toBe("https://mock.cdn/img.jpg");
		expect(mdImage.data.hProperties?.["data-lqip"]).toBe(
			'{"backgroundImage":"linear-gradient(to right, red, blue)"}',
		);

		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const jsxImg = tree.children[1] as any;
		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const srcAttr = jsxImg.attributes?.find((a: any) => a.name === "src");
		const lqipAttr = jsxImg.attributes?.find(
			// biome-ignore lint/suspicious/noExplicitAny: AST attributes
			(a: any) => a.name === "data-lqip",
		);

		expect(srcAttr.value).toBe("https://mock.cdn/img.jpg");
		expect(lqipAttr.value).toEqual({
			type: "mdxJsxAttributeValueExpression",
			value: '{"backgroundImage":"linear-gradient(to right, red, blue)"}',
		});
	});

	it("should skip generating lqip if options specify addLqipAttribute: false", async () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "image",
					url: "./local-image.jpg",
					alt: "Local",
				},
				{
					type: "mdxJsxFlowElement",
					name: "img",
					attributes: [{ name: "src", value: "./jsx-image.jpg" }],
				},
			],
		} as unknown as Parent;

		const plugin = remarkImgProcessor({ addLqipAttribute: false });
		await plugin(tree, { path: "/fake/path/post.md" });

		expect(mockResolveAssetEntry).toHaveBeenCalledTimes(2);

		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const mdImage = tree.children[0] as any;
		expect(mdImage.url).toBe("https://mock.cdn/img.jpg");
		expect(mdImage.data).toBeUndefined(); // data is not created if no lqip

		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const jsxImg = tree.children[1] as any;
		const lqipAttr = jsxImg?.attributes?.find(
			// biome-ignore lint/suspicious/noExplicitAny: AST attributes
			(a: any) => a.name === "data-lqip",
		);
		expect(lqipAttr).toBeUndefined();
	});

	it("should ignore external urls", async () => {
		const tree = {
			type: "root",
			children: [
				{
					type: "image",
					url: "https://example.com/external.jpg",
					alt: "External",
				},
			],
		} as unknown as Parent;

		const plugin = remarkImgProcessor(mockOptions);
		await plugin(tree, { path: "/fake/path/post.md" });

		expect(mockResolveAssetEntry).not.toHaveBeenCalled();
		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const mdImage = tree.children[0] as any;
		expect(mdImage.url).toBe("https://example.com/external.jpg");
	});
});
