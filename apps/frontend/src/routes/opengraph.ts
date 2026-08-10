import { createFileRoute } from "@tanstack/react-router";
import { eden } from "@/lib/api";

export const Route = createFileRoute("/opengraph")({
	server: {
		handlers: {
			async GET({ request }) {
				const url = new URL(request.url);
				const title = url.searchParams.get("title") ?? "Lani Akita";
				const prefix = url.searchParams.get("prefix") ?? undefined;
				const dynamicParam = url.searchParams.get("dynamic");
				const twitterParam = url.searchParams.get("twitter");

				const dynamic = dynamicParam !== null ? dynamicParam === "true" : true;
				const twitter = twitterParam !== null ? twitterParam === "true" : false;

				const token = process.env.OG_AUTH_TOKEN ?? "default-dev-secret";

				const response = await eden.api.v1.opengraph.post({
					title,
					prefix,
					dynamic,
					twitter,
					$headers: {
						authorization: `Bearer ${token}`,
					},
				});

				if (response.error) {
					return new Response(JSON.stringify(response.error), {
						status: response.status ?? 500,
						headers: { "Content-Type": "application/json" },
					});
				}

				const data = response.data as unknown;
				if (data instanceof Blob || data instanceof ArrayBuffer) {
					return new Response(data, {
						headers: {
							"Content-Type": "image/png",
							"Cache-Control": "public, max-age=31536000, immutable",
						},
					});
				}

				return new Response("Invalid image data received", { status: 500 });
			},
		},
	},
});
