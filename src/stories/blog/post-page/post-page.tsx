import { ClientOnly } from "@tanstack/react-router";
import type * as React from "react";
// We import Header just for Storybook structure, but in a real app this might be in a layout
import { Header, type HeaderProps } from "@/components/navigation/header";
import { useToCViewStore } from "@/lib/providers/toc-view-store-provider";
import { Comments, CommentsSkeleton } from "./comments";
import { PostHeader, type PostHeaderProps } from "./post-header";
import {
	TableOfContentsDesktop,
	TableOfContentsDesktopSkeleton,
	TableOfContentsMobile,
	TableOfContentsMobileSkeleton,
	type ToCMenuProps,
} from "./table-of-contents";

export interface PostPageProps extends PostHeaderProps {
	/**
	 * Rendered MDX content component
	 */
	MDXContent: React.ReactNode;
	/**
	 * Table of contents props
	 */
	toc: ToCMenuProps;
	header: HeaderProps;
}

export function PostPage(props: PostPageProps) {
	const { tocInView, setToCInView } = useToCViewStore((state) => state);

	return (
		<div className="flex size-full flex-col md:relative md:flex-row bg-background">
			{/* Desktop ToC (will only show if useToCViewStore says so and screen is md+) */}
			<ClientOnly fallback={<TableOfContentsDesktopSkeleton />}>
				<TableOfContentsDesktop {...props.toc} />
			</ClientOnly>

			<div className="size-full min-w-0 flex flex-col">
				<Header
					navItems={props.header.navItems}
					socialItems={props.header.socialItems}
					isPost={true}
					tocInView={tocInView}
					onTocToggle={setToCInView}
				/>

				{/* Mobile ToC (will only show on md-) */}
				{/* Note: It's important that TableOfContents Mobile part renders here in the layout tree */}
				<ClientOnly fallback={<TableOfContentsMobileSkeleton />}>
					<TableOfContentsMobile {...props.toc} />
				</ClientOnly>

				<main className="-mb-0.5 pt-20 md:pt-16  flex min-h-full w-full flex-col pb-10">
					<article id="content">
						<PostHeader {...props} />
						<div className="w-full px-6">
							<div className="prose-protocol-omega mx-auto max-w-4xl md:max-w-2xl dark:prose-invert">
								{props.MDXContent}
							</div>
						</div>
					</article>
					<ClientOnly fallback={<CommentsSkeleton />}>
						<Comments />
					</ClientOnly>
				</main>
			</div>
		</div>
	);
}
