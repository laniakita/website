import type { HTMLAttributes } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "$/src/lib/utils";

export interface WorkPageMastheadProps extends HTMLAttributes<HTMLDivElement> {
	/** Total count of works/expeditions to display */
	totalWorks: number;
}

function MastHeadSeparator() {
	return (
		<>
			<Separator orientation='horizontal' className='@sm/masthead:hidden bg-primary/30' />
			<Separator orientation='vertical' className='my-2 @sm/masthead:block hidden self-stretch bg-primary/30' />
		</>
	);
}

export function WorkPageMasthead({ totalWorks, className, ...props }: WorkPageMastheadProps) {
	return (
		<div
			className={cn("@container/masthead rounded border border-primary/30 bg-primary/10", className)}
			data-testid='work-page-masthead'
			{...props}
		>
			<div className='grid @sm/masthead:grid-cols-[1fr_auto_1fr_auto_1fr] grid-cols-1 @sm/masthead:items-center @md:px-4 px-2'>
				<div className='flex items-center @lg/masthead:py-3 py-2 font-mono @lg/masthead:text-xs text-2xs text-muted-foreground uppercase tracking-widest'>
					<span>
						MISSION {"//"} <span className='font-bold'>THRIVE</span>
					</span>
				</div>

				<MastHeadSeparator />

				<div className='flex items-center justify-start @sm/masthead:justify-center @lg/masthead:py-3 py-2 font-mono @lg/masthead:text-xs text-2xs text-muted-foreground uppercase tracking-widest'>
					<span>
						EXPEDITION: <span className='font-bold'>{totalWorks.toString().padStart(3, "0")}</span>
					</span>
				</div>

				<MastHeadSeparator />

				<div className='flex items-center justify-start @sm/masthead:justify-end @lg/masthead:py-3 py-2 font-mono @lg/masthead:text-xs text-2xs text-muted-foreground uppercase tracking-widest'>
					<span>
						STATUS: <span className='font-bold'>NOMINAL</span>
					</span>
				</div>
			</div>
		</div>
	);
}
