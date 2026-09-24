"use client";
import { Image } from "@unpic/react";
import { normalizePublicAssetUrl } from "../../lib/utils/assets";

export function ImgReplacer(props: React.ImgHTMLAttributes<HTMLImageElement>) {
	// biome-ignore lint/suspicious/noExplicitAny: MDX props are dynamic
	const { "data-lqip": lqip, alt, src, width, height, ...rest } = props as any;
	const cleanSrc = typeof src === "string" ? normalizePublicAssetUrl(src) : src;

	return (
		<figure className='my-6 overflow-hidden rounded-md'>
			<Image
				{...rest}
				src={cleanSrc}
				alt={alt}
				width={width ? Number(width) : undefined}
				height={height ? Number(height) : undefined}
				layout='constrained'
				fallback={import.meta.env.DEV ? undefined : "cloudflare"}
				operations={{
					cloudflare: {
						quality: 75,
						format: "avif",
					},
				}}
				background={lqip}
				className='m-auto'
			/>
			{alt && <figcaption className='mt-2 text-center font-mono text-muted-foreground text-xs'>{alt}</figcaption>}
		</figure>
	);
}
