/**
 * Normalizes relative public filesystem paths (e.g. `../../../../public/images/bear.jpg`)
 * to root-relative web URLs (`/images/bear.jpg`).
 */
export function normalizePublicAssetUrl(src: string): string {
	if (!src) return "";
	if (src.startsWith("http://") || src.startsWith("https://") || src.startsWith("/")) {
		return src;
	}
	// Normalize Windows backslashes and strip path prefix up to /public/
	const normalized = src.replace(/\\/g, "/");
	return normalized.replace(/.*(?:\/|^)public\//, "/");
}
