import { compareDesc } from "date-fns";
import { parseTitleFromFilename } from "../../../schema/image-extractor";
import { blogSource } from "../collections/blog";
import { categoriesSource } from "../collections/categories";
import { pagesSource } from "../collections/pages";
import { tagsSource } from "../collections/tags";
import { worksSource } from "../collections/works";
import { getOgImageUrls, type OgParams } from "../utils/seo";

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

async function buildRouteEntry(
	url: string,
	ogParams: OgParams,
	lastMod?: string | Date,
	images?: ImageEntry[],
): Promise<RouteEntry> {
	const variants = await getOgImageUrls(ogParams);
	return {
		url,
		lastMod,
		ogImage: variants.default,
		ogImageVariants: variants,
		ogImages: [variants.default, variants.twitter],
		images,
	};
}

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
		await buildRouteEntry("/", { title: "Home", dynamic: false }),
		await buildRouteEntry("/blog", { title: "Blog", dynamic: false }),
		await buildRouteEntry("/work", { title: "Work", dynamic: false }, undefined, workImages),
	);

	// 2. Blog Posts
	for (const page of sortPagesByDate(blogSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		const images = collectPostImages(page);
		routes.push(
			await buildRouteEntry(
				`/blog/${slug}`,
				{ title: page.data.headline ?? page.data.title, prefix: "Lani's Dev Blog", dynamic: true },
				lastMod,
				images,
			),
		);
	}

	// 3. Categories
	for (const page of sortPagesByDate(categoriesSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(
			await buildRouteEntry(
				`/blog/categories/${slug}`,
				{ title: page.data.title, prefix: "Categories", dynamic: true },
				lastMod,
			),
		);
	}

	// 4. Tags
	for (const page of sortPagesByDate(tagsSource.getPages())) {
		const slug = page.slugs.join("/");
		const lastMod = page.data.lastModified ?? page.data.createdAt;
		routes.push(
			await buildRouteEntry(`/blog/tags/${slug}`, { title: page.data.title, prefix: "Tags", dynamic: true }, lastMod),
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
			routes.push(
				await buildRouteEntry(
					url,
					{ title: page.data.title, prefix: isCredits ? "Credits" : undefined, dynamic: isCredits },
					lastMod,
					images,
				),
			);
		}
	}

	return routes;
}
