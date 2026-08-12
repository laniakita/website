import * as v from "valibot";

export enum OgVariant {
	Home = "home",
	Static = "static",
	Dynamic = "dynamic",
	Image = "image",
}

export const BaseOgSchema = {
	twitter: v.optional(v.boolean(), false),
	version: v.string(),
};

export const HomeOgSchema = v.object({
	variant: v.literal(OgVariant.Home),
	...BaseOgSchema,
});

export const StaticOgSchema = v.object({
	variant: v.literal(OgVariant.Static),
	title: v.pipe(v.string(), v.maxLength(200)),
	...BaseOgSchema,
});

export const DynamicOgSchema = v.object({
	variant: v.literal(OgVariant.Dynamic),
	title: v.pipe(v.string(), v.maxLength(200)),
	prefix: v.pipe(v.string(), v.maxLength(200)),
	...BaseOgSchema,
});

export const ImageOgSchema = v.object({
	variant: v.literal(OgVariant.Image),
	imageUrl: v.pipe(v.string(), v.url()),
	...BaseOgSchema,
});

export const OpenGraphBodySchema = v.variant("variant", [HomeOgSchema, StaticOgSchema, DynamicOgSchema, ImageOgSchema]);

export const OpenGraphHeaderSchema = v.object({
	authorization: v.pipe(v.string(), v.description("Bearer token for authorization")),
});

export type OpenGraphBody = v.InferOutput<typeof OpenGraphBodySchema>;
