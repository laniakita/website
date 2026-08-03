import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	type Mock,
	mock,
} from "bun:test";
import type { Dirent } from "node:fs";
import fs from "node:fs";
import { readdir, rm } from "node:fs/promises";
import type { BunFile } from "bun";
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

		const mockReaddir = readdir as unknown as Mock<
			(path: Parameters<typeof readdir>[0]) => Promise<Dirent[]>
		>;
		const mockRm = rm as Mock<typeof rm>;
		const mockGetPlaiceholder = getPlaiceholder as Mock<typeof getPlaiceholder>;
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
imageSrc: "../assets/test.jpg"
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
		const mockReaddir = readdir as unknown as Mock<
			(path: Parameters<typeof readdir>[0]) => Promise<Dirent[]>
		>;
		const mockGetPlaiceholder = getPlaiceholder as Mock<typeof getPlaiceholder>;

		const mockExistsSync = spyOn(fs, "existsSync");
		const mockReadFileSync = spyOn(fs, "readFileSync");
		const mockWriteFileSync = spyOn(fs, "writeFileSync");

		mockExistsSync.mockImplementation((filepath) => {
			const p = filepath.toString();
			return !p.includes("content/posts/content/assets");
		});

		mockReadFileSync.mockImplementation(((
			filepath: fs.PathOrFileDescriptor,
		) => {
			const p = filepath.toString();
			if (p.includes("test.jpg")) {
				return Buffer.from("fake-image-data");
			}
			return Buffer.from("");
			// biome-ignore lint/suspicious/noExplicitAny: its a test
		}) as any);

		mockWriteFileSync.mockImplementation(() => {});

		mockReaddir.mockImplementation(
			async (dir: Parameters<typeof readdir>[0]) => {
				const p = dir.toString();
				if (p.endsWith("categories"))
					return [
						{
							isFile: () => true,
							name: "tech.md",
							parentPath: p,
						} as unknown as Dirent,
					];
				if (p.endsWith("tags"))
					return [
						{
							isFile: () => true,
							name: "js.md",
							parentPath: p,
						} as unknown as Dirent,
					];
				if (p.endsWith("posts"))
					return [
						{
							isFile: () => true,
							name: "post1.md",
							parentPath: p,
						} as unknown as Dirent,
					];
				if (p.endsWith("content"))
					return [
						{
							isFile: () => true,
							name: "tech.md",
							parentPath: `${p}/categories`,
						} as unknown as Dirent,
						{
							isFile: () => true,
							name: "js.md",
							parentPath: `${p}/tags`,
						} as unknown as Dirent,
						{
							isFile: () => true,
							name: "post1.md",
							parentPath: `${p}/posts`,
						} as unknown as Dirent,
					];
				return [];
			},
		);

		mockBunFile.mockImplementation(
			(filepath: string | URL | number | Uint8Array | ArrayBufferLike) => {
				const p = filepath.toString();
				if (p.includes("asset-manifest.json"))
					return {
						exists: async () => !p.includes("content/posts/content/assets"),
						json: async () => ({}),
					} as unknown as BunFile;
				if (p.includes("tech.md"))
					return {
						text: async () => mockCategoryContent,
						arrayBuffer: async () => Buffer.from(mockCategoryContent).buffer,
					} as unknown as BunFile;
				if (p.includes("js.md"))
					return {
						text: async () => mockTagContent,
						arrayBuffer: async () => Buffer.from(mockTagContent).buffer,
					} as unknown as BunFile;
				if (p.includes("post1.md"))
					return {
						text: async () => mockPostContent,
						arrayBuffer: async () => Buffer.from(mockPostContent).buffer,
					} as unknown as BunFile;
				if (p.includes("test.jpg"))
					return {
						exists: async () => !p.includes("content/posts/content/assets"),
						arrayBuffer: async () => Buffer.from("fake-image-data").buffer,
						text: async () => "",
					} as unknown as BunFile;
				return {
					exists: async () => !p.includes("content/posts/content/assets"),
					text: async () => "",
					arrayBuffer: async () => new ArrayBuffer(0),
				} as unknown as BunFile;
			},
		);

		mockBunWrite.mockResolvedValue(0);

		mockGetPlaiceholder.mockResolvedValue({
			css: { backgroundImage: "mock-css" },
			metadata: { width: 800, height: 600 },
		} as unknown as Awaited<ReturnType<typeof getPlaiceholder>>);

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
			const contentStr = writtenContent.toString();
			expect(contentStr).toContain("categories:");
			expect(contentStr).toContain("Technology");
			expect(contentStr).toContain("tags:");
			expect(contentStr).toContain("JavaScript");
			expect(contentStr).toContain("featured_image:");
			expect(contentStr).toMatch(
				/src: 'https:\/\/assets\.mock\/.*\/test\.jpg'/,
			);
			expect(contentStr).toContain(
				'{"backgroundImage":"mock-css","filter":"blur(20px)","transform":"scale(1.1)"}',
			);
		}
	});

	it("should skip image upload if localHash matches", async () => {
		const fakeImageBuffer = Buffer.from("fake-image-data");
		const hasher = new Bun.CryptoHasher("md5");
		hasher.update(fakeImageBuffer);
		const expectedHash = hasher.digest("hex");

		const mockPostContent = `---
title: Test Post
imageSrc: "../assets/test.jpg"
---
Post body`;

		const mockBunFile = spyOn(Bun, "file");
		const mockBunWrite = spyOn(Bun, "write");
		const mockReaddir = readdir as unknown as Mock<
			(path: Parameters<typeof readdir>[0]) => Promise<Dirent[]>
		>;
		const mockGetPlaiceholder = getPlaiceholder as Mock<typeof getPlaiceholder>;

		const mockExistsSync = spyOn(fs, "existsSync");
		const mockReadFileSync = spyOn(fs, "readFileSync");

		mockExistsSync.mockImplementation((filepath) => {
			const p = filepath.toString();
			return !p.includes("content/posts/content/assets");
		});

		mockReadFileSync.mockImplementation(((
			filepath: fs.PathOrFileDescriptor,
		) => {
			const p = filepath.toString();
			if (p.includes("test.jpg")) {
				return Buffer.from("fake-image-data");
			}
			return Buffer.from("");
			// biome-ignore lint/suspicious/noExplicitAny: its a test
		}) as any);

		mockReaddir.mockImplementation(
			async (dir: Parameters<typeof readdir>[0]) => {
				const p = dir.toString();
				if (p.endsWith("posts"))
					return [
						{
							isFile: () => true,
							name: "post1.md",
							parentPath: p,
						} as unknown as Dirent,
					];
				if (p.endsWith("content"))
					return [
						{
							isFile: () => true,
							name: "post1.md",
							parentPath: `${p}/posts`,
						} as unknown as Dirent,
					];
				return [];
			},
		);

		mockBunFile.mockImplementation(
			(filepath: string | URL | number | Uint8Array | ArrayBufferLike) => {
				const p = filepath.toString();
				if (p.includes("asset-manifest.json"))
					return {
						exists: async () => !p.includes("content/posts/content/assets"),
						json: async () => ({
							"content/assets/test.jpg": {
								localHash: expectedHash,
								src: "https://assets.mock/assets/some-hash.jpg",
								css: '{"backgroundImage":"mock-css"}',
							},
						}),
					} as unknown as BunFile;
				if (p.includes("post1.md"))
					return {
						text: async () => mockPostContent,
						arrayBuffer: async () => Buffer.from(mockPostContent).buffer,
					} as unknown as BunFile;
				if (p.includes("test.jpg"))
					return {
						exists: async () => !p.includes("content/posts/content/assets"),
						arrayBuffer: async () => Buffer.from("fake-image-data").buffer,
						text: async () => "",
					} as unknown as BunFile;
				return {
					exists: async () => !p.includes("content/posts/content/assets"),
					text: async () => "",
					arrayBuffer: async () => new ArrayBuffer(0),
				} as unknown as BunFile;
			},
		);

		mockBunWrite.mockResolvedValue(0);

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
			expect(writtenContent.toString()).toContain(
				'{"backgroundImage":"mock-css"}',
			);
		}
	});
});
