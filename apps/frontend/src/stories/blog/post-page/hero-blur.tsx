"use client";
import { Image } from "@unpic/react";
export interface HeroBlurProps {
	featured_image?: {
		src: string;
		localHash: string;
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

	return (
		<picture
			className='relative m-0 flex size-full max-w-5xl items-center justify-center p-0'
			data-testid='hero-blur-container'
		>
			{featured_image.imgData?.height && featured_image.imgData?.width ? (
				<Image
					src={featured_image.src}
					alt={featured_image.altText ?? ""}
					background={featured_image.imgData.css}
					height={featured_image.imgData.height}
					width={featured_image.imgData.width}
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
