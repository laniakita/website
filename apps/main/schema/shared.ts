import fs from "node:fs";
import path from "node:path";
import { imageSize } from "@fumari/image-size";
import * as v from "valibot";
import { normalizePublicAssetUrl } from "../src/lib/utils/assets";
import { extractImagesFromMdx } from "./image-extractor";

/**
 * Coerces string, number, or Date input to a Date object.
 */
export const coerceDate = v.pipe(
	v.union([v.string(), v.number(), v.date()]),
	v.toDate(),
);

/**
 * Optional date defaulting to the current date and time.
 */
export const defaultCreatedAt = v.optional(coerceDate, () => new Date());

/**
 * Optional date with no default value.
 */
export const optionalDate = v.optional(coerceDate);

/**
 * Resolves a featured image by normalizing its path and probing its intrinsic dimensions.
 */
export function resolveFeaturedImage(imageSrc?: string, altText?: string, caption?: string) {
	if (!imageSrc) return undefined;
	const cleanSrc = normalizePublicAssetUrl(imageSrc);
	const publicPath = path.resolve(import.meta.dirname, "../public", cleanSrc.replace(/^\//, ""));

	let width: number | undefined;
	let height: number | undefined;
	try {
		if (fs.existsSync(publicPath)) {
			const size = imageSize(fs.readFileSync(publicPath));
			width = size?.width;
			height = size?.height;
		}
	} catch {
		// fallback if probe fails
	}

	return {
		src: cleanSrc,
		altText,
		caption,
		width,
		height,
	};
}

/**
 * Reusable schema for hero/featured image metadata.
 */
export const featuredImageSchema = v.optional(
	v.object({
		src: v.string(),
		width: v.optional(v.number()),
		height: v.optional(v.number()),
		altText: v.optional(v.string()),
		caption: v.optional(v.string()),
		imgData: v.optional(
			v.object({
				css: v.string(),
				height: v.number(),
				width: v.number(),
			}),
		),
	}),
);

export type FeaturedImage = v.InferOutput<typeof featuredImageSchema>;

/**
 * Reusable schema for inline MDX images with lazy extraction.
 */
export const inlineImagesSchema = (ctx: { source: string; path: string }) =>
	v.optional(
		v.array(
			v.object({
				src: v.string(),
				alt: v.optional(v.string()),
				title: v.optional(v.string()),
			}),
		),
		() => extractImagesFromMdx(ctx.source, ctx.path),
	);

/**
 * Reusable schema for taxonomy items (categories/tags).
 */
export const taxonomyItemSchema = v.object({
	title: v.string(),
	url: v.string(),
	type: v.string(),
});

export type TaxonomyItem = v.InferOutput<typeof taxonomyItemSchema>;
