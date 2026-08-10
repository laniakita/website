export interface OgParams {
	title: string;
	prefix?: string;
	dynamic?: boolean;
}

export interface SeoMetaOptions {
	title?: string;
	description?: string;
	lastModified?: number | string | Date;
	ogParams?: OgParams;
	imageAlt?: string;
	authors?: string[];
}

export async function getOgImageUrls(ogParams: OgParams) {
	const { title, prefix, dynamic = true } = ogParams;

	const defaultUrlParams = new URLSearchParams();
	defaultUrlParams.set("title", title);
	if (prefix) defaultUrlParams.set("prefix", prefix);
	defaultUrlParams.set("dynamic", String(dynamic));

	const twitterUrlParams = new URLSearchParams();
	twitterUrlParams.set("title", title);
	if (prefix) twitterUrlParams.set("prefix", prefix);
	twitterUrlParams.set("dynamic", String(dynamic));
	twitterUrlParams.set("twitter", "true");

	return {
		default: `/opengraph?${defaultUrlParams.toString()}`,
		twitter: `/opengraph?${twitterUrlParams.toString()}`,
	};
}

export async function getSeoMeta(options: SeoMetaOptions = {}) {
	const {
		title = "laniakita.com",
		description = "Lani's corner on the web",
		authors = ["Lani Akita"],
		ogParams = { title: "Home", dynamic: false },
		imageAlt = "Blog post header",
	} = options;

	const ogUrls = await getOgImageUrls(ogParams);

	return [
		{ title },
		...authors.map((authr) => ({ name: "author", content: authr })),
		{ name: "description", content: description },
		// Open Graph
		{ property: "og:title", content: title },
		{ property: "og:description", content: description },
		{ property: "og:image:alt", content: imageAlt },
		{ property: "og:image:url", content: ogUrls.default },
		{ property: "og:image:type", content: "image/png" },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		// Twitter
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: description },
		{ name: "twitter:image:url", content: ogUrls.twitter },
		{ name: "twitter:image:type", content: "image/png" },
		{ name: "twitter:image:alt", content: imageAlt },
		{ name: "twitter:image:width", content: "1600" },
		{ name: "twitter:image:height", content: "900" },
	];
}
