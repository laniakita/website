import { type ReactNode, Suspense } from "react";
import { InfoContentSkeleton } from "../skeletons/info-layout-skeleton";

export function InfoLayout({ children }: { children: ReactNode }) {
	return (
		<main className='min-h-[calc(100dvh-5rem)] px-4 pt-10'>
			<article id='content' className='flex size-full flex-col items-center justify-center'>
				<div className='flex min-h-full w-full max-w-3xl items-center justify-center'>
					<div className='prose-protocol-omega w-full max-w-3xl px-0'>
						<Suspense fallback={<InfoContentSkeleton />}>{children}</Suspense>
					</div>
				</div>
			</article>
		</main>
	);
}
