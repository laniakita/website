/**
 * Metadata associated with image assets.
 */
export interface ImageData {
	/** CSS string for Low Quality Image Placeholder (LQIP), typically generating a blurred background. */
	css: string;
	/** Original width of the image. */
	width: number;
	/** Original height of the image. */
	height: number;
}

/**
 * An entry within the asset manifest representing a processed and uploaded file.
 */
export interface AssetManifestEntry {
	/** MD5 hash of the original local file content. Used to detect changes. */
	localHash: string;
	/** Public URL pointing to the uploaded asset in the R2 bucket. */
	src: string;
	/** Optional image-specific metadata, present only if the asset is an image. */
	imgData?: ImageData;
}

/**
 * Configuration options for processing and uploading assets to Cloudflare R2.
 */
export interface ProcessAssetOptions {
	/** Whether to generate a Low Quality Image Placeholder (LQIP) for images. */
	generatePlaiceholder?: boolean;
	/** Cloudflare R2 endpoint URL. */
	endpoint: string;
	/** Target R2 bucket name. */
	bucket: string;
	/** R2 access key ID. */
	accessKey: string;
	/** R2 secret access key. */
	secretKey: string;
	/** Public URL prefix where the R2 bucket is exposed. */
	publicUrl: string;
}
