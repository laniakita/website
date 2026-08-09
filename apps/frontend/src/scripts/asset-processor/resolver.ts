import path from "node:path";
import { fileURLToPath } from "node:url";
import type { AssetManifestEntry } from "./types";

/**
 * Resolves a local asset path against the cached asset manifest.
 * Maps paths referencing the generated `.content` directory back to the source `content` directory.
 *
 * @param assetPath - The raw URL or path of the asset (e.g. from frontmatter or a markdown image node).
 * @param currentFilePath - The absolute path of the file containing the asset reference, used to resolve relative paths.
 * @param assetManifest - The current asset manifest containing cached file state.
 * @returns The resolved asset manifest entry if found, otherwise null (e.g. for external URLs or missing assets).
 */
export function resolveAssetEntry(
	assetPath: string,
	currentFilePath: string,
	assetManifest: Record<string, AssetManifestEntry>,
): AssetManifestEntry | null {
	if (assetPath.startsWith("http://") || assetPath.startsWith("https://")) {
		return null;
	}

	let parsedPath = assetPath;
	if (assetPath.startsWith("file://")) {
		try {
			parsedPath = fileURLToPath(assetPath);
		} catch (_err) {
			// Fallback if parsing fails
			throw new Error(`Failed to parse asset path: ${assetPath}`);
		}
	}

	let imagePath = path.resolve(path.dirname(currentFilePath), parsedPath);

	const dotContentPath = path.join(process.cwd(), ".content");
	if (imagePath.startsWith(dotContentPath)) {
		imagePath = imagePath.replace(dotContentPath, path.join(process.cwd(), "content"));
	}

	const manifestKey = path.relative(process.cwd(), imagePath);
	return assetManifest[manifestKey] || null;
}
