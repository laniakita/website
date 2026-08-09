import { MAIN_PAGES, SOCIALS_NAVBAR } from "@/components/nav-constants";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { CommentsSkeleton } from "./comments-skeleton";
import { PostHeaderSkeleton } from "./post-header-skeleton";
import { TableOfContentsDesktopSkeleton, TableOfContentsMobileSkeleton } from "./table-of-contents-skeleton";

export function PostPageSkeleton() {
	return (
		<div className='flex size-full flex-col md:relative md:flex-row' data-testid='post-page-skeleton'>
			<TableOfContentsDesktopSkeleton />

			<div className='flex size-full min-w-0 flex-col'>
				<Header
					navItems={MAIN_PAGES}
					socialItems={SOCIALS_NAVBAR}
					isPost={true}
					tocInView={false}
					onTocToggle={() => {}}
				/>

				<TableOfContentsMobileSkeleton />

				<main className='-mb-0.5 flex min-h-full w-full flex-col pt-20 pb-10 md:pt-16'>
					<article>
						<PostHeaderSkeleton />
						<div className='mt-8 w-full px-6'>
							<div className='mx-auto max-w-4xl space-y-4 md:max-w-2xl'>
								<div className='h-6 w-full animate-pulse rounded bg-muted' />
								<div className='h-6 w-[95%] animate-pulse rounded bg-muted' />
								<div className='h-6 w-[90%] animate-pulse rounded bg-muted' />
								<div className='h-6 w-[92%] animate-pulse rounded bg-muted' />
								<br />
								<div className='h-6 w-full animate-pulse rounded bg-muted' />
								<div className='h-6 w-[80%] animate-pulse rounded bg-muted' />
								<br />
								<div className='h-64 w-full animate-pulse rounded-md bg-muted' />
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
