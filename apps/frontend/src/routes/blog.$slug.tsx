import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import { type ReactNode, Suspense } from "react";
import { useMDXComponents } from "@/components/mdx";
import { blogSource } from "@/lib/collections/blog";
import type { CatTag } from "@/stories/blog/cat-tag-roller";
import { PostPage } from "@/stories/blog/post-page/post-page";
import { MAIN_PAGES, SOCIALS_NAVBAR } from "../components/nav-constants";

const getPost = createServerFn({ method: "GET" })
	.validator((slug: string) => slug)
	.handler(async ({ data: slug }) => {
		const post = blogSource.getPage([slug]);
		const components = useMDXComponents();
		if (!post) {
			return null;
		}

		const MDX = post.data.body;

		function extractHtmlFromNode(node: ReactNode): string {
			if (typeof node === "string" || typeof node === "number") {
				return String(node);
			}
			if (!node) return "";

			if (Array.isArray(node)) {
				return node.map(extractHtmlFromNode).join("");
			}

			if (typeof node === "object" && "props" in node && node.props) {
				// biome-ignore lint/suspicious/noExplicitAny: nodes can be anything.
				const type = (node as any).type;
				// biome-ignore lint/suspicious/noExplicitAny: nodes can be anything.
				const childrenHtml = extractHtmlFromNode((node.props as any).children);

				if (typeof type !== "string") {
					return childrenHtml;
				}

				let attrs = "";
				// biome-ignore lint/suspicious/noExplicitAny: nodes can be anything.
				if ((node.props as any).className) {
					// biome-ignore lint/suspicious/noExplicitAny: nodes can be anything.
					attrs += ` class="${(node.props as any).className}"`;
				}

				return `<${type}${attrs}>${childrenHtml}</${type}>`;
			}

			return "";
		}

		const flatHeadings: { id: string; content: string }[] = [];
		const nestedHeadings = post.data.toc.map((item) => {
			const { depth, url, title } = item;
			const titleHtml = extractHtmlFromNode(title);
			flatHeadings.push({ id: url.substring(1), content: titleHtml });

			return {
				depth,
				url,
				title: titleHtml,
			};
		});

		const categories = post.data.categories as CatTag[];
		const tags = post.data.tags as CatTag[];

		const RenderableMDX = await renderServerComponent(<MDX components={components} />);

		return {
			postData: {
				url: post.data.url,
				description: post.data.description,
				headline: post.data.headline,
				subheadline: post.data.subheadline,
				createdAt: post.data.createdAt,
				lastModified: post.data.lastModified,
				author: post.data.author,
				caption: post.data.caption,
				featured_image: post.data.featured_image,
				categories,
				tags,
			},
			toc: {
				nestedHeadings,
				flatHeadings,
			},
			RenderableMDX,
		};
	});

import { PostPageSkeleton } from "@/stories/skeletons/post-page-skeleton";
import { getSeoMeta } from "../lib/utils/seo";

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params: { slug } }) => {
		const result = await getPost({ data: slug });
		if (!result) {
			throw notFound();
		}
		return result;
	},
	head: ({ loaderData, params }) => ({
		meta: getSeoMeta({
			title: loaderData?.postData.headline,
			description: descriptionTruncator(loaderData?.postData.description),
			image: `/opengraph/blog/${params.slug}`,
			imageAlt: descriptionTruncator(loaderData?.postData.featured_image?.altText),
			lastModified: loaderData?.postData.lastModified ?? loaderData?.postData.createdAt,
		}),
	}),
	component: BlogRouteComponent,
	pendingComponent: PostPageSkeleton,
});

function descriptionTruncator(descr: string | undefined) {
	const maxLen = 200;
	if (!descr) return "";
	if (descr.length > maxLen) {
		return `${descr.substring(0, maxLen - 3)}...`;
	}
	return descr;
}

function BlogRouteComponent() {
	const { postData, toc, RenderableMDX } = Route.useLoaderData();

	return (
		<Suspense fallback={<PostPageSkeleton />}>
			<PostPage
				{...postData}
				toc={toc}
				MDXContent={RenderableMDX}
				header={{
					navItems: MAIN_PAGES,
					socialItems: SOCIALS_NAVBAR,
				}}
			/>
		</Suspense>
	);
}
