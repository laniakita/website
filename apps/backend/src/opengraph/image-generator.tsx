// biome-ignore lint/correctness/noUnusedImports: necessary for @elysiajs/html
import { Html, html } from "@elysia/html";
import init, { type FontLoader, Renderer, setGlyphCacheMaxBytes } from "@takumi-rs/wasm";
import wasmModule from "@takumi-rs/wasm/auto";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { OgVariant, type OpenGraphBody } from "./config-schema";

let rendererInstance: Renderer | null = null;
let initPromise: Promise<void> | null = null;

let logoBuffer: ArrayBuffer | null = null;
let defaultBgBuffer: ArrayBuffer | null = null;
let fontBuffer: ArrayBuffer | null = null;
let googleFontList: FontLoader[] = [];

async function setupRendererAndAssets(env: Env | undefined, baseUrl: string) {
	if (rendererInstance) return;
	if (initPromise) return initPromise;

	initPromise = (async () => {
		await (init as unknown as (opts: { module_or_path: unknown }) => Promise<void>)({ module_or_path: wasmModule });
		setGlyphCacheMaxBytes(64 * 1024 * 1024);
		rendererInstance = new (Renderer as unknown as new (opts: { cacheMaxBytes: number }) => Renderer)({
			cacheMaxBytes: 64 * 1024 * 1024,
		});

		const fetchAsset = async (path: string) => {
			if (env?.ASSETS) {
				const res = await env.ASSETS.fetch(new Request(new URL(path, baseUrl)));
				return res.arrayBuffer();
			}
			const res = await fetch(`${baseUrl}${path}`);
			return res.arrayBuffer();
		};

		const [logo, bg, font, gFonts] = await Promise.all([
			fetchAsset("/laniakita-logo-transparent-darkmode.svg"),
			fetchAsset("/noise_shader_01.jpg"),
			fetchAsset("/0xProto-Regular.ttf"),
			googleFonts([
				{
					name: "Playfair Display",
					weight: [400, 700],
					style: "italic",
				},
			]),
		]);

		logoBuffer = logo;
		defaultBgBuffer = bg;
		fontBuffer = font;
		googleFontList = gFonts;
	})().catch((err) => {
		initPromise = null;
		throw err;
	});

	return initPromise;
}

export async function imageGenerator({
	env,
	baseUrl,
	body,
	size,
}: {
	env?: Env;
	baseUrl: string;
	body: OpenGraphBody;
	size: { width: number; height: number };
}) {
	await setupRendererAndAssets(env, baseUrl);

	if (!logoBuffer || !defaultBgBuffer || !fontBuffer || !rendererInstance) {
		throw new Error("Assets or renderer not initialized");
	}

	const bgBuffer =
		body.variant === "image" ? await fetch(body.imageUrl).then((res) => res.arrayBuffer()) : defaultBgBuffer;

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
			renderer: rendererInstance,
			fonts: [
				...googleFontList,
				{
					name: "0xProto",
					weight: 400,
					generic: "monospace",
					data: fontBuffer,
				},
			],
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
						fontFamily: "Playfair Display",
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
						fontFamily: "Playfair Display",
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
						fontFamily: "Playfair Display",
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
