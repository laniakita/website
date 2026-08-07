import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { renderServerComponent } from "@tanstack/react-start/rsc";
import type { ReactNode } from "react";
import { useMDXComponents } from "@/components/mdx";
import { blogSource } from "@/lib/collections/blog";
import type { CatTag } from "@/stories/blog/cat-tag-roller";
import { PostPage } from "@/stories/blog/post-page/post-page";
import { SOCIALS_NAVBAR } from "../components/nav-constants";
import { defaultNavItems } from "../components/navigation/header/data";

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
				headline: post.data.headline,
				subheadline: post.data.subheadline,
				date: post.data.date,
				updated: post.data.updated,
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

export const Route = createFileRoute("/blog/$slug")({
	loader: async ({ params: { slug } }) => {
		const result = await getPost({ data: slug });
		if (!result) {
			throw notFound();
		}
		return result;
	},
	component: BlogRouteComponent,
	pendingComponent: PostPageSkeleton,
});

function BlogRouteComponent() {
	const { postData, toc, RenderableMDX } = Route.useLoaderData();

	return (
		<PostPage
			{...postData}
			toc={toc}
			MDXContent={RenderableMDX}
			header={{ navItems: defaultNavItems, socialItems: SOCIALS_NAVBAR }}
		/>
	);
}
