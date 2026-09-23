import { createFileRoute } from "@tanstack/react-router";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import * as v from "valibot";

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
			},
		},
	},
});
export enum OgVariant {
	Home = "home",
	Static = "static",
	Dynamic = "dynamic",
	Image = "image",
}

export const BaseOgSchema = {
	twitter: v.optional(v.boolean(), false),
	version: v.string(),
};

export const HomeOgSchema = v.object({
	variant: v.literal(OgVariant.Home),
	...BaseOgSchema,
});

export const StaticOgSchema = v.object({
	variant: v.literal(OgVariant.Static),
	title: v.pipe(v.string(), v.maxLength(200)),
	...BaseOgSchema,
});

export const DynamicOgSchema = v.object({
	variant: v.literal(OgVariant.Dynamic),
	title: v.pipe(v.string(), v.maxLength(200)),
	prefix: v.pipe(v.string(), v.maxLength(200)),
	...BaseOgSchema,
});

export const ImageOgSchema = v.object({
	variant: v.literal(OgVariant.Image),
	imageUrl: v.pipe(v.string(), v.url()),
	...BaseOgSchema,
});

export const OpenGraphRequestSchema = v.variant("variant", [
	HomeOgSchema,
	StaticOgSchema,
	DynamicOgSchema,
	ImageOgSchema,
]);

export type OpenGraphRequest = v.InferOutput<typeof OpenGraphRequestSchema>;

// Shared across requests: dedupes concurrent fetches of the same URL and reuses the bytes.
const imageCache = new Map<string, Promise<ArrayBuffer>>();

export async function imageGenerator({
	baseUrl,
	body,
	size,
	env,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: clashes with Cloudflare worker env types
	env: any;
	baseUrl: string;
	body: OpenGraphBody;
	size: { width: number; height: number };
}) {
	const fetchAsset = async (path: string) => {
		if (env?.ASSETS) {
			const res = await env.ASSETS.fetch(new Request(new URL(path, baseUrl)));
			return res.arrayBuffer();
		}
		const res = await fetch(`${baseUrl}${path}`);
		return res.arrayBuffer();
	};

	const [logoBuffer, bgBuffer, fontBuffer] = await Promise.all([
		fetchAsset("/laniakita-logo-transparent-darkmode.svg"),
		body.variant === "image"
			? fetch(body.imageUrl).then((res) => res.arrayBuffer())
			: fetchAsset("/noise_shader_01.jpg"),
		fetchAsset("/0xProto-Regular.ttf"),
	]);

	return new ImageResponse(
		<OpenGraphImage
			body={body}
			logo={logoBuffer}
			bg={bgBuffer}
			bgFormat={body.variant === "image" ? "png" : "jpeg"}
			logoFormat='svg'
		/>,
		{
			...size,
			fonts: [
				...(await googleFonts([
					{
						name: "Inter Tight",
						weight: 900,
						style: "normal",
					},
				])),
				{
					name: "0xProto",
					weight: 400,
					generic: "monospace",
					data: fontBuffer,
				},
			],
			images: {
				fetchCache: imageCache,
			},
			headers: {
				"Cache-Control": "public, max-age=31536000, immutable",
			},
		},
	);
}

export function OpenGraphImage({
	body,
	logo,
	logoFormat,
	bg,
	bgFormat,
}: {
	body: OpenGraphBody;
	logo: ArrayBuffer | ArrayBufferLike;
	logoFormat?: string;
	bg: ArrayBuffer | ArrayBufferLike;
	bgFormat?: string;
}) {
	const bgBase = Buffer.from(bg).toString("base64");
	const logoBase = Buffer.from(logo).toString("base64");
	const bgData = `data:image/${bgFormat ? bgFormat : "png"};base64,${bgBase}`;
	const logoData = `data:image/${logoFormat ? logoFormat : "png"};base64,${logoBase}`;
	const twitter = body.twitter;

	switch (body.variant) {
		case OgVariant.Image:
			return (
				<div
					style={{
						display: "flex",
						width: "100%",
						height: "100%",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<img
						alt='Cover'
						src={bgData}
						style={{
							objectFit: "cover",
							objectPosition: "50% 50%",
							width: "100%",
							height: "100%",
						}}
					/>
				</div>
			);

		case OgVariant.Home:
			return (
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						fontFamily: "Inter Tight",
						backgroundColor: "black",
					}}
				>
					<img
						alt='background'
						src={bgData}
						style={{
							opacity: 0.8,
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							objectFit: "cover",
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: "-1rem",
						}}
					>
						<img src={logoData} alt='Logo for lanaiakita.com' style={{ height: "50%" }} />
					</div>
				</div>
			);

		case OgVariant.Dynamic:
			return (
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						fontFamily: "Inter Tight",
						backgroundColor: "black",
					}}
				>
					<img
						alt='background'
						src={bgData}
						style={{
							opacity: 0.8,
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							objectFit: "cover",
						}}
					/>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "-2.25rem",
							alignItems: "flex-start",
							justifyContent: "center",
							color: "#cdd6f4",
							padding: "1.25rem 3rem",
							backgroundColor: "#07070D",
							border: "0.15rem solid #1e1e2e",
							borderRadius: "0.375rem",
							maxWidth: "80%",
						}}
					>
						<h2
							style={{
								fontWeight: 400,
								fontFamily: "monospace",
								fontSize: twitter ? "50px" : "40px",
								textTransform: "lowercase",
							}}
						>
							{body.prefix}:
						</h2>
						<div
							style={{
								width: "100%",
								height: "0.15rem",
								backgroundColor: "#1e1e2e",
								borderRadius: "0.375rem",
							}}
						/>
						<h1
							style={{
								display: "flex",
								fontWeight: 900,
								fontSize: twitter ? "80px" : "60px",
								textWrap: body.title.length > 14 ? "balance" : "wrap",
							}}
						>
							{body.title}
						</h1>
					</div>
				</div>
			);

		case OgVariant.Static:
			return (
				<div
					style={{
						width: "100%",
						height: "100%",
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						position: "relative",
						fontFamily: "Inter Tight",
						backgroundColor: "black",
					}}
				>
					<img
						alt='background'
						src={bgData}
						style={{
							opacity: 0.8,
							position: "absolute",
							top: 0,
							left: 0,
							bottom: 0,
							right: 0,
							objectFit: "cover",
						}}
					/>

					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							color: "#cdd6f4",
							padding: "1.25rem 3rem",
							backgroundColor: "#07070D",
							border: "0.15rem solid #1e1e2e",
							borderRadius: "0.375rem",
							maxWidth: "80%",
						}}
					>
						<h1 style={{ fontWeight: 900, fontSize: twitter ? "80px" : "60px" }}>{body.title}</h1>
					</div>
				</div>
			);
	}
}
