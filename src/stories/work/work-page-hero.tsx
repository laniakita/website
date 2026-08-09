import { type ReactNode, Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { TextBlockSkeleton } from "@/stories/skeletons/text-block-skeleton";

export interface WorkPageHeroProps {
	/** Title of the page (e.g. "Work") */
	title: string;
	/** Renderable description node (e.g. MDX component or JSX) */
	description: ReactNode;
}

export function WorkPageHero({ title, description }: WorkPageHeroProps) {
	return (
		<div
			className='flex @lg/header:flex-row flex-col @lg/header:items-center justify-between @lg/header:gap-12 gap-8 @4xl/header:px-10 px-4'
			data-testid='work-page-hero'
		>
			<div className='relative flex @lg/header:max-w-[45%] flex-1 shrink-0 flex-col justify-start'>
				<span className='@lg/header:absolute @lg/header:bottom-full @lg/header:left-0 font-mono @md/header:text-2xs text-3xs text-muted-foreground uppercase tracking-widest'>
					LOG IDENTIFIER
				</span>
				<h1 className='font-black font-heading @2xl/header:text-8xl @4xl/header:text-9xl @sm/header:text-6xl @xl/header:text-7xl text-5xl uppercase leading-[0.8] tracking-tighter'>
					{title}
				</h1>
			</div>

			<Separator orientation='horizontal' className='@lg/header:hidden bg-primary/30' />
			<Separator orientation='vertical' className='@lg/header:block hidden bg-primary/30' />

			{/* Remarks/Description Section */}
			<div className='flex @lg/header:max-w-[50%] flex-1 flex-col justify-end pb-2'>
				<div className='flex flex-col'>
					<div className='font-mono @md/header:text-2xs text-3xs text-primary uppercase tracking-widest'>
						&gt; INITIALIZING REMARKS
					</div>
					<div className='prose-protocol-omega prose-p:my-0 w-full max-w-xl'>
						<Suspense fallback={<TextBlockSkeleton className='max-w-xl py-2' />}>{description}</Suspense>
					</div>
				</div>
			</div>
		</div>
	);
}
