import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { BlogPostRoller } from "@/components/blog/post-roller";
import { useMDXComponents } from "@/components/mdx";
import GlobalMDXRenderer from "@/components/mdx-renderer";
import { blogSource } from "@/lib/collections/blog";
import { tagsSource } from "@/lib/collections/tags";
import { getSeoMeta } from "@/lib/utils/seo";
import type { CatTag } from "@/stories/blog/cat-tag-roller";
import type { PostPreviewProps } from "@/stories/blog/post-preview";
import { MetaLayout } from "@/stories/blog-meta/meta-layout";

const getTagPage = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		const tag = tagsSource.getPage([slug]);
		console.log(slug);
		const components = useMDXComponents();
		if (!tag) {
			return null;
		}
		const MDX = tag.data.body;

		const RenderableMDX = await renderServerComponent(
			<MDX components={components} />,
		);

		const allPosts = blogSource.getPages();
		const matchingPosts = allPosts
			.filter((post) => {
				return post.data.tags?.some(
					(t) => t && "url" in t && t.url?.split("/").pop() === slug,
				);
			})
			.sort(
				(a, b) =>
					new Date(b.data.updated ?? b.data.date).getTime() -
					new Date(a.data.updated ?? a.data.date).getTime(),
			);

		const postsList = matchingPosts.map((meta) => {
			const categories = meta.data.categories as CatTag[];
			const tags = meta.data.tags as CatTag[];

			return {
				url: meta.url,
				headline: meta.data.headline ?? "",
				subheadline: meta.data.subheadline,
				description: (
					<GlobalMDXRenderer>{meta.data.description ?? ""}</GlobalMDXRenderer>
				),
				date: meta.data.date ?? "",
				updated: meta.data.updated,
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
				title: tag.data.title,
				description: tag.data.description,
			},
			RenderablePosts,
			RenderableMDX,
		};
	});

import { MetaLayoutSkeleton } from "@/stories/skeletons/meta-layout-skeleton";

export const Route = createFileRoute("/(core)/_blog-meta/tags/$slug")({
	loader: async ({ params: { slug } }) => {
		const result = await getTagPage({ data: slug });
		if (!result) throw notFound();
		return result;
	},
	head: ({ loaderData, params }) => ({
		meta: getSeoMeta({
			title: loaderData?.pageData.title,
			description: loaderData?.pageData.description,
			image: `/api/og/tags/${params.slug}`,
		}),
	}),
	component: () => {
		const result = Route.useLoaderData();

		const { RenderableMDX, pageData, RenderablePosts } = result;

		return (
			<MetaLayout
				title={pageData.title ?? ""}
				isTag={true}
				RenderablePosts={RenderablePosts}
			>
				{RenderableMDX}
			</MetaLayout>
		);
	},
	pendingComponent: MetaLayoutSkeleton,
});
