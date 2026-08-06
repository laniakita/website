import crypto from "node:crypto";
import fs from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { blurhashToImageCssString } from "@unpic/placeholder";
import mime from "mime-types";
import { getPlaiceholder } from "plaiceholder";
import type { AssetManifestEntry, ProcessAssetOptions } from "./types";

/**
 * Calculates the MD5 hash of a given buffer.
 * @param buffer - The file buffer to hash.
 * @returns The hexadecimal representation of the MD5 hash.
 */
function calculateHash(buffer: Buffer): string {
	return crypto.createHash("md5").update(buffer).digest("hex");
}

/**
 * Uploads a file buffer to a Cloudflare R2 bucket.
 * @param fileName - The target path/key in the bucket.
 * @param buffer - The file buffer to upload.
 * @param mimeType - The MIME type of the file.
 * @param options - R2 connection options.
 * @returns A promise that resolves to true if successful, false otherwise.
 */
async function uploadToR2(
	fileName: string,
	buffer: Buffer,
	mimeType: string,
	options: ProcessAssetOptions,
): Promise<boolean> {
	if (!options.r2Endpoint) {
		console.warn("[warn] r2Endpoint not set. Skipping upload for:", fileName);
		return false;
	}

	const client = new S3Client({
		region: "auto",
		endpoint: options.r2Endpoint,
		credentials: {
			accessKeyId: options.r2AccessKey,
			secretAccessKey: options.r2SecretKey,
		},
	});

	const command = new PutObjectCommand({
		Bucket: options.r2Bucket,
		Key: fileName,
		Body: buffer,
		ContentType: mimeType,
	});

	try {
		await client.send(command);
		console.log(`[success] Uploaded ${fileName} to R2`);
		return true;
	} catch (err) {
		console.error(`[error] Failed to upload ${fileName} to R2:`, err);
		return false;
	}
}

/**
 * Deletes a file from a Cloudflare R2 bucket.
 * @param fileName - The target path/key in the bucket to delete.
 * @param options - R2 connection options.
 */
async function deleteFromR2(fileName: string, options: ProcessAssetOptions) {
	if (!options.r2Endpoint) return;

	const client = new S3Client({
		region: "auto",
		endpoint: options.r2Endpoint,
		credentials: {
			accessKeyId: options.r2AccessKey,
			secretAccessKey: options.r2SecretKey,
		},
	});

	const command = new DeleteObjectCommand({
		Bucket: options.r2Bucket,
		Key: fileName,
	});

	try {
		await client.send(command);
		console.log(`[success] Deleted old file ${fileName} from R2`);
	} catch (err) {
		console.warn(`[warn] Failed to delete ${fileName} from R2:`, err);
	}
}

/**
 * Iterates through the assets directory, checking against the cached manifest.
 * New or changed assets are uploaded to R2, old versions are deleted, and
 * image assets are processed to generate LQIP data if enabled.
 *
 * @param assetsDir - The local directory containing assets to process.
 * @param assetManifest - The current asset manifest containing cached file state.
 * @param options - Configuration options for processing and R2 uploading.
 * @returns A promise that resolves to the updated asset manifest.
 */
export async function batchUploadAssets(
	assetsDir: string,
	assetManifest: Record<string, AssetManifestEntry>,
	options: ProcessAssetOptions,
) {
	const dirents = await readdir(assetsDir, {
		withFileTypes: true,
		recursive: true,
	});
	const files = dirents
		.filter((dirent) => dirent.isFile() && !dirent.name.startsWith("."))
		.map((dirent) => path.join(dirent.parentPath, dirent.name));

	let hasChanges = false;

	for (const imagePath of files) {
		const imageBuffer = fs.readFileSync(imagePath);
		const mimeType = mime.lookup(imagePath) || "application/octet-stream";
		const localHash = calculateHash(imageBuffer);
		const manifestKey = path.relative(process.cwd(), imagePath);
		const cachedImage = assetManifest[manifestKey];

		if (!cachedImage || cachedImage.localHash !== localHash) {
			console.log(`[info] Uploading new/changed asset: ${manifestKey}...`);

			if (cachedImage?.localHash && cachedImage?.src) {
				const publicUrl = options.r2PublicUrl;
				let oldFileName = cachedImage.src;
				const bucketName = options.r2Bucket;
				if (publicUrl && oldFileName.startsWith(`${publicUrl}/`)) {
					oldFileName = oldFileName.substring(publicUrl.length + 1);
					if (oldFileName.startsWith(`${bucketName}/`)) {
						oldFileName = oldFileName.substring(bucketName.length + 1);
					}
				} else {
					try {
						oldFileName = new URL(cachedImage.src).pathname.substring(1);
						if (oldFileName.startsWith(`${bucketName}/`)) {
							oldFileName = oldFileName.substring(bucketName.length + 1);
						}
					} catch (_) {
						const urlParts = cachedImage.src.split("/");
						oldFileName =
							urlParts.length >= 2
								? `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`
								: oldFileName;
					}
				}
				if (oldFileName) {
					await deleteFromR2(oldFileName, options);
				}
			}

			let css: string | undefined;
			let width: number | undefined;
			let height: number | undefined;

			if (
				options.generatePlaiceholder &&
				(mimeType.startsWith("image/") ||
					mimeType === "application/octet-stream")
			) {
				try {
					const {
						base64,
						metadata: { width: plaiceholderWidth, height: plaiceholderHeight },
					} = await getPlaiceholder(imageBuffer);
					css = base64;

					width = plaiceholderWidth;
					height = plaiceholderHeight;
				} catch (err) {
					console.log(
						`[info] Skipping plaiceholder generation for ${manifestKey}: ${err}`,
					);
				}
			}

			let fileName = path
				.relative(assetsDir, imagePath)
				.split(path.sep)
				.join("/");

			if (fileName.startsWith("..")) {
				const ext = path.extname(imagePath);
				fileName = `assets/${localHash}${ext}`;
			}

			const success = await uploadToR2(
				fileName,
				imageBuffer,
				mimeType,
				options,
			);

			if (success) {
				const publicUrl = options.r2PublicUrl;
				const entry: AssetManifestEntry = {
					localHash,
					src: `${publicUrl}/${fileName}`,
				};
				if (css && width && height) {
					entry.imgData = {
						css,
						width,
						height,
					};
				}

				assetManifest[manifestKey] = entry;
				hasChanges = true;
			} else {
				throw new Error(`Upload to R2 failed for ${fileName}`);
			}
		}
	}

	if (hasChanges) {
		fs.writeFileSync(
			"asset-manifest.json",
			JSON.stringify(assetManifest, null, 2),
		);
		console.log(`[success] Wrote updated asset-manifest.json`);
	}

	return assetManifest;
}
