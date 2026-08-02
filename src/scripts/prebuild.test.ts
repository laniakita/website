import { afterEach, beforeEach, describe, expect, it, mock } from "bun:test";
import { readdir, rm } from "node:fs/promises";
import { getPlaiceholder } from "plaiceholder";

mock.module("node:fs/promises", () => ({
	readdir: mock(),
	rm: mock(),
}));

mock.module("plaiceholder", () => ({
	getPlaiceholder: mock(),
}));

import { spyOn } from "bun:test";
import { S3Client } from "@aws-sdk/client-s3";
// Import after mocking
import { processFrontmatter } from "./prebuild";

describe("prebuild script", () => {
	beforeEach(() => {
		mock.restore();
		spyOn(S3Client.prototype, "send").mockResolvedValue({} as never);

		const mockReaddir = readdir as import("bun:test").Mock<any>;
		const mockRm = rm as import("bun:test").Mock<any>;
		const mockGetPlaiceholder = getPlaiceholder as import("bun:test").Mock<any>;
		mockReaddir.mockClear();
		mockRm.mockClear();
		mockGetPlaiceholder.mockClear();
		mockRm.mockResolvedValue(undefined);

		// Set up environment variables
		process.env.R2_ENDPOINT_URL = "https://mock.endpoint";
		process.env.R2_PUBLIC_URL = "https://assets.mock";
		process.env.R2_BUCKET_NAME = "mock-bucket";
	});

	afterEach(() => {
		delete process.env.R2_ENDPOINT_URL;
		delete process.env.R2_PUBLIC_URL;
		delete process.env.R2_BUCKET_NAME;
	});

	it("should process frontmatter and upload image when hash changes", async () => {
		const mockPostContent = `---
title: Test Post
catSlugs: ["tech"]
tagSlugs: ["js"]
imageSrc: "content/assets/test.jpg"
---
Post body`;

		const mockCategoryContent = `---
title: Technology
type: category
---`;

		const mockTagContent = `---
title: JavaScript
type: tag
---`;

		const mockBunFile = spyOn(Bun, "file");
		const mockBunWrite = spyOn(Bun, "write");
		const mockReaddir = readdir as import("bun:test").Mock<any>;
		const mockGetPlaiceholder = getPlaiceholder as import("bun:test").Mock<any>;

		mockReaddir.mockImplementation(async (dir: any) => {
			const p = dir.toString();
			if (p.endsWith("categories"))
				return [
					{
						isFile: () => true,
						name: "tech.md",
						path: p,
						parentPath: p,
					} as any,
				];
			if (p.endsWith("tags"))
				return [
					{ isFile: () => true, name: "js.md", path: p, parentPath: p } as any,
				];
			if (p.endsWith("posts"))
				return [
					{
						isFile: () => true,
						name: "post1.md",
						path: p,
						parentPath: p,
					} as any,
				];
			if (p.endsWith("content"))
				return [
					{
						isFile: () => true,
						name: "tech.md",
						path: p + "/categories",
						parentPath: p + "/categories",
					} as any,
					{
						isFile: () => true,
						name: "js.md",
						path: p + "/tags",
						parentPath: p + "/tags",
					} as any,
					{
						isFile: () => true,
						name: "post1.md",
						path: p + "/posts",
						parentPath: p + "/posts",
					} as any,
				];
			return [];
		});

		mockBunFile.mockImplementation((filepath: any) => {
			const p = filepath.toString();
			if (p.includes("tech.md"))
				return {
					text: async () => mockCategoryContent,
					arrayBuffer: async () => Buffer.from(mockCategoryContent).buffer,
				} as any;
			if (p.includes("js.md"))
				return {
					text: async () => mockTagContent,
					arrayBuffer: async () => Buffer.from(mockTagContent).buffer,
				} as any;
			if (p.includes("post1.md"))
				return {
					text: async () => mockPostContent,
					arrayBuffer: async () => Buffer.from(mockPostContent).buffer,
				} as any;
			if (p.includes("test.jpg"))
				return {
					arrayBuffer: async () => Buffer.from("fake-image-data").buffer,
					text: async () => "",
				} as any;
			return {
				text: async () => "",
				arrayBuffer: async () => new ArrayBuffer(0),
			} as any;
		});

		mockBunWrite.mockResolvedValue(0 as any);

		mockGetPlaiceholder.mockResolvedValue({
			base64: "mock-base64",
			metadata: { width: 800, height: 600 },
		} as any);

		await processFrontmatter();

		// Verify Bun.file was called for images
		expect(mockBunFile).toHaveBeenCalled();

		// Verify getPlaiceholder was called
		expect(mockGetPlaiceholder).toHaveBeenCalled();

		// Verify Bun.write was called with updated frontmatter
		expect(mockBunWrite).toHaveBeenCalled();
		const postWriteCall = mockBunWrite.mock.calls.find((call) =>
			call[0].toString().includes("post1.md"),
		);
		expect(postWriteCall).toBeDefined();

		if (postWriteCall) {
			const [writtenPath, writtenContent] = postWriteCall;
			expect(writtenPath.toString()).toContain(".content/posts/post1.md");
			expect(writtenContent).toContain("categories:");
			expect(writtenContent).toContain("Technology");
			expect(writtenContent).toContain("tags:");
			expect(writtenContent).toContain("JavaScript");
			expect(writtenContent).toContain("featured_image:");
			expect(writtenContent).toContain("src: /assets/");
			expect(writtenContent).toContain("base64: mock-base64");
		}
	});

	it("should skip image upload if localHash matches", async () => {
		const fakeImageBuffer = Buffer.from("fake-image-data");
		const hasher = new Bun.CryptoHasher("md5");
		hasher.update(fakeImageBuffer);
		const expectedHash = hasher.digest("hex");

		const mockPostContent = `---
title: Test Post
imageSrc: "content/assets/test.jpg"
featured_image:
  localHash: "${expectedHash}"
---
Post body`;

		const mockBunFile = spyOn(Bun, "file");
		const mockBunWrite = spyOn(Bun, "write");
		const mockReaddir = readdir as import("bun:test").Mock<any>;
		const mockGetPlaiceholder = getPlaiceholder as import("bun:test").Mock<any>;

		mockReaddir.mockImplementation(async (dir: any) => {
			const p = dir.toString();
			if (p.endsWith("posts"))
				return [
					{
						isFile: () => true,
						name: "post1.md",
						path: p,
						parentPath: p,
					} as any,
				];
			if (p.endsWith("content"))
				return [
					{
						isFile: () => true,
						name: "post1.md",
						path: p + "/posts",
						parentPath: p + "/posts",
					} as any,
				];
			return [];
		});

		mockBunFile.mockImplementation((filepath: any) => {
			const p = filepath.toString();
			if (p.includes("post1.md"))
				return {
					text: async () => mockPostContent,
					arrayBuffer: async () => Buffer.from(mockPostContent).buffer,
				} as any;
			if (p.includes("test.jpg"))
				return {
					arrayBuffer: async () => Buffer.from("fake-image-data").buffer,
					text: async () => "",
				} as any;
			return {
				text: async () => "",
				arrayBuffer: async () => new ArrayBuffer(0),
			} as any;
		});

		mockBunWrite.mockResolvedValue(0 as any);

		await processFrontmatter();

		// Plaiceholder should NOT be called because hash matches
		expect(mockGetPlaiceholder).not.toHaveBeenCalled();

		// Bun.write SHOULD be called, but with the exact same content or copied buffer
		expect(mockBunWrite).toHaveBeenCalled();
		const postWriteCall = mockBunWrite.mock.calls.find((call) =>
			call[0].toString().includes("post1.md"),
		);
		expect(postWriteCall).toBeDefined();

		if (postWriteCall) {
			const [writtenPath, writtenContent] = postWriteCall;
			expect(writtenPath.toString()).toContain(".content/posts/post1.md");
			// Content shouldn't have new categories/tags/featured_image if it matched
			expect(writtenContent.toString()).not.toContain("base64: mock-base64");
		}
	});
});
