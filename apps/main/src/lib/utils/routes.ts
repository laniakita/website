import { compareDesc } from "date-fns";
import { parseTitleFromFilename } from "../../../schema/image-extractor";
import { OgVariant } from "../api";
import { blogSource } from "../collections/blog";
import { categoriesSource } from "../collections/categories";
import { pagesSource } from "../collections/pages";
import { tagsSource } from "../collections/tags";
import { worksSource } from "../collections/works";
import { getOgImageUrls, type OgParams } from "./seo";

/**
 * Represents an image associated with a route, such as featured or inline post images.
 */
export interface ImageEntry {
	/** Relative or absolute URL path of the image file. */
	src: string;
	/** Optional alternative text describing the image for accessibility and SEO. */
	alt?: string;
	/** Optional title or caption parsed for the image. */
	title?: string;
}

/**
 * Represents a resolved route entry used for sitemap generation, RSS feeds, and page discovery.
 */
export interface RouteEntry {
	/** Canonical URL path for the route (e.g., `"/blog/my-post"`). */
	url: string;
	/** Optional last modified date or timestamp of the route content. */
	lastMod?: string | Date;
	/** Primary OpenGraph image URL generated for social sharing previews. */
	ogImage?: string;
	/** OpenGraph image URLs structured by platform variant (default vs Twitter card). */
	ogImageVariants?: {
		/** Default OpenGraph card image URL. */
		default: string;
		/** Twitter summary card image URL. */
		twitter: string;
	};
	/** Array of all OpenGraph preview image URLs generated for this route. */
	ogImages?: string[];
	/** Array of extracted featured and inline images associated with the route content. */
	images?: ImageEntry[];
}

/**
 * Union type representing any Fumadocs page entry across blog, categories, pages, tags, and works collections.
 */
export type RoutePage = NonNullable<
	| ReturnType<typeof blogSource.getPage>
	| ReturnType<typeof categoriesSource.getPage>
	| ReturnType<typeof pagesSource.getPage>
	| ReturnType<typeof tagsSource.getPage>
	| ReturnType<typeof worksSource.getPage>
>;

/**
 * Sorts an array of Fumadocs `RoutePage` items by date in descending order (newest first).
 * Uses `lastModified` if available, falling back to `createdAt`.
 *
 * @template T - A subtype extending `RoutePage`
 * @param pages - The array of page objects to sort
 * @returns A new sorted array of page objects
 */
function sortPagesByDate<T extends RoutePage>(pages: T[]): T[] {
	return [...pages].sort((a, b) =>
		compareDesc(
			new Date(a.data?.lastModified ?? a.data?.createdAt ?? 0),
			new Date(b.data?.lastModified ?? b.data?.createdAt ?? 0),
		),
	);
}

/**
 * Extracts featured and inline images from a Fumadocs page entry using shape-based type guards.
 *
 * @param page - The route page object to extract images from
 * @returns An array of unique `ImageEntry` objects extracted from the page data
 */
function collectPostImages(page: RoutePage): ImageEntry[] {
	const images: ImageEntry[] = [];
	const { data } = page;

	if ("featured_image" in data && data.featured_image?.src) {
		const feat = data.featured_image;
		const alt =
			feat.altText ??
			("caption" in data ? data.caption : undefined) ??
			("headline" in data ? data.headline : undefined) ??
			("title" in data ? data.title : undefined);

		images.push({
			src: feat.src,
			alt,
			title: parseTitleFromFilename(feat.src),
		});
	}

	if ("inlineImages" in data && Array.isArray(data.inlineImages)) {
		for (const img of data.inlineImages) {
			if (img.src && !images.some((i) => i.src === img.src)) {
				images.push(img);
			}
		}
	}

	return images;
}

/**
 * Constructs a single `RouteEntry` object including formatted OpenGraph image URLs.
 *
 * @param url - The absolute or relative path for the route
 * @param ogParams - Parameters specifying OpenGraph variant and metadata
 * @param lastMod - Optional modification date or timestamp
 * @param images - Optional list of associated image entries
 * @returns A promise resolving to the constructed `RouteEntry`
 */
async function buildRouteEntry(
	url: string,
	ogParams: OgParams,
	lastMod?: string | Date,
	images?: ImageEntry[],
): Promise<RouteEntry> {
	const version = lastMod ? new Date(lastMod).getTime().toString() : Date.now().toString();
	const ogUrls = await getOgImageUrls(ogParams, version);

	return {
		url,
		lastMod,
		ogImage: ogUrls.default,
		ogImageVariants: ogUrls,
		images: images && images.length > 0 ? images : undefined,
	};
}

/**
 * Collects and builds all dynamic route entries across static core routes, blog posts,
 * category pages, tag pages, and info/static pages.
 *
 * @returns A promise resolving to an array of all site `RouteEntry` objects
 */
export async function getDynamicRoutePaths(): Promise<RouteEntry[]> {
	const routes: RouteEntry[] = [];

	// Collect work images for /work route
	const workImages: ImageEntry[] = [];
	for (const workPage of worksSource.getPages()) {
		const imgs = collectPostImages(workPage);
		for (const img of imgs) {
			if (!workImages.some((i) => i.src === img.src)) {
				workImages.push(img);
			}
		}
	}

	// 1. Static Core Routes
	routes.push(
		await buildRouteEntry("/", { variant: OgVariant.Home }),
		await buildRouteEntry("/blog", { variant: OgVariant.Static, title: "Blog" }),
		await buildRouteEntry("/work", { variant: OgVariant.Static, title: "Work" }, undefined, workImages),
	);

	// 2. Blog Posts
	for (const page of sortPagesByDate(blogSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		const images = collectPostImages(page);
		const ogParams: OgParams = page.data.featured_image?.src
			? { variant: OgVariant.Image, imageUrl: page.data.featured_image.src }
			: { variant: OgVariant.Dynamic, title: page.data.headline, prefix: "Lani's Dev Blog" };

		routes.push(await buildRouteEntry(`/blog/${slug}`, ogParams, lastMod, images));
	}

	// 3. Categories
	for (const page of sortPagesByDate(categoriesSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(
			await buildRouteEntry(
				`/blog/categories/${slug}`,
				{ variant: OgVariant.Dynamic, title: page.data.title, prefix: "Categories" },
				lastMod,
			),
		);
	}

	// 4. Tags
	for (const page of sortPagesByDate(tagsSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(
			await buildRouteEntry(
				`/blog/tags/${slug}`,
				{ variant: OgVariant.Dynamic, title: page.data.title, prefix: "Tags" },
				lastMod,
			),
		);
	}

	// 5. Info / Static Pages
	for (const page of sortPagesByDate(pagesSource.getPages())) {
		const slug = page.slugs.join("/");
		const url = slug === "home" ? "/" : `/${slug}`;
		if (!routes.some((r) => r.url === url)) {
			const lastMod = page.data.lastModified ?? page.data.createdAt;
			const images = collectPostImages(page);
			const isCredits = slug === "credits";
			const ogParams: OgParams = isCredits
				? { variant: OgVariant.Dynamic, title: page.data.title, prefix: "Credits" }
				: { variant: OgVariant.Static, title: page.data.title };
			routes.push(await buildRouteEntry(url, ogParams, lastMod, images));
		}
	}

	return routes;
}
