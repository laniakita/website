import { createFileRoute } from "@tanstack/react-router";
import { BACKEND_URL, OgVariant, type OpenGraphBody } from "@/lib/api";

export const Route = createFileRoute("/api/opengraph")({
	server: {
		handlers: {
			async GET({ request }) {
				const url = new URL(request.url);
				const variant = url.searchParams.get("variant") ?? "static";
				const title = url.searchParams.get("title") ?? "Lani Akita";
				const prefix = url.searchParams.get("prefix") ?? "Lani Akita";
				let imageUrl = url.searchParams.get("imageUrl") ?? "";
				const version = url.searchParams.get("version") ?? "1";
				const twitterParam = url.searchParams.get("twitter");
				const twitter = twitterParam !== null ? twitterParam === "true" : false;

				if (imageUrl && !imageUrl.startsWith("http")) {
					const baseUrl = import.meta.env.VITE_APP_URL || url.origin;
					imageUrl = `${baseUrl}${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
				}

				let body: OpenGraphBody;

				if (variant === OgVariant.Home) {
					body = { variant: OgVariant.Home, twitter, version };
				} else if (variant === OgVariant.Image) {
					body = { variant: OgVariant.Image, imageUrl, twitter, version };
				} else if (variant === OgVariant.Dynamic) {
					body = { variant: OgVariant.Dynamic, title, prefix, twitter, version };
				} else {
					body = { variant: OgVariant.Static, title, twitter, version };
				}

				const token = process.env.OG_AUTH_TOKEN ?? "default-dev-secret";

				const res = await fetch(`${BACKEND_URL}/api/v1/opengraph`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(body),
				});
				return res;
			},
		},
	},
});
