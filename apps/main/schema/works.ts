import { defineCollections } from "fumadocs-mdx/config";
import matter from "gray-matter";
import * as v from "valibot";
import { descriptionHelper } from "./description-helper";
import {
	coerceDate,
	featuredImageSchema,
	inlineImagesSchema,
	optionalDate,
	resolveFeaturedImage,
} from "./shared";

export const works = defineCollections({
	type: "doc",
	dir: "./content/works",
	async: true,
	schema: (ctx) => {
		return v.pipe(
			v.object({
				id: v.string(),
				createdAt: coerceDate,
				lastModified: optionalDate,
				title: v.string(),
				source: v.optional(
					v.string(),
					() => `${ctx.path.split("content").pop()?.split(".").shift()}`,
				),
				type: v.optional(v.picklist(["client", "personal"]), "personal"),
				active: v.optional(v.boolean(), false),
				links: v.optional(
					v.array(
						v.object({
							label: v.string(),
							url: v.string(),
						}),
					),
				),
				tech: v.array(v.string()),
				imageSrc: v.optional(v.string()),
				altText: v.optional(v.string()),
				description: v.optional(v.string(), () => {
					const content = matter(ctx.source);
					return (
						descriptionHelper(content.content, ctx.path, true) ??
						"Works description"
					);
				}),
				featured_image: featuredImageSchema,
				inlineImages: inlineImagesSchema(ctx),
			}),
			v.transform((input) => {
				const featured_image =
					input.featured_image ?? resolveFeaturedImage(input.imageSrc, input.altText);
				return {
					...input,
					featured_image,
				};
			}),
		);
	},
});
