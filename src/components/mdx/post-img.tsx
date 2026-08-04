"use client";
import { Image } from "@unpic/react";
import { transform } from "unpic/providers/cloudflare";

export function ImgReplacer(props: React.ImgHTMLAttributes<HTMLImageElement>) {
	// biome-ignore lint/suspicious/noExplicitAny: MDX props are too dynamic
	const { "data-lqip": lqip, alt, src, ...rest } = props as any;

	return (
		<figure className="my-6 overflow-hidden rounded-md">
			<Image
				{...rest}
				src={src}
				alt={alt}
				layout="fullWidth"
				className="h-auto w-full"
				background={lqip}
				transform={transform}
				// Pass the original src and a transformUrl function so unpic generates the srcset properly
			/>
			{alt && (
				<figcaption className="font-mono text-xs text-center mt-2 text-muted-foreground">
					{alt}
				</figcaption>
			)}
		</figure>
	);
}
