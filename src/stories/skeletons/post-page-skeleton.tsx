import { Header } from "@/components/navigation/header";
import { Footer } from "@/components/navigation/footer";
import { SOCIALS_NAVBAR } from "@/components/nav-constants";
import { defaultNavItems } from "@/components/navigation/header/data";
import { TableOfContentsDesktopSkeleton, TableOfContentsMobileSkeleton } from "./table-of-contents-skeleton";
import { PostHeaderSkeleton } from "./post-header-skeleton";
import { CommentsSkeleton } from "./comments-skeleton";

export function PostPageSkeleton() {
	return (
		<div className="flex size-full flex-col md:relative md:flex-row" data-testid="post-page-skeleton">
			<TableOfContentsDesktopSkeleton />

			<div className="size-full min-w-0 flex flex-col">
				<Header
					navItems={defaultNavItems}
					socialItems={SOCIALS_NAVBAR}
					isPost={true}
					tocInView={false}
					onTocToggle={() => {}}
				/>

				<TableOfContentsMobileSkeleton />

				<main className="-mb-0.5 pt-20 md:pt-16 flex min-h-full w-full flex-col pb-10">
					<article>
						<PostHeaderSkeleton />
						<div className="w-full px-6 mt-8">
							<div className="mx-auto max-w-4xl md:max-w-2xl space-y-4">
								<div className="h-6 w-full animate-pulse rounded bg-muted" />
								<div className="h-6 w-[95%] animate-pulse rounded bg-muted" />
								<div className="h-6 w-[90%] animate-pulse rounded bg-muted" />
								<div className="h-6 w-[92%] animate-pulse rounded bg-muted" />
								<br />
								<div className="h-6 w-full animate-pulse rounded bg-muted" />
								<div className="h-6 w-[80%] animate-pulse rounded bg-muted" />
								<br />
								<div className="h-64 w-full animate-pulse rounded-md bg-muted" />
							</div>
						</div>
					</article>
					<CommentsSkeleton />
					<Footer />
				</main>
			</div>
		</div>
	);
}
