import type { HTMLAttributes } from "react";
import { cn } from "$/src/lib/utils/cn";
import { WorkPageHeaderSkeleton } from "./work-page-header-skeleton";
import { WorkRollerSkeleton } from "./work-roller-skeleton";

export interface WorkPageSkeletonProps extends HTMLAttributes<HTMLElement> {
	/** Number of items to show in the roller skeleton */
	count?: number;
}

export function WorkPageSkeleton({ count = 3, className, ...props }: WorkPageSkeletonProps) {
	return (
		<main className={cn("m-auto w-full max-w-7xl", className)} data-testid='work-page-skeleton' {...props}>
			<div className='@container/page flex w-full flex-col items-center justify-center'>
				<WorkPageHeaderSkeleton />
				<WorkRollerSkeleton count={count} className='@4xl/page:px-10 px-2' />
			</div>
		</main>
	);
}
