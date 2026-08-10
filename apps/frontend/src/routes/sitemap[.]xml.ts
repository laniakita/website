import { createFileRoute } from "@tanstack/react-router";
import { toXML } from "jstoxml";
import { getDynamicRoutePaths } from "@/lib/utils/routes";

const XML_OPTS = {
	xmlHeader: {
		standalone: "yes",
		version: "1.0",
		encoding: "UTF-8",
	},
	indent: "  ",
};

export const Route = createFileRoute("/sitemap.xml")({
	server: {
		handlers: {
			GET() {
				const HOST_URL = import.meta.env.VITE_APP_URL ?? "https://laniakita.com";
				const routes = getDynamicRoutePaths();

				const urlset = {
					_name: "urlset",
					_attrs: {
						xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
					},
					_content: routes.map((route) => {
						const urlContent: Array<Record<string, unknown>> = [
							{
								loc: `${HOST_URL}${route.url}`,
							},
						];

						if (route.lastMod) {
							urlContent.push({
								lastmod: new Date(route.lastMod).toISOString(),
							});
						}

						return {
							url: urlContent,
						};
					}),
				};

				const xmlContent = toXML(urlset, XML_OPTS);

				return new Response(xmlContent, {
					headers: {
						"Content-Type": "application/xml",
						"Cache-Control": "public, max-age=3600, s-maxage=3600",
					},
				});
			},
		},
	},
});
