"use client";
import { Image } from "@unpic/react";

export interface HeroBlurProps {
	featured_image?: {
		src: string;
		width?: number;
		height?: number;
		imgData?: {
			css: string;
			height: number;
			width: number;
		};
		altText?: string;
		caption?: string;
	};
}

export function HeroBlur({ featured_image }: HeroBlurProps) {
	if (!featured_image?.src) return null;

	const width = featured_image.width ?? featured_image.imgData?.width;
	const height = featured_image.height ?? featured_image.imgData?.height;
	const bg = featured_image.imgData?.css;

	return (
		<picture
			className='relative m-0 flex size-full max-w-5xl items-center justify-center p-0'
			data-testid='hero-blur-container'
		>
			{width && height ? (
				<Image
					src={featured_image.src}
					alt={featured_image.altText ?? ""}
					background={bg}
					height={height}
					width={width}
					layout='constrained'
					fallback={import.meta.env.DEV ? undefined : "cloudflare"}
					operations={{
						cloudflare: {
							quality: 75,
							format: "avif",
						},
					}}
					className='overflow-hidden object-contain'
				/>
			) : (
				<Image
					src={featured_image.src}
					alt={featured_image.altText ?? ""}
					layout='fullWidth'
					className='overflow-hidden object-contain'
				/>
			)}
		</picture>
	);
}
