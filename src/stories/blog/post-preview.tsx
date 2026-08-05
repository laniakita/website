import { Image } from "@unpic/react";
import type * as React from "react";
import { transform } from "unpic/providers/cloudflare";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/components/ui/link";
import { Separator } from "@/components/ui/separator";
import { type CatTag, CatTagRoller } from "./cat-tag-roller";

/** The post data to display in the preview card. */
export interface PostPreviewProps {
	/** The URL of the full blog post. */
	url: string;
	/** The main title of the post. */
	headline: string;
	/** An optional subtitle or supporting text for the headline. */
	subheadline?: string;
	/** The excerpt or short description of the post content. */
	description: React.ReactNode;
	/** The original publication date of the post. */
	date: Date | string;
	/** An optional date indicating when the post was last updated. */
	updated?: Date | string;
	/** An optional cover image to display at the top of the card. */
	featuredImage?: {
		src: string;
		altText?: string;
		height?: number;
		width?: number;
		blurHash?: string;
	};
	/** Categories associated with the post. */
	categories?: CatTag[];
	/** Tags associated with the post. */
	tags?: CatTag[];
}

function formatDate(date: Date | string) {
	const d = new Date(date);
	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(d);
}

/**
 * A card component that previews a blog post, displaying its featured image,
 * title, date, excerpt, and associated tags/categories.
 */
export function PostPreview(post: PostPreviewProps) {
	const {
		url,
		headline,
		subheadline,
		description,
		date,
		updated,
		featuredImage,
		categories,
		tags,
	} = post;

	return (
		<Card
			data-testid="post-preview-card"
			className="pt-6 flex basis-full flex-col overflow-hidden motion-safe:transition-colors duration-300 bg-transparent shadow-none rounded-lg border border-secondary"
		>
			{featuredImage?.src && (
				<Link to={url} className="bg-muted">
					{featuredImage.height && featuredImage.width ? (
						<Image
							src={featuredImage.src}
							height={featuredImage.height}
							width={featuredImage.width}
							alt={featuredImage.altText ?? ""}
							background={featuredImage.blurHash}
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
							src={featuredImage.src}
							layout="fullWidth"
							alt={featuredImage.altText ?? ""}
							className="-mt-6 object-cover h-full w-full"
						/>
					)}
				</Link>
			)}

			<CardHeader className="gap-2">
				<div className="flex flex-wrap gap-x-2 font-mono text-sm text-muted-foreground">
					{updated ? (
						<p className="flex w-fit flex-wrap gap-x-2 rounded-full">
							<strong>Updated:</strong> <span>{formatDate(updated)}</span>
						</p>
					) : (
						<p className="flex w-fit flex-wrap gap-x-2 rounded-full">
							<span>{formatDate(date)}</span>
						</p>
					)}
				</div>
				<div>
					<CardTitle className="text-2xl font-bold">
						<Link to={url} className="text-card-foreground hover:underline">
							{headline}
						</Link>
					</CardTitle>
					{subheadline && (
						<p className="text-lg text-muted-foreground mt-2">{subheadline}</p>
					)}
				</div>
			</CardHeader>

			<Separator />

			<CardContent className="prose dark:prose-invert max-w-full text-pretty prose-p:my-0 prose-a:no-underline">
				{description}
			</CardContent>

			<Separator />

			<CardFooter className="pt-6">
				<CatTagRoller cats={categories} tags={tags} />
			</CardFooter>
		</Card>
	);
}
