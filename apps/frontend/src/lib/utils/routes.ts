import { compareDesc } from "date-fns";
import { blogSource } from "@/lib/collections/blog";
import { categoriesSource } from "@/lib/collections/categories";
import { pagesSource } from "@/lib/collections/pages";
import { tagsSource } from "@/lib/collections/tags";
import { worksSource } from "@/lib/collections/works";
import { getOgImageUrls } from "@/lib/utils/seo";
import { parseTitleFromFilename } from "../../../schema/image-extractor";

export interface ImageEntry {
	src: string;
	alt?: string;
	title?: string;
}

export interface RouteEntry {
	url: string;
	lastMod?: string | Date;
	ogImage?: string;
	ogImageVariants?: {
		default: string;
		twitter: string;
	};
	ogImages?: string[];
	images?: ImageEntry[];
}

// Helper to sort page objects by date descending
// biome-ignore lint/suspicious/noExplicitAny: generic page object from fumadocs source
function sortPagesByDate(pages: any[]) {
	return [...pages].sort((a, b) =>
		compareDesc(
			new Date(a.data?.lastModified ?? a.data?.createdAt ?? 0),
			new Date(b.data?.lastModified ?? b.data?.createdAt ?? 0),
		),
	);
}

// biome-ignore lint/suspicious/noExplicitAny: generic page object from fumadocs source
function collectPostImages(page: any): ImageEntry[] {
	const images: ImageEntry[] = [];

	if (page.data?.featured_image?.src) {
		images.push({
			src: page.data.featured_image.src,
			alt: page.data.featured_image.altText ?? page.data.caption ?? page.data.headline ?? page.data.title,
			title: parseTitleFromFilename(page.data.featured_image.src),
		});
	}

	if (Array.isArray(page.data?.inlineImages)) {
		for (const img of page.data.inlineImages) {
			if (img.src && !images.some((i) => i.src === img.src)) {
				images.push(img);
			}
		}
	}

	return images;
}

function buildRouteEntry(url: string, baseOgImage: string, lastMod?: string | Date, images?: ImageEntry[]): RouteEntry {
	const variants = getOgImageUrls(baseOgImage, lastMod);
	return {
		url,
		lastMod,
		ogImage: baseOgImage,
		ogImageVariants: variants,
		ogImages: [variants.default, variants.twitter],
		images,
	};
}

export function getDynamicRoutePaths(): RouteEntry[] {
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
		buildRouteEntry("/", "/opengraph/static/home"),
		buildRouteEntry("/blog", "/opengraph/static/blog"),
		buildRouteEntry("/work", "/opengraph/static/work", undefined, workImages),
	);

	// 2. Blog Posts
	for (const page of sortPagesByDate(blogSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		const images = collectPostImages(page);
		routes.push(buildRouteEntry(`/blog/${slug}`, `/opengraph/blog/${slug}`, lastMod, images));
	}

	// 3. Categories
	for (const page of sortPagesByDate(categoriesSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(buildRouteEntry(`/blog/categories/${slug}`, `/opengraph/categories/${slug}`, lastMod));
	}

	// 4. Tags
	for (const page of sortPagesByDate(tagsSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(buildRouteEntry(`/blog/tags/${slug}`, `/opengraph/tags/${slug}`, lastMod));
	}

	// 5. Info / Static Pages
	for (const page of sortPagesByDate(pagesSource.getPages())) {
		const slug = page.slugs.join("/");
		const url = slug === "home" ? "/" : `/${slug}`;
		if (!routes.some((r) => r.url === url)) {
			const lastMod = page.data.lastModified ?? page.data.createdAt;
			const images = collectPostImages(page);
			routes.push(buildRouteEntry(url, `/opengraph/static/${slug}`, lastMod, images));
		}
	}

	return routes;
}
