import { createFileRoute } from "@tanstack/react-router";
import { googleFonts } from "takumi-js/helpers";
import { ImageResponse } from "takumi-js/response";
import { blogSource } from "@/lib/collections/blog";
import { categoriesSource } from "@/lib/collections/categories";
import { pagesSource } from "@/lib/collections/pages";
import { tagsSource } from "@/lib/collections/tags";

export const Route = createFileRoute("/opengraph/$")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				const size = {
					width: 1200,
					height: 630,
				};

				const searchParams = new URL(request.url).searchParams;
				const isTwitter = searchParams.get("twitter") === "true";
				if (isTwitter) {
					size.width = 1600;
					size.height = 900;
				}

				const logoSrc = await fetch(
					`https://${import.meta.env.VITE_CDN}/branding/laniakita-logo-transparent-darkmode.svg`,
				);

				const bgSrc = await fetch(`https://${import.meta.env.VITE_CDN}/branding/noise_shader_01.jpg`);

				const splatParts = params._splat?.split("/") ?? [];
				const reqType = splatParts[0];
				const modUrl = splatParts.slice(1).join("/");

				// biome-ignore lint/suspicious/noExplicitAny: generic fetched object
				let fetchedData: any = null;
				let title: string | null | undefined = null;
				let prefix: string | null | undefined = null;
				let dynamic = true;

				if (modUrl || reqType === "home" || (reqType === "credits" && !modUrl)) {
					switch (reqType) {
						case "blog": {
							fetchedData = blogSource.getPage([modUrl]);
							title = fetchedData?.data.headline;
							prefix = "Lani's Dev Blog";
							break;
						}
						case "credits": {
							fetchedData = pagesSource.getPage(["credits", modUrl].filter(Boolean));
							title = fetchedData?.data.title;
							prefix = "Credits";
							break;
						}
						case "tags": {
							fetchedData = tagsSource.getPage([modUrl]);
							title = fetchedData?.data.title;
							prefix = "Tags";
							break;
						}
						case "categories": {
							fetchedData = categoriesSource.getPage([modUrl]);
							title = fetchedData?.data.title;
							prefix = "Categories";
							break;
						}
						case "static": {
							fetchedData = pagesSource.getPage([modUrl]);
							title = fetchedData?.data.title;
							dynamic = false;
							break;
						}
						case "home": {
							title = "Home";
							dynamic = false;
							break;
						}
						default: {
							console.error("Whoops, no data found!");
							break;
						}
					}
				} else if (reqType && !modUrl) {
					return new Response("I'm a teapot", { status: 418 });
				}

				return new ImageResponse(
					fetchedData?.data.featured_image?.src ? (
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
								style={{
									objectFit: "cover",
									objectPosition: "50% 50%",
								}}
								src={fetchedData.data.featured_image.src}
								alt='Background'
							/>
						</div>
					) : (
						<ImageGenTwo
							logo={await logoSrc.arrayBuffer()}
							bg={await bgSrc.arrayBuffer()}
							bgFormat='jpeg'
							title={title ?? ""}
							logoFormat='svg'
							dynamic={dynamic}
							prefix={prefix ?? ""}
							twitter={isTwitter}
						/>
					),
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
								data: () =>
									fetch(`https://${import.meta.env.VITE_CDN}/fonts/0xProto-Regular.woff2`).then((res) =>
										res.arrayBuffer(),
									),
							},
						],
						headers: {
							"Cache-Control": "public, maxage=31536000, immutable",
						},
					},
				);
			},
		},
	},
});

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
			<img alt='logo' src={logoData} height={`20%`} style={{ position: "absolute", right: 30, top: 30 }} />

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
							fontSize: twitter ? 50 : 40,
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
							fontSize: twitter ? 80 : 60,
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
					<h1 style={{ fontWeight: 900, fontSize: twitter ? 80 : 60 }}>{title}</h1>
				</div>
			)}
		</div>
	);
}
