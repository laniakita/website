import { createFileRoute } from "@tanstack/react-router";
import { compareDesc } from "date-fns";
import { toXML } from "jstoxml";
import type { MDXComponents } from "mdx/types.js";
import { feedSource } from "@/lib/collections/blog";
import type { CatTag } from "@/stories/blog/cat-tag-roller";
import { BLOG_DESCRIPTION } from "../manifest";

const XML_OPTS = {
	xmlHeader: {
		standalone: "yes",
		version: "1.0",
	},
	indent: "  ",
};

export const Route = createFileRoute("/atom.xml")({
	server: {
		handlers: {
			async GET() {
				const TS_START_VERSION = "1.168.37";
				const HOST_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:3000";

				const posts = feedSource
					.getPages()
					.sort((a, b) =>
						compareDesc(
							new Date(a.data.lastModified ?? a.data.createdAt),
							new Date(b.data.lastModified ?? b.data.createdAt),
						),
					)
					.slice(0, 10);

				const buildDate =
					(posts[0]?.data.lastModified ?? posts[0]?.data.createdAt)?.toISOString() ?? new Date().toISOString();

				const components = useDefaultMDXComponents();
				const postEntry = await Promise.all(
					posts.map(async (post) => {
						const MDX = post.data.body;
						const ReactDomServer = await import("react-dom/server");
						let html = ReactDomServer.renderToStaticMarkup(<MDX components={components} />);
						// Strip React 19 auto-injected resource hints (preloads, etc.) from island output.
						// These should be in <head>, not inside the island.
						// See: https://github.com/facebook/react/issues/27910
						html = html.replace(
							/<link\s[^>]*rel="(?:preload|modulepreload|stylesheet|preconnect|dns-prefetch)"[^>]*>/g,
							"",
						);

						const resCats = catTagXmlRoller({ data: post.data.categories as CatTag[], hostUrl: HOST_URL });
						const resTags = catTagXmlRoller({ data: post.data.tags as CatTag[], hostUrl: HOST_URL });

						const imgEmbed = post.data.featured_image
							? `
          						<figure>
            						<img src="${post.data.featured_image.src}" alt="${post.data.featured_image.altText}" />
            						<figcaption>${post.data.caption}</figcaption>
          						</figure>
       						`
							: `
          						<figure>
            						<img src="${HOST_URL}/opengraph${post.url}" alt="${post.data.headline}" />
            						<figcaption>${post.data.caption ?? post.data.subheadline ?? post.data.headline}</figcaption>
          						</figure>
        					`;

						const res = [
							{
								title: post.data.headline,
							},
							{
								_name: "link",
								_attrs: [
									{
										rel: "alternate",
									},
									{
										href: `${HOST_URL}${post.url}`,
									},
								],
							},
							{
								id: `${HOST_URL}${post.url}`,
							},
							{
								updated: new Date(post.data.lastModified ?? post.data.createdAt).toISOString(),
							},
							resCats,
							resTags,
							{
								_name: "content",
								_attrs: {
									type: "html",
								},
								_content: `<![CDATA[${imgEmbed} ${html}]]>`,
							},
						];
						return { entry: res };
					}),
				);

				const atomFeed = {
					_name: "feed",
					_attrs: {
						xmlns: "http://www.w3.org/2005/Atom",
					},
					_content: [
						{
							title: `Yet Another Dev Blog, by Lani Akita`,
						},
						{
							_name: "link",
							_attrs: [
								{
									href: `${HOST_URL}/atom.xml`,
								},
								{
									rel: "self",
								},
							],
						},
						{
							_name: "link",
							_attrs: {
								href: HOST_URL,
							},
						},
						{
							updated: buildDate,
						},
						{
							_name: "author",
							_content: [
								{
									name: "Lani Akita",
								},
								{
									email: "me@laniakita.com",
								},
								{
									uri: `${HOST_URL}/about`,
								},
							],
						},

						{
							_name: "category",
							_attrs: [
								{
									term: "technology",
								},
								{
									label: "Technology",
								},
							],
						},
						{
							_name: "generator",
							_attrs: {
								version: TS_START_VERSION,
							},
							_content: "TanStack Start",
						},
						{
							icon: `${HOST_URL}/favicon.ico`,
						},
						{
							logo: `${HOST_URL}/icon1.svg`,
						},
						{
							rights: `Copyright © ${new Date().getFullYear() === 2024 ? "2024" : `2024-${new Date().getFullYear()}`}, Lani Akita`,
						},
						{
							subtitle: BLOG_DESCRIPTION,
						},
						{
							id: `${HOST_URL}/blog`,
						},
						postEntry,
					],
				};

				const feedXml = toXML(atomFeed, XML_OPTS);

				return new Response(feedXml ?? "", {
					headers: {
						"Content-Type": "text/xml",
					},
				});
			},
		},
	},
});

function catTagXmlRoller(props: { data?: CatTag[]; hostUrl: string }) {
	const res = props.data?.map((item) => {
		const catTag = {
			_name: "category",
			_attrs: [
				{
					term: item.url,
				},
				{
					scheme: `${props.hostUrl}${item.url}`,
				},
				{
					label: item.title,
				},
			],
		};
		return catTag;
	});
	return res;
}

function useDefaultMDXComponents(_?: MDXComponents) {
	return {
		img: (props) => {
			// biome-ignore lint/a11y/useAltText: included in props
			return <img {...props} />;
		},
	} satisfies MDXComponents;
}
