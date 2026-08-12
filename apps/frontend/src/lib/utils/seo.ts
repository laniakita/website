import { OgVariant, type OpenGraphBody } from "@/lib/api";

// biome-ignore lint/suspicious/noExplicitAny: necessary due to generic type constraints
type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;

export type OgParams = DistributiveOmit<OpenGraphBody, "twitter" | "version">;

export interface SeoMetaOptions {
	lastModified: Date;
	title?: string;
	description?: string;
	ogParams?: OgParams;
	imageAlt?: string;
	authors?: string[];
}

export async function getOgImageUrls(ogParams: OgParams, version: string) {
	const buildParams = (isTwitter: boolean) => {
		const params = new URLSearchParams();
		params.set("variant", ogParams.variant);
		params.set("version", version);
		if (isTwitter) {
			params.set("twitter", "true");
		}

		const p = ogParams;
		if (p.variant === OgVariant.Static) {
			params.set("title", p.title);
		} else if (p.variant === OgVariant.Dynamic) {
			params.set("title", p.title);
			if (p.prefix) params.set("prefix", p.prefix);
		} else if (p.variant === OgVariant.Image) {
			params.set("imageUrl", p.imageUrl);
		}

		return params.toString();
	};

	return {
		default: `/api/opengraph?${buildParams(false)}`,
		twitter: `/api/opengraph?${buildParams(true)}`,
	};
}

export async function getSeoMeta(options: SeoMetaOptions) {
	const {
		lastModified,
		title = "laniakita.com",
		description = "Lani's corner on the web",
		authors = ["Lani Akita"],
		ogParams = { variant: OgVariant.Home },
		imageAlt = "Blog post header",
	} = options;

	const version = lastModified.getTime().toString();
	const ogUrls = await getOgImageUrls(ogParams, version);

	function descriptionTruncator(descr: string | undefined) {
		const maxLen = 200;
		if (!descr) return "";
		if (descr.length > maxLen) {
			return `${descr.substring(0, maxLen - 3)}...`;
		}
		return descr;
	}

	return [
		{ title },
		...authors.map((authr) => ({ name: "author", content: authr })),
		{ name: "description", content: descriptionTruncator(description) },
		// Open Graph
		{ property: "og:title", content: title },
		{ property: "og:description", content: descriptionTruncator(description) },
		{ property: "og:image:alt", content: descriptionTruncator(imageAlt) },
		{ property: "og:image:url", content: ogUrls.default },
		{ property: "og:image:type", content: "image/png" },
		{ property: "og:image:width", content: "1200" },
		{ property: "og:image:height", content: "630" },
		// Twitter
		{ name: "twitter:card", content: "summary_large_image" },
		{ name: "twitter:title", content: title },
		{ name: "twitter:description", content: descriptionTruncator(description) },
		{ name: "twitter:image:url", content: ogUrls.twitter },
		{ name: "twitter:image:type", content: "image/png" },
		{ name: "twitter:image:alt", content: descriptionTruncator(imageAlt) },
		{ name: "twitter:image:width", content: "1600" },
		{ name: "twitter:image:height", content: "900" },
	];
}
