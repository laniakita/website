import { Image } from "@unpic/react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { MDXComponents } from "mdx/types";
import { cloudflareLoader } from "../lib/image-loader";

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
				// Pass the original src and a transformUrl function so unpic generates the srcset properly
				transformUrl={(src: string, width: number) =>
					cloudflareLoader({ src, width })
				}
			/>
			{alt && (
				<figcaption className="font-mono text-xs text-center mt-2 text-muted-foreground">
					{alt}
				</figcaption>
			)}
		</figure>
	);
}

export function getMDXComponents(components?: MDXComponents) {
	return {
		...defaultMdxComponents,
		img: ImgReplacer,
		Image: ImgReplacer,
		...components,
	} satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
	type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
