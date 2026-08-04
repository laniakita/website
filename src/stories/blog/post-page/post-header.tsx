import { Link } from "@/components/ui/link";
import type { CatTag } from "../cat-tag-roller";
import { CatTagRoller } from "../cat-tag-roller";
import { HeroBlur } from "./hero-blur";
import { PostDate } from "./post-date";
import { ShareButton } from "./share";

export interface PostHeaderProps {
	url: string;
	headline: string;
	subheadline?: string;
	author?: string;
	date: string | Date;
	updated?: string | Date;
	categories?: CatTag[];
	tags?: CatTag[];
	featured_image?: {
		src: string;
		height?: number;
		width?: number;
		base64?: string;
		altText?: string;
		caption?: string;
		hasImage?: boolean;
	};
	caption?: string;
}

export function PostHeader(post: PostHeaderProps) {
	// For Storybook and migration, authorName might just be a generic lookup.
	// You would wire this up to your actual authors collection.
	const authorName = post.author ?? "Lani";

	const urlSlug = post.url.split("/").pop() ?? "";

	return (
		<header className="z-0 pt-post-page">
			<div className="flex w-full flex-col items-center justify-center gap-2 px-6 pb-6 lg:pb-10">
				<div className="w-full max-w-3xl font-mono md:max-w-2xl">
					<CatTagRoller cats={post.categories} tags={post.tags} />
				</div>

				<h1 id={urlSlug} className="post-headline">
					{post.headline}
				</h1>

				{post.subheadline && (
					<h2 className="post-subheadline">{post.subheadline}</h2>
				)}

				<div className="flex w-full max-w-4xl flex-wrap items-center gap-x-[0.5ch] font-mono text-xs md:max-w-2xl lg:text-sm">
					<p>
						By{" "}
						<Link to="/about" className="font-semibold capitalize">
							{authorName}
						</Link>
					</p>
					<span className="font-light">|</span>
					{post.updated ? (
						<p
							itemProp="dateModified"
							itemScope
							itemType="http://schema.org/Date"
							className="flex flex-wrap gap-x-2"
						>
							<span>Updated:</span>
							<PostDate date={post.updated} />
						</p>
					) : (
						<p
							itemProp="datePublished"
							itemScope
							itemType="http://schema.org/Date"
						>
							<PostDate date={post.date} />
						</p>
					)}
				</div>

				<div className="flex w-full max-w-4xl items-center justify-start pt-3 md:max-w-2xl lg:pt-7">
					<ShareButton title={post.headline} url={post.url} />
				</div>
			</div>

			<div className="flex size-full flex-col items-center justify-center">
				{post.featured_image?.hasImage ? (
					<figure className="relative flex size-full flex-col items-center justify-center gap-6">
						<HeroBlur featured_image={post.featured_image} />
						<p className="header-alt-text">
							<span className="w-full max-w-4xl md:max-w-2xl">
								{post.featured_image.altText}
							</span>
						</p>
						<figcaption className="header-caption">
							<span className="max-w-4xl md:max-w-2xl">
								{post.featured_image.caption}
							</span>
						</figcaption>
					</figure>
				) : post.caption ? (
					<div>
						<p className="header-caption">
							<span className="max-w-4xl md:max-w-2xl">{post.caption}</span>
						</p>
					</div>
				) : null}

				<div className="flex size-full w-full items-center justify-center px-6">
					<div className="mt-6 w-full max-w-4xl rounded bg-ctp-text py-px md:max-w-2xl lg:mt-10" />
				</div>
			</div>
		</header>
	);
}
