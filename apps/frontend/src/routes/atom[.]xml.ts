import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/atom.xml")({
	server: {
		handlers: {
			GET() {
				/*
				const TS_START_VERSION = "1.168.37";
				const buildDate = new Date().toISOString();
				const HOST_URL = import.meta.env.VITE_APP_URL;

				const postEntry = await Promise.all(
					feedSource.getPages().map(async (post) => {
						const POST_MDX = post.data.body;
						const ReactDomServer = await import('react-dom/server');

						const html = await ReactDomServer.renderToStaticMarkup();

						const imgEmbed = (post.featured_image as FeaturedImageR1).hasImage
							? `
          <figure>
            <img src="${HOST_URL}${(post.featured_image as FeaturedImageR1).src}" alt="${(post.featured_image as FeaturedImageR1).altText}" />
            <figcaption>${(post.featured_image as FeaturedImageR1).caption}</figcaption>
          </figure>
        `
							: `
          <figure>
            <img src="${HOST_URL}/opengraph${post.url}" alt="${post.headline}" />
            <figcaption>${post.caption ?? post.subheadline ?? post.headline}</figcaption>
          </figure>
        `;

						const res = [
							{
								title: post.headline,
							},
							{
								_name: 'link',
								_attrs: [
									{
										rel: 'alternate',
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
								updated: new Date(post.updated ?? post.date).toISOString(),
							},
							resCats,
							resTags,
							{
								_name: 'content',
								_attrs: {
									type: 'html',
								},
								_content: `<![CDATA[${imgEmbed} ${html}]]>`,
							},
						];
						return { entry: res };
					}),
				);

				const atomFeed = {
					_name: 'feed',
					_attrs: {
						xmlns: 'http://www.w3.org/2005/Atom',
					},
					_content: [
						{
							title: `Yet Another Dev Blog, by Lani Akita`,
						},
						{
							_name: 'link',
							_attrs: [
								{
									href: `${HOST_URL}/atom.xml`,
								},
								{
									rel: 'self',
								},
							],
						},
						{
							_name: 'link',
							_attrs: {
								href: `${HOST_URL}/blog`,
							},
						},
						{
							updated: buildDate,
						},
						{
							_name: 'author',
							_content: [
								{
									name: 'Lani Akita',
								},
								{
									email: 'me@laniakita.com',
								},
								{
									uri: `${HOST_URL}/about`,
								},
							],
						},

						{
							_name: 'category',
							_attrs: [
								{
									term: 'technology',
								},
								{
									label: 'Technology',
								},
							],
						},
						{
							_name: 'generator',
							_attrs: {
								version: TS_START_VERSION,
							},
							_content: 'Next.js',
						},
						{
							icon: `${HOST_URL}/favicon.ico`,
						},
						{
							logo: `${HOST_URL}/icon1.svg`,
						},
						{
							rights: `Copyright © ${new Date().getFullYear() === 2024 ? '2024' : `2024-${new Date().getFullYear()}`}, Lani Akita`,
						},
						{
							subtitle: BLOG_DESCR,
						},
						{
							id: `${HOST_URL}/blog`,
						},
						postEntry,
					],
				};

				const feedXml = toXML(atomFeed, xmlOpts);

				return new Response(feedXml, {
					headers: {
						'Content-Type': 'text/xml',
					},
				});
				*/
				return new Response("");
			},
		},
	},
});
