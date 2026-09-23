import { env } from "cloudflare:workers";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse, type ImageResponseOptions } from "takumi-js/response";
import * as v from "valibot";
import { getOgDimensions, OgVariant, OpenGraphCard, OpenGraphQuerySchema } from "@/lib/opengraph";
import { openGraphLimiterMiddleware } from "$/src/middleware/limiter";

const staticAssetCache = new Map<string, Promise<ArrayBuffer>>();

function loadStaticAsset(path: string, baseUrl: string): Promise<ArrayBuffer> {
	const cached = staticAssetCache.get(path);
	if (cached) {
		return cached;
	}

	const promise = (async () => {
		try {
			const url = new URL(path.startsWith("/") ? path : `/${path}`, baseUrl);
			if ("ASSETS" in env && env.ASSETS) {
				const assetRes = await (env.ASSETS as Fetcher).fetch(new Request(url));
				if (assetRes.ok) {
					return await assetRes.arrayBuffer();
				}
			}

			const res = await fetch(url);
			if (!res.ok) {
				throw new Error(`Failed to load static asset from ${path}: ${res.status} ${res.statusText}`);
			}
			return await res.arrayBuffer();
		} catch (error) {
			staticAssetCache.delete(path);
			throw error;
		}
	})();

	staticAssetCache.set(path, promise);
	return promise;
}

export const generateOgImage = createServerFn({ method: "GET" })
	.middleware([openGraphLimiterMiddleware])
	.validator((data: unknown) => v.parse(OpenGraphQuerySchema, data))
	.handler(async ({ data, context }) => {
		const baseUrl = new URL(context.url).origin;
		const dimensions = getOgDimensions(data.twitter);
		let bgSrc = "bg-default";
		const images: NonNullable<ImageResponseOptions["images"]> = [
			{
				src: "logo",
				data: () => loadStaticAsset("/identity/laniakita-logo-transparent-darkmode.svg", baseUrl),
			},
		];

		if (data.variant === OgVariant.Image && data.imageUrl) {
			const rawUrl = data.imageUrl;
			if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
				bgSrc = rawUrl;
			} else {
				bgSrc = "bg-custom";
				images.push({
					src: "bg-custom",
					data: () => loadStaticAsset(rawUrl, baseUrl),
				});
			}
		} else {
			images.push({
				src: "bg-default",
				data: () => loadStaticAsset("/identity/noise_shader_01.jpg", baseUrl),
			});
		}

		const interTightFonts = await googleFonts([
			{
				name: "Inter Tight",
				weight: 900,
				style: "normal",
			},
		]).catch((err) => {
			console.warn("[opengraph] Failed to load Inter Tight via googleFonts, falling back to system sans-serif:", err);
			return [];
		});

		const fonts: NonNullable<ImageResponseOptions["fonts"]> = [
			...interTightFonts,
			{
				name: "0xProto",
				weight: 400,
				generic: "monospace",
				data: () => loadStaticAsset("/fonts/0xProto-Regular.ttf", baseUrl),
			},
		];

		return new ImageResponse(
			<OpenGraphCard
				variant={data.variant}
				title={data.title}
				prefix={data.prefix}
				twitter={data.twitter}
				bgSrc={bgSrc}
				logoSrc='logo'
			/>,
			{
				...dimensions,
				fonts,
				images,
				headers: {
					"Cache-Control": data.version
						? "public, max-age=31536000, immutable"
						: "public, max-age=86400, stale-while-revalidate=604800",
				},
			},
		);
	});

export const Route = createFileRoute("/api/opengraph")({
	server: {
		handlers: {
			async GET({ request }) {
				const url = new URL(request.url);
				const rawParams = Object.fromEntries(url.searchParams.entries());
				return await generateOgImage({ data: rawParams });
			},
		},
	},
});
