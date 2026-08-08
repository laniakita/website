import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { Suspense } from "react";
import { BlogPostRoller } from "@/components/blog/post-roller";
import { useMDXComponents } from "@/components/mdx";
import GlobalMDXRenderer from "@/components/mdx-renderer";
import { blogSource } from "@/lib/collections/blog";
import { categoriesSource } from "@/lib/collections/categories";
import { getSeoMeta } from "@/lib/utils/seo";
import type { CatTag } from "@/stories/blog/cat-tag-roller";
import type { PostPreviewProps } from "@/stories/blog/post-preview";
import { MetaLayout } from "@/stories/blog-meta/meta-layout";

const getCategoryPage = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		const category = categoriesSource.getPage([slug]);
		const components = useMDXComponents();
		if (!category) {
			return null;
		}

		const MDX = category.data.body;

		const RenderableMDX = await renderServerComponent(<MDX components={components} />);

		const allPosts = blogSource.getPages();
		const matchingPosts = allPosts
			.filter((post) => {
				return post.data.categories?.some((cat) => cat && "url" in cat && cat.url?.split("/").pop() === slug);
			})
			.sort(
				(a, b) => new Date(b.data.lastModified ?? b.data.createdAt).getTime() - new Date(a.data.lastModified ?? a.data.createdAt).getTime(),
			);

		const postsList = matchingPosts.map((meta) => {
			const categories = meta.data.categories as CatTag[];
			const tags = meta.data.tags as CatTag[];

			return {
				url: meta.url,
				headline: meta.data.headline ?? "",
				subheadline: meta.data.subheadline,
				description: <GlobalMDXRenderer>{meta.data.description ?? ""}</GlobalMDXRenderer>,
				createdAt: meta.data.createdAt ?? "",
				lastModified: meta.data.lastModified,
				featured_image: meta.data.featured_image,
				categories,
				tags,
			} satisfies PostPreviewProps;
		});

		const RenderablePosts = await renderServerComponent(
			postsList.length >= 1 ? (
				<BlogPostRoller posts={postsList} />
			) : (
				<div>
					<p>Oops no matching posts founds. Hmm, somethings wrong here.</p>
				</div>
			),
		);

		return {
			pageData: {
				title: category.data.title,
				description: category.data.description,
			},
			RenderablePosts,
			RenderableMDX,
		};
	});

import { MetaLayoutSkeleton } from "@/stories/skeletons/meta-layout-skeleton";

export const Route = createFileRoute("/(core)/_blog-meta/categories/$slug")({
	loader: async ({ params: { slug } }) => {
		const result = await getCategoryPage({ data: slug });
		if (!result) throw notFound();
		return result;
	},
	head: ({ loaderData, params }) => ({
		meta: getSeoMeta({
			title: loaderData?.pageData.title,
			description: loaderData?.pageData.description,
			image: `/opengraph/categories/${params.slug}`,
		}),
	}),
	component: () => {
		const result = Route.useLoaderData();
		if (!result) return null;

		const { RenderableMDX, pageData, RenderablePosts } = result;

		return (
			<Suspense fallback={<MetaLayoutSkeleton />}>
				<MetaLayout title={pageData.title ?? ""} isTag={false} RenderablePosts={RenderablePosts}>
					{RenderableMDX}
				</MetaLayout>
			</Suspense>
		);
	},
	pendingComponent: MetaLayoutSkeleton,
});
