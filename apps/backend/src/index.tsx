// biome-ignore lint/correctness/noUnusedImports: necessary for @elysiajs/html
import html, { Html } from "@elysia/html";
import { bearer } from "@elysiajs/bearer";
import { openapi } from "@elysiajs/openapi";
import { toJsonSchema } from "@valibot/to-json-schema";
import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import * as v from "valibot";

const OpenGraphHeaderSchema = v.object({
	authorization: v.pipe(
		v.string(),
		v.description("Bearer token for authorization")
	),
});

const OpenGraphBodySchema = v.object({
	title: v.pipe(v.string(), v.maxLength(150)),
	prefix: v.optional(v.pipe(v.string(), v.maxLength(50))),
	dynamic: v.optional(v.boolean(), true),
	twitter: v.optional(v.boolean(), false),
});

export const app = new Elysia({ adapter: CloudflareAdapter })
	.use(html())
	.use(bearer())
	.use(
		openapi({
			mapJsonSchema: {
				valibot: toJsonSchema,
			},
			documentation: {
				info: {
					title: "Lani API",
					version: "1.0.0",
				},
				tags: [{ name: "OpenGraph", description: "OpenGraph image generation endpoints" }],
			},
		}),
	)
	.group("/api/v1", (app) =>
		app.group("/opengraph", (app) =>
			app.post(
				"",
				async (context) => {
					const { body, request } = context;
					const { title, prefix, dynamic, twitter } = body;

					const size = {
						width: twitter ? 1600 : 1200,
						height: twitter ? 900 : 630,
					};

					const baseUrl = new URL(request.url).origin;

					const fetchAsset = async (path: string) => {
						const res = await fetch(`${baseUrl}${path}`);
						return res.arrayBuffer();
					};

					const [logoBuffer, bgBuffer, fontBuffer] = await Promise.all([
						fetchAsset("/laniakita-logo-transparent-darkmode.svg"),
						fetchAsset("/noise_shader_01.jpg"),
						fetchAsset("/0xProto-Regular.ttf"),
					]);

					return new ImageResponse(
						<ImageGenTwo
							logo={logoBuffer}
							bg={bgBuffer}
							bgFormat='jpeg'
							title={title}
							logoFormat='svg'
							dynamic={dynamic}
							prefix={prefix}
							twitter={twitter}
						/>,
						{
							...size,
							fonts: [
								...(await googleFonts([
									{
										name: "Playfair Display",
										weight: [400, 700],
										style: "italic",
									},
								])),
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
				},
				{
					beforeHandle({ bearer, set }) {
						const expectedToken = process.env.OG_AUTH_TOKEN;
						if (!bearer || bearer !== expectedToken) {
							set.status = 401;
							return { error: "Unauthorized" };
						}
					},
					body: OpenGraphBodySchema,
					headers: OpenGraphHeaderSchema,
					detail: {
						tags: ["OpenGraph"],
						summary: "Generate an OpenGraph image",
					},
				},
			),
		),
	)
	.compile();

export type App = typeof app;
export default app;

function ImageGenTwo({
	logo,
	logoFormat,
	bg,
	bgFormat,
	title,
	dynamic,
	prefix,
	twitter,
}: {
	logo: ArrayBuffer | ArrayBufferLike;
	logoFormat?: string;
	bg: ArrayBuffer | ArrayBufferLike;
	bgFormat?: string;
	title: string | undefined;
	dynamic?: boolean;
	prefix?: string;
	twitter?: boolean;
}) {
	const bgBase = Buffer.from(bg).toString("base64");
	const logoBase = Buffer.from(logo).toString("base64");
	const bgData = `data:image/${bgFormat ? bgFormat : "png"};base64,${bgBase}`;
	const logoData = `data:image/${logoFormat ? logoFormat : "png"};base64,${logoBase}`;
	if (title?.toLowerCase() === "home") {
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
	}

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
			<img alt='logo' src={logoData} height={"20%"} style={{ position: "absolute", right: "30px", top: "30px" }} />

			{dynamic ? (
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
						{prefix}:
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
							textWrap: title?.length && title.length > 14 ? "balance" : "wrap",
						}}
					>
						{title}
					</h1>
				</div>
			) : (
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
					<h1 style={{ fontWeight: 900, fontSize: twitter ? "80px" : "60px" }}>{title}</h1>
				</div>
			)}
		</div>
	);
}
