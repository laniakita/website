import type { HTMLAttributes } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "$/src/lib/utils";
import { TextBlockSkeleton } from "./text-block-skeleton";

export interface WorkPreviewSkeletonProps extends HTMLAttributes<HTMLDivElement> {
	/** Layout variation for alternating grid alignment */
	isEven?: boolean;
}

export function WorkPreviewSkeleton({ isEven = true, className, ...props }: WorkPreviewSkeletonProps) {
	return (
		<div className={cn("@container w-full", className)} data-testid='work-preview-skeleton' {...props}>
			<div className='relative grid w-full @3xl:grid-cols-2 grid-cols-1 @3xl:gap-x-24 py-10'>
				{/* 1. Title Block */}
				<div
					className={cn(
						"z-20 flex w-full flex-col items-start @3xl:px-0 px-2",
						isEven ? "@3xl:col-start-1 @3xl:text-left" : "@3xl:col-start-2 @3xl:items-end @3xl:text-right",
						"@3xl:row-start-1 @3xl:self-end",
					)}
				>
					{/* Meta */}
					<div className='mb-2 flex items-center'>
						<Skeleton className='h-3 w-20' />
					</div>

					{/* Title */}
					<div className='mb-4 w-full'>
						<Skeleton className='@2xl:h-14 @3xl:h-16 @xl:h-12 h-10 w-3/4' />
					</div>
				</div>

				{/* 2. Image Parallax Container */}
				<div
					className={cn(
						"relative z-10 -mt-10 w-full overflow-hidden rounded-sm",
						"@3xl:mt-0 @3xl:self-center bg-ctp-surface0 shadow-xl dark:bg-ctp-crust",
						isEven ? "@3xl:col-start-2" : "@3xl:col-start-1",
						"@3xl:row-span-2 @3xl:row-start-1",
					)}
				>
					<div className='aspect-video w-full'>
						<Skeleton className='h-full w-full rounded-none' />
					</div>
				</div>

				{/* 3. Description Plaque */}
				<div
					className={cn(
						"z-30 -mt-10 @3xl:mt-0 flex w-full flex-col",
						isEven ? "@3xl:col-start-1 @3xl:items-start" : "@3xl:col-start-2 @3xl:items-end @3xl:text-right",
						"@3xl:row-start-2 @3xl:self-start @3xl:px-0 px-2",
					)}
				>
					<div
						className={cn(
							"relative flex w-full flex-col overflow-hidden rounded-xl",
							"@3xl:rounded-none @3xl:p-0 p-4 @3xl:shadow-none shadow-2xl",
						)}
					>
						<div className='relative z-10 flex w-full flex-col gap-y-4'>
							{/* Description lines */}
							<TextBlockSkeleton />
							<Separator />
							{/* Footer (Tech & Links) */}
							<div className={cn("flex w-full flex-col gap-4", isEven ? "items-start" : "items-start @3xl:items-end")}>
								<div
									className={cn("flex flex-wrap gap-1", isEven ? "justify-start" : "justify-start @3xl:justify-end")}
								>
									<Skeleton className='h-5 w-14 rounded-sm' />
									<Skeleton className='h-5 w-16 rounded-sm' />
									<Skeleton className='h-5 w-12 rounded-sm' />
								</div>
								<Separator />
								<div
									className={cn(
										"mt-2 flex flex-wrap gap-6",
										isEven ? "justify-start" : "justify-start @3xl:justify-end",
									)}
								>
									<Skeleton className='h-4 w-20' />
									<Skeleton className='h-4 w-24' />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
