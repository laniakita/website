import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { WorkPreviewSkeleton } from "./work-preview-skeleton";

export interface WorkRollerSkeletonProps extends HTMLAttributes<HTMLDivElement> {
	/** Number of preview skeleton items to render */
	count?: number;
}

export function WorkRollerSkeleton({ count = 3, className, ...props }: WorkRollerSkeletonProps) {
	return (
		<div className={cn("flex w-full flex-col gap-10", className)} data-testid='work-roller-skeleton' {...props}>
			{Array.from({ length: count }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional placeholders
				<WorkPreviewSkeleton key={`work-skeleton-${index}`} isEven={index % 2 === 0} />
			))}
		</div>
	);
}
