export type ImageUrlBuilderOptions = {
	src: string;
	width?: number;
	quality?: number | string;
};

/**
 * Custom Cloudflare Image Resizing loader for @unpic/react
 * Transforms standard R2 asset URLs into Cloudflare Image Resizing URLs
 */
export function cloudflareLoader({ src, width, quality }: ImageUrlBuilderOptions): string {
	try {
		const url = new URL(src);
		// Transform to Cloudflare Image Resizing URL format
		// e.g. https://<zone>/cdn-cgi/image/width=<width>,quality=<quality>,format=auto/<path>
		const widthParam = width ? `width=${width}` : "width=auto";
		const qualityParam = quality ? `quality=${quality}` : "quality=75";

		return `${url.origin}/cdn-cgi/image/${widthParam},${qualityParam},format=auto${url.pathname}`;
	} catch (_err) {
		// Fallback to original src if URL parsing fails
		return src;
	}
}
