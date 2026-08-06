export interface SeoMetaOptions {
	title?: string;
	description?: string;
	image?: string;
}

export function getSeoMeta(options: SeoMetaOptions = {}) {
	const {
		title = "laniakita.com",
		description = "Lani's corner on the web",
		image = "/opengraph/static/home",
	} = options;

	return [
		{ title },
		{ name: "description", content: description },
		// Open Graph
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image", content: image },
		// Twitter
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image", content: image },
	];
}
