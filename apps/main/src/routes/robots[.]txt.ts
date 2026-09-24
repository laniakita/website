import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
	server: {
		handlers: {
			GET() {
				const HOST_URL = env.APP_URL;
				const content = ["User-agent: *", "Allow: /", "", `Sitemap: ${HOST_URL}/sitemap.xml`].join("\n");

				return new Response(content, {
					headers: {
						"Content-Type": "text/plain",
						"Cache-Control": "public, max-age=86400, s-maxage=86400",
					},
				});
			},
		},
	},
});
