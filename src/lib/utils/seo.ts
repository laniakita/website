export interface SeoMetaOptions {
	title?: string;
	description?: string;
	image?: string;
	imageAlt?: string;
	authors?: string[];
}

export function getSeoMeta(options: SeoMetaOptions = {}) {
	const {
		title = "laniakita.com",
		description = "Lani's corner on the web",
		authors = ["Lani Akita"],
		image = "/opengraph/static/home",
		imageAlt = "Blog post header",
	} = options;

	return [
		{ title },
		...authors.map((authr) => ({ name: "author", content: authr })),
		{ name: "description", content: description },
		// Open Graph
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image:alt", content: imageAlt },
		{ property: "og:image:url", content: image },
		{ property: "og:image:type", content: "image/png" },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		// Twitter
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image:url", content: `${image}?twitter=true` },
		{ name: "twitter:image:type", content: "image/png" },
		{ name: "twitter:image:alt", content: imageAlt },
		{ name: "twitter:image:width", content: "1600" },
		{ name: "twitter:image:height", content: "900" },
	];
}
