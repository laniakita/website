import { compareDesc } from "date-fns";
import { blogSource } from "@/lib/collections/blog";
import { categoriesSource } from "@/lib/collections/categories";
import { pagesSource } from "@/lib/collections/pages";
import { tagsSource } from "@/lib/collections/tags";
import { getOgImageUrls } from "@/lib/utils/seo";

export interface RouteEntry {
	url: string;
	lastMod?: string | Date;
	ogImage?: string;
	ogImageVariants?: {
		default: string;
		twitter: string;
	};
	ogImages?: string[];
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

function buildRouteEntry(url: string, baseOgImage: string, lastMod?: string | Date): RouteEntry {
	const variants = getOgImageUrls(baseOgImage, lastMod);
	return {
		url,
		lastMod,
		ogImage: baseOgImage,
		ogImageVariants: variants,
		ogImages: [variants.default, variants.twitter],
	};
}

export function getDynamicRoutePaths(): RouteEntry[] {
	const routes: RouteEntry[] = [];

	// 1. Static Core Routes
	routes.push(
		buildRouteEntry("/", "/opengraph/static/home"),
		buildRouteEntry("/blog", "/opengraph/static/blog"),
		buildRouteEntry("/work", "/opengraph/static/work"),
	);

	// 2. Blog Posts
	for (const page of sortPagesByDate(blogSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(buildRouteEntry(`/blog/${slug}`, `/opengraph/blog/${slug}`, lastMod));
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
			routes.push(buildRouteEntry(url, `/opengraph/static/${slug}`, lastMod));
		}
	}

	return routes;
}
