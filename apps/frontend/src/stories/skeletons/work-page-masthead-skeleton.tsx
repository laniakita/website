import type { HTMLAttributes } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "$/src/lib/utils/cn";

function MastHeadSeparator() {
	return (
		<>
			<Separator orientation='horizontal' className='@sm/masthead:hidden bg-primary/30' />
			<Separator orientation='vertical' className='my-2 @sm/masthead:block hidden self-stretch bg-primary/30' />
		</>
	);
}

export function WorkPageMastheadSkeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("@container/masthead rounded border border-primary/30 bg-primary/10", className)}
			data-testid='work-page-masthead-skeleton'
			{...props}
		>
			<div className='grid @sm/masthead:grid-cols-[1fr_auto_1fr_auto_1fr] grid-cols-1 @sm/masthead:items-center @md:px-4 px-2'>
				<div className='flex items-center @lg/masthead:py-3 py-2'>
					<Skeleton className='h-4 w-28' />
				</div>

				<MastHeadSeparator />

				<div className='flex items-center justify-start @sm/masthead:justify-center @lg/masthead:py-3 py-2'>
					<Skeleton className='h-4 w-32' />
				</div>

				<MastHeadSeparator />

				<div className='flex items-center justify-start @sm/masthead:justify-end @lg/masthead:py-3 py-2'>
					<Skeleton className='h-4 w-24' />
				</div>
			</div>
		</div>
	);
}
