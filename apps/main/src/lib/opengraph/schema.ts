import * as v from "valibot";

export enum OgVariant {
	Home = "home",
	Static = "static",
	Dynamic = "dynamic",
	Image = "image",
}

export interface HomeOgBody {
	variant: OgVariant.Home;
	twitter?: boolean;
	version?: string;
}

export interface StaticOgBody {
	variant: OgVariant.Static;
	title: string;
	twitter?: boolean;
	version?: string;
}

export interface DynamicOgBody {
	variant: OgVariant.Dynamic;
	title: string;
	prefix?: string;
	twitter?: boolean;
	version?: string;
}

export interface ImageOgBody {
	variant: OgVariant.Image;
	imageUrl: string;
	twitter?: boolean;
	version?: string;
}

export type OpenGraphBody = HomeOgBody | StaticOgBody | DynamicOgBody | ImageOgBody;

export const OpenGraphQuerySchema = v.object({
	variant: v.optional(v.fallback(v.enum(OgVariant), OgVariant.Static), OgVariant.Static),
	title: v.optional(v.string(), "Lani Akita"),
	prefix: v.optional(v.string(), "Lani Akita"),
	imageUrl: v.optional(v.string()),
	version: v.optional(v.string()),
	twitter: v.optional(
		v.pipe(
			v.union([v.string(), v.boolean()]),
			v.transform((val) => val === true || val === "true"),
		),
		false,
	),
});

export type OpenGraphParams = v.InferOutput<typeof OpenGraphQuerySchema>;

/**
 * Returns standard canvas dimensions for OpenGraph cards.
 * Twitter summary_large_image uses 1600x900 (16:9).
 * Standard OpenGraph uses 1200x630 (~1.91:1).
 */
export function getOgDimensions(isTwitter?: boolean) {
	return {
		width: isTwitter ? 1600 : 1200,
		height: isTwitter ? 900 : 630,
	};
}
