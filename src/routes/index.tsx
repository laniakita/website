import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { compareDesc } from "date-fns";
import { blogSource } from "@/lib/collections/blog";
import { BlogPostRoller } from "../components/blog/post-roller";
import GlobalMDXRenderer from "../components/mdx-renderer";
import { BlogSidebar } from "../components/sidebar";
import { SidebarInfo } from "../components/sidebar/info";
import { categoriesSource } from "../lib/collections/categories";
import { tagsSource } from "../lib/collections/tags";
import type { CatTag } from "../stories/blog/cat-tag-roller";
import type { PostPreviewProps } from "../stories/blog/post-preview";

const getPosts = createServerFn().handler(async () => {
	const res = blogSource
		.getPages()
		.sort((a, b) =>
			compareDesc(
				new Date(a.data.updated ?? a.data.date),
				new Date(b.data.updated ?? b.data.date),
			),
		);
	const posts = res.map((meta) => {
		const categories = meta.data.categories
			.map((c) => {
				if (c.title && c.url) {
					return {
						title: c.title,
						url: c.url,
						type: "Category",
					};
				}
				return undefined;
			})
			.filter((c): c is CatTag => c !== undefined);
		const tags = meta.data.tags
			.map((c) => {
				if (c.title && c.url) {
					return {
						title: c.title,
						url: c.url,
						type: "Tag",
					};
				}
				return undefined;
			})
			.filter((c): c is CatTag => c !== undefined);
		return {
			url: meta.data.url,
			headline: meta.data.headline,
			subheadline: meta.data.subheadline,
			description: (
				<GlobalMDXRenderer>{meta.data.description}</GlobalMDXRenderer>
			),
			date: meta.data.date,
			updated: meta.data.updated,
			featuredImage: {
				src: meta.data.featured_image?.src ?? "",
				blurHash: meta.data.featured_image?.imgData?.css,
				altText: meta.data.featured_image?.altText,
			},
			categories: categories.length > 0 ? categories : undefined,
			tags: tags.length > 0 ? tags : undefined,
		} satisfies PostPreviewProps;
	});

	const Renderable = await renderServerComponent(
		<BlogPostRoller posts={posts} />,
	);
	return { Renderable };
});

const getBlogMeta = createServerFn().handler(async () => {
	const categoriesRes = categoriesSource
		.getPages()
		.sort((a, b) => a.data.title.localeCompare(b.data.title));
	const tagsRes = tagsSource
		.getPages()
		.sort((a, b) => a.data.title.localeCompare(b.data.title));

	const categories = categoriesRes.map((meta) => {
		return {
			title: meta.data.title,
			url: meta.data.url,
		};
	});
	const tags = tagsRes.map((meta) => {
		return {
			title: meta.data.title,
			url: meta.data.url,
		};
	});
	return { categories, tags };
});

export const Route = createFileRoute("/")({
	loader: async () => {
		const { Renderable } = await getPosts();
		const { categories, tags } = await getBlogMeta();
		return { PostRoller: Renderable, meta: { categories, tags } };
	},
	component: App,
});

function App() {
	const { PostRoller, meta } = Route.useLoaderData();

	return (
		<div className="flex size-full flex-row p-2 md:p-10 gap-6 max-w-7xl m-auto">
			<main className="m-auto flex flex-col justify-center gap-4 px-page-common pt-blog simple-color-trans md:flex-row md:gap-6">
				<SidebarInfo
					className="md:hidden"
					categories={meta.categories}
					tags={meta.tags}
				/>
				{PostRoller}
			</main>
			<div className="hidden md:flex md:w-full md:max-w-xs lg:max-w-sm">
				<BlogSidebar categories={meta.categories} tags={meta.tags} />
			</div>
		</div>
	);
}
