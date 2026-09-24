import * as v from "valibot";
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
 * Reusable schema for hero/featured image metadata.
 */
export const featuredImageSchema = v.optional(
	v.object({
		src: v.string(),
		localHash: v.string(),
		imgData: v.optional(
			v.object({
				css: v.string(),
				height: v.number(),
				width: v.number(),
			}),
		),
		altText: v.optional(v.string()),
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
