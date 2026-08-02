import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
	DeleteObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getPlaiceholder } from "plaiceholder";

// R2 Client
const s3Client = new S3Client({
	region: "auto",
	endpoint: process.env.R2_ENDPOINT_URL || "",
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
	},
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";

function calculateHash(buffer: Buffer): string {
	return crypto.createHash("md5").update(buffer).digest("hex");
}

async function uploadToR2(
	fileName: string,
	buffer: Buffer,
	mimeType: string,
): Promise<boolean> {
	if (!process.env.R2_ENDPOINT_URL) {
		console.warn(
			"[warn] R2_ENDPOINT_URL not set. Skipping upload for:",
			fileName,
		);
		return false;
	}

	const command = new PutObjectCommand({
		Bucket: BUCKET_NAME,
		Key: fileName,
		Body: buffer,
		ContentType: mimeType,
	});

	try {
		await s3Client.send(command);
		console.log(`[success] Uploaded ${fileName} to R2`);
		return true;
	} catch (err) {
		console.error(`[error] Failed to upload ${fileName} to R2:`, err);
		return false;
	}
}

async function deleteFromR2(fileName: string) {
	if (!process.env.R2_ENDPOINT_URL) return;

	const command = new DeleteObjectCommand({
		Bucket: BUCKET_NAME,
		Key: fileName,
	});

	try {
		await s3Client.send(command);
		console.log(`[success] Deleted old file ${fileName} from R2`);
	} catch (err) {
		console.warn(`[warn] Failed to delete ${fileName} from R2:`, err);
	}
}

export interface ImageManifestEntry {
	localHash: string;
	src: string;
	css?: Record<string, string>;
	width?: number;
	height?: number;
}

export async function processAsset(
	assetPath: string,
	assetManifest: Record<string, ImageManifestEntry>,
	file: string,
	options: { generatePlaiceholder?: boolean } = {},
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

	const imagePath = path.resolve(path.dirname(file), parsedPath);

	try {
		const bunFile = Bun.file(imagePath);
		if (!(await bunFile.exists())) {
			console.warn(
				`[warn] Asset not found locally, skipping upload: ${imagePath}`,
			);
			return null;
		}
		const imageBuffer = Buffer.from(await bunFile.arrayBuffer());
		const mimeType = bunFile.type || "application/octet-stream";
		const localHash = calculateHash(imageBuffer);
		const manifestKey = path.relative(process.cwd(), imagePath);
		const cachedImage = assetManifest[manifestKey];

		if (!cachedImage || cachedImage.localHash !== localHash) {
			console.log(`[info] Processing asset ${assetPath} for ${file}...`);

			if (cachedImage?.localHash && cachedImage?.src) {
				const urlParts = cachedImage.src.split("/");
				const oldFileName = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
				await deleteFromR2(oldFileName);
			}

			let css: Record<string, string> | undefined;
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
				// Extend with blur effect as recommended by plaiceholder
				css = {
					...plaiceholderCss,
					filter: "blur(20px)",
					transform: "scale(1.1)", // prevent blur from leaking past edges
				};
				width = plaiceholderWidth;
				height = plaiceholderHeight;
			}

			const ext = path.extname(imagePath);
			const fileName = `assets/${localHash}${ext}`;

			const uploadSuccess = await uploadToR2(fileName, imageBuffer, mimeType);

			if (uploadSuccess) {
				const publicUrl = process.env.R2_PUBLIC_URL || "";
				const entry: ImageManifestEntry = {
					localHash,
					src: `${publicUrl}/${fileName}`,
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
			return cachedImage;
		}
	} catch (err) {
		console.error(`Failed to process asset ${assetPath} for ${file}:`, err);
		return null;
	}
}
