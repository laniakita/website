import { loader } from "fumadocs-core/source";
import { defineCollections } from "fumadocs-mdx/macro";
import * as z from "zod";
import { fetchData } from "./utils";

const projects = defineCollections({
	type: "doc",
	dir: "./content/projects",
	schema: (ctx) => {
		return z.object({
			id: z.string(),
			date: z.coerce.date(),
			updated: z.coerce.date().optional(),
			title: z.string(),
			tech: z.array(z.string()),
			imageSrc: z.string().optional(),
			altText: z.string().optional(),
			caption: z.string().optional(),
			description: z.string(),
			altDescription: z.string().optional(),
			blogPost: z.string().optional(),
			embedded: z.boolean(),
			foreignUrl: z.string().optional(),
			url: z
				.string()
				.default(`${ctx.path.split("content").pop()?.split(".").shift()}`),
			featured_image: z
				.object({
					hasImage: z.boolean(),
					src: z.string(),
					base64: z.string(),
					height: z.number(),
					width: z.number(),
					resized: z.string(),
					altText: z.string(),
					caption: z.string(),
					_debug: z
						.object({
							destination: z.string(),
							status: z.object({
								exists: z.boolean(),
								existsInPublic: z.boolean(),
							}),
							didCopy: z.string(),
							reason: z.string(),
						})
						.or(z.null()),
				})
				.default(() => {
					const data = fetchData(ctx.path);
					return data.data.featured_image;
				}),
		});
	},
});

export const projectsSource = loader({
	baseUrl: "/projects",
	source: projects.toFumadocsSource(),
});
