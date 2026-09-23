import { type ReactNode, Suspense } from "react";
import { Separator } from "react-aria-components";
import { InfoContentSkeleton } from "../skeletons/info-layout-skeleton";

export function InfoLayout({ title, children }: { title: string; children: ReactNode }) {
	return (
		<div className='flex min-h-[calc(100dvh-5rem)] flex-col items-center gap-y-4 px-4 pt-10 md:gap-y-6'>
			<header className='@container/header w-full max-w-3xl space-y-10'>
				<div>
					<span className='font-mono @md/header:text-2xs text-3xs text-muted-foreground uppercase tracking-widest'>
						LOG IDENTIFIER
					</span>
					<h1 className='text-balance font-black font-heading @2xl/header:text-8xl @4xl/header:text-9xl @sm/header:text-6xl @xl/header:text-7xl text-5xl uppercase leading-[0.8] tracking-tighter'>
						{title}
					</h1>
				</div>
				<Separator className='bg-primary/30' />
			</header>
			<main>
				<article id='content' className='size-full'>
					<div className='prose-protocol-omega w-full max-w-3xl px-0'>
						<Suspense fallback={<InfoContentSkeleton />}>{children}</Suspense>
					</div>
				</article>
			</main>
		</div>
	);
}
