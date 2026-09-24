import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { TaxonomyItem } from "./shared";

let categoriesCache: Record<string, TaxonomyItem> | null = null;
let tagsCache: Record<string, TaxonomyItem> | null = null;

function loadTaxonomyLookup(dirName: string): Record<string, TaxonomyItem> {
	const dir = path.resolve(import.meta.dirname, "../content", dirName);
	if (!fs.existsSync(dir)) return {};
	const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
	const lookup: Record<string, TaxonomyItem> = {};

	for (const file of files) {
		const raw = fs.readFileSync(path.join(dir, file), "utf-8");
		const { data } = matter(raw);
		const slug = data.slug || path.basename(file, path.extname(file));
		lookup[slug] = {
			title: data.title || slug,
			url: data.url || `/${dirName}/${slug}`,
			type: data.type || (dirName === "categories" ? "category" : "tag"),
		};
	}
	return lookup;
}

export function getCategoriesLookup(): Record<string, TaxonomyItem> {
	if (!categoriesCache) categoriesCache = loadTaxonomyLookup("categories");
	return categoriesCache;
}

export function getTagsLookup(): Record<string, TaxonomyItem> {
	if (!tagsCache) tagsCache = loadTaxonomyLookup("tags");
	return tagsCache;
}
