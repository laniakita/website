import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import mime from "mime-types";
import { getPlaiceholder } from "plaiceholder";



function calculateHash(buffer: Buffer): string {
	return crypto.createHash("md5").update(buffer).digest("hex");
}

export interface ImageManifestEntry {
	localHash: string;
	src: string;
	css?: string;
	width?: number;
	height?: number;
}

export interface ProcessAssetOptions {
	generatePlaiceholder?: boolean;
	r2Endpoint: string;
	r2Bucket: string;
	r2AccessKey: string;
	r2SecretKey: string;
	r2PublicUrl: string;
}

async function uploadToR2(
	fileName: string,
	buffer: Buffer,
	mimeType: string,
	options: ProcessAssetOptions,
): Promise<boolean> {
	if (!options.r2Endpoint) {
		console.warn(
			"[warn] r2Endpoint not set. Skipping upload for:",
			fileName,
		);
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

export async function processAsset(
	assetPath: string,
	assetManifest: Record<string, ImageManifestEntry>,
	file: string,
	options: ProcessAssetOptions,
): Promise<ImageManifestEntry | null> {
	if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
		return null;
	}

	let parsedPath = assetPath;
	if (assetPath.startsWith("file://")) {
		try {
			parsedPath = fileURLToPath(assetPath);
		} catch (_err) {
			// Fallback if parsing fails
		}
	}

	let imagePath = path.resolve(path.dirname(file), parsedPath);

	const dotContentPath = path.join(process.cwd(), ".content");
	if (imagePath.startsWith(dotContentPath)) {
		imagePath = imagePath.replace(
			dotContentPath,
			path.join(process.cwd(), "content"),
		);
	}

	try {
		if (!fs.existsSync(imagePath)) {
			console.warn(
				`[warn] Asset not found locally, skipping upload: ${imagePath}`,
			);
			return null;
		}
		const imageBuffer = fs.readFileSync(imagePath);
		const mimeType = mime.lookup(imagePath) || "application/octet-stream";
		const localHash = calculateHash(imageBuffer);
		const manifestKey = path.relative(process.cwd(), imagePath);
		const cachedImage = assetManifest[manifestKey];

		if (!cachedImage || cachedImage.localHash !== localHash) {
			console.log(`[info] Processing asset ${assetPath} for ${file}...`);

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
				const {
					css: plaiceholderCss,
					metadata: { width: plaiceholderWidth, height: plaiceholderHeight },
				} = await getPlaiceholder(imageBuffer);
				css = JSON.stringify({
					...plaiceholderCss,
					filter: "blur(20px)",
					transform: "scale(1.1)",
				});
				width = plaiceholderWidth;
				height = plaiceholderHeight;
			}

			const assetsDir = path.join(process.cwd(), "content", "assets");
			let fileName = path
				.relative(assetsDir, imagePath)
				.split(path.sep)
				.join("/");

			if (fileName.startsWith("..")) {
				const ext = path.extname(imagePath);
				fileName = `assets/${localHash}${ext}`;
			}

			const success = await uploadToR2(fileName, imageBuffer, mimeType, options);

			if (success) {
				const publicUrl = options.r2PublicUrl;
				const bucketName = options.r2Bucket;
				const entry: ImageManifestEntry = {
					localHash,
					src: publicUrl
						? `${publicUrl}/${bucketName}/${fileName}`
						: `https://${bucketName}.r2.cloudflarestorage.com/${fileName}`,
				};
				if (css) entry.css = css;
				if (width) entry.width = width;
				if (height) entry.height = height;

				assetManifest[manifestKey] = entry;

				// Save manifest right away
				fs.writeFileSync(
					"asset-manifest.json",
					JSON.stringify(assetManifest, null, 2),
				);

				return entry;
			} else {
				throw new Error(`Upload to R2 failed for ${fileName}`);
			}
		} else {
			console.log(`[info] Skipping upload for ${assetPath} - already cached`);
			return cachedImage;
		}
	} catch (err) {
		console.error(`Failed to process asset ${assetPath} for ${file}:`, err);
		return null;
	}
}
