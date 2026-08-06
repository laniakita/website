import { CorePreview } from "@/stories/core/core-preview";
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
	featured_image?: {
		src: string;
		localHash: string;
		altText?: string;
		imgData?: {
			css: string;
			height: number;
			width: number;
		};
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
		featured_image,
		categories,
		tags,
	} = post;

	return (
		<CorePreview
			url={url}
			isExternal={false}
			headline={headline}
			subheadline={subheadline}
			featured_image={featured_image}
			data-testid="post-preview-card"
			meta={
				<div className="flex flex-wrap gap-x-2 font-mono text-sm">
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
			}
			footer={<CatTagRoller cats={categories} tags={tags} />}
		>
			{description}
		</CorePreview>
	);
}
