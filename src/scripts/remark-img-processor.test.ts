import { beforeEach, describe, expect, it, mock } from "bun:test";

const mockProcessAsset = mock(
	async (
		_assetPath: string,
		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		_assetManifest: Record<string, any>,
		_file: string,
		_options: { generatePlaiceholder?: boolean } = {},
	) => ({
		src: "https://mock.cdn/img.jpg",
		css: '{"backgroundImage":"linear-gradient(to right, red, blue)"}',
		localHash: "mock-hash",
		width: 800,
		height: 600,
	}),
);

mock.module("./asset-processor", () => ({
	processAsset: mockProcessAsset,
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
		mockProcessAsset.mockClear();
	});

	const mockOptions = {
		r2Endpoint: "https://mock.endpoint",
		r2Bucket: "mock-bucket",
		r2AccessKey: "mock-key",
		r2SecretKey: "mock-secret",
		r2PublicUrl: "https://mock.public",
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

		expect(mockProcessAsset).toHaveBeenCalledTimes(2);

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

	it("should skip generating lqip if options specify generateLqip: false", async () => {
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

		const plugin = remarkImgProcessor({ ...mockOptions, generatePlaiceholder: false });
		await plugin(tree, { path: "/fake/path/post.md" });

		// It should call processAsset but pass generatePlaiceholder: false
		expect(mockProcessAsset).toHaveBeenCalledTimes(2);
		expect(mockProcessAsset.mock.calls[0][3]).toMatchObject({
			generatePlaiceholder: false,
		});

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

		expect(mockProcessAsset).not.toHaveBeenCalled();
		// biome-ignore lint/suspicious/noExplicitAny: AST attributes
		const mdImage = tree.children[0] as any;
		expect(mdImage.url).toBe("https://example.com/external.jpg");
	});
});
