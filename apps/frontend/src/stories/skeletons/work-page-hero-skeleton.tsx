import type { HTMLAttributes } from "react";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "$/src/lib/utils";
import { TextBlockSkeleton } from "./text-block-skeleton";

export function WorkPageHeroSkeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex @lg/header:flex-row flex-col @lg/header:items-center justify-between @lg/header:gap-12 gap-8 @4xl/header:px-10 px-4",
				className,
			)}
			data-testid='work-page-hero-skeleton'
			{...props}
		>
			<div className='relative flex @lg/header:max-w-[45%] flex-1 shrink-0 flex-col justify-start gap-2'>
				<Skeleton className='h-3 w-24' />
				<Skeleton className='@2xl/header:h-24 @4xl/header:h-28 @sm/header:h-20 h-16 w-3/4' />
			</div>

			<Separator orientation='horizontal' className='@lg/header:hidden bg-primary/30' />
			<Separator orientation='vertical' className='@lg/header:block hidden h-32 bg-primary/30' />

			<div className='flex @lg/header:max-w-[50%] flex-1 flex-col justify-end gap-3 pb-2'>
				<Skeleton className='h-3 w-36' />
				<TextBlockSkeleton className='max-w-xl' />
			</div>
		</div>
	);
}
