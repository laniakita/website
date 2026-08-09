import type { HTMLAttributes } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "$/src/lib/utils";

export interface TextBlockSkeletonProps extends HTMLAttributes<HTMLDivElement> {
	/** Optional number of text lines (default: 3) */
	lines?: number;
}

export function TextBlockSkeleton({ lines = 3, className, ...props }: TextBlockSkeletonProps) {
	return (
		<div className={cn("w-full space-y-2", className)} data-testid='text-block-skeleton' {...props}>
			{Array.from({ length: lines }).map((_, index) => {
				let width = "w-full";
				if (index === lines - 1 && lines > 1) {
					width = "w-[85%]";
				} else if (index === lines - 2 && lines > 2) {
					width = "w-[92%]";
				}
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: skeleton items are positional placeholders
					<Skeleton key={`text-line-${index}`} className={cn("h-4", width)} />
				);
			})}
		</div>
	);
}
