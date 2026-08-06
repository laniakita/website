import { Image } from "@unpic/react";
import type * as React from "react";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";

export interface CorePreviewProps {
	/** The destination URL */
	url: string;
	/** Whether the URL is an external link */
	isExternal?: boolean;
	/** The main title or headline of the card */
	headline: React.ReactNode;
	/** An optional subtitle or supporting text for the headline */
	subheadline?: React.ReactNode;
	/** An optional meta area for dates, tags, etc. above the title */
	meta?: React.ReactNode;
	/** The excerpt or short description of the content */
	children: React.ReactNode;
	/** An optional cover image to display at the top of the card */
	featured_image?: {
		src: string;
		localHash?: string;
		altText?: string;
		imgData?: {
			css: string;
			height: number;
			width: number;
		};
	};
	/** Footer content (tags, tech, categories, etc) */
	footer?: React.ReactNode;
	/** Optional test id */
	"data-testid"?: string;
}

export function CorePreview({
	url,
	isExternal,
	headline,
	subheadline,
	meta,
	children,
	featured_image,
	footer,
	"data-testid": testId = "core-preview-card",
}: CorePreviewProps) {
	// Wrapper component to handle internal vs external links
	const LinkWrapper = ({
		className,
		children,
	}: { className?: string; children: React.ReactNode }) => {
		if (isExternal) {
			return (
				<a
					href={url}
					target="_blank"
					rel="noreferrer noopener"
					className={className}
				>
					{children}
				</a>
			);
		}
		return (
			<Link to={url} className={className}>
				{children}
			</Link>
		);
	};

	return (
		<Card data-testid={testId} className="pt-6 flex basis-full flex-col overflow-hidden motion-safe:transition-colors duration-300 bg-transparent shadow-none rounded-lg border border-secondary">
			{featured_image?.src && (
				<LinkWrapper className="bg-muted">
					{featured_image.imgData?.height && featured_image.imgData?.width ? (
						<Image
							src={featured_image.src}
							height={featured_image.imgData.height}
							width={featured_image.imgData.width}
							alt={featured_image.altText ?? ""}
							background={featured_image.imgData.css}
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
							layout="constrained"
							className="-mt-6 object-cover h-full w-full"
						/>
					) : (
						<Image
							src={featured_image.src}
							layout="fullWidth"
							alt={featured_image.altText ?? ""}
							className="-mt-6 object-cover h-full w-full"
						/>
					)}
				</LinkWrapper>
			)}

			<CardHeader className="gap-2">
				{meta && <div className="text-muted-foreground">{meta}</div>}
				<div>
					<CardTitle className="text-2xl font-bold">
						<LinkWrapper className="text-card-foreground hover:underline">
							{headline}
						</LinkWrapper>
					</CardTitle>
					{subheadline && (
						<div className="text-lg text-muted-foreground mt-2">
							{subheadline}
						</div>
					)}
				</div>
			</CardHeader>

			<Separator />

			<CardContent className="prose dark:prose-invert max-w-full text-pretty prose-p:my-0 prose-a:no-underline">
				{children}
			</CardContent>

			{footer && (
				<>
					<Separator />
					<CardFooter className="pt-6">{footer}</CardFooter>
				</>
			)}
		</Card>
	);
}
