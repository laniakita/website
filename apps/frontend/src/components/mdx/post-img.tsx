"use client";
import { Image } from "@unpic/react";

export function ImgReplacer(props: React.ImgHTMLAttributes<HTMLImageElement>) {
	// biome-ignore lint/suspicious/noExplicitAny: MDX props are too dynamic
	const { "data-lqip": lqip, alt, src, ...rest } = props as any;

	return (
		<figure className='my-6 overflow-hidden rounded-md'>
			<Image
				{...rest}
				src={src}
				alt={alt}
				layout='constrained'
				fallback='cloudflare'
				options={{
					cloudflare: {
						domain: import.meta.env.VITE_CDN,
					},
				}}
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
