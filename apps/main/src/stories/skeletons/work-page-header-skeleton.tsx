import type { HTMLAttributes } from "react";
import { cn } from "$/src/lib/utils/cn";
import { WorkPageHeroSkeleton } from "./work-page-hero-skeleton";
import { WorkPageMastheadSkeleton } from "./work-page-masthead-skeleton";

export function WorkPageHeaderSkeleton({ className, ...props }: HTMLAttributes<HTMLElement>) {
	return (
		<header
			className={cn(
				"@container/header mb-16 flex w-full flex-col @lg/page:gap-16 gap-8 @4xl/page:pt-4 md:mb-24",
				className,
			)}
			data-testid='work-page-header-skeleton'
			{...props}
		>
			<div className='@4xl/header:px-8 px-2 pt-4'>
				<WorkPageMastheadSkeleton />
			</div>
			<WorkPageHeroSkeleton />
		</header>
	);
}
