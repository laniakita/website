"use client";
import { Image } from "@unpic/react";
export interface HeroBlurProps {
	featured_image?: {
		src: string;
		height?: number;
		width?: number;
		base64?: string;
		altText?: string;
		caption?: string;
		hasImage?: boolean;
	};
}

export function HeroBlur({ featured_image }: HeroBlurProps) {
	if (!featured_image?.src) return null;

	return (
		<picture
			className="relative m-0 flex size-full max-w-5xl items-center justify-center p-0"
			data-testid="hero-blur-container"
		>
			{featured_image.height && featured_image.width ? (
				<Image
					src={featured_image.src}
					alt={featured_image.altText ?? ""}
					background={featured_image.base64}
					height={featured_image.height}
					width={featured_image.width}
					layout="constrained"
					fallback="cloudflare"
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
					className="overflow-hidden object-contain"
				/>
			) : (
				<Image
					src={featured_image.src}
					alt={featured_image.altText ?? ""}
					layout="fullWidth"
					className="overflow-hidden object-contain"
				/>
			)}
		</picture>
	);
}
