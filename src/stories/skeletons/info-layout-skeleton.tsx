import { Skeleton } from "@/components/ui/skeleton";

export function InfoLayoutSkeleton() {
	return (
		<main className='w-full pt-10' data-testid='info-layout-skeleton'>
			<article className='flex size-full flex-col items-center justify-center'>
				<div className='padding-post flex min-h-full w-full items-center justify-center'>
					<div className='min-w-full max-w-3xl px-0'>
						<InfoContentSkeleton />
					</div>
				</div>
			</article>
		</main>
	);
}

export function InfoContentSkeleton() {
	return (
		<div className='min-w-full space-y-8'>
			<div>
				<Skeleton className='mb-6 h-12 w-64' />
				<div className='space-y-3'>
					<Skeleton className='h-5 w-full' />
					<Skeleton className='h-5 w-[95%]' />
					<Skeleton className='h-5 w-[90%]' />
					<Skeleton className='h-5 w-[92%]' />
					<Skeleton className='h-5 w-[85%]' />
				</div>
			</div>

			<div>
				<Skeleton className='mt-8 mb-4 h-8 w-full' />
				<div className='space-y-3'>
					<Skeleton className='h-5 w-[98%]' />
					<Skeleton className='h-5 w-[90%]' />
					<Skeleton className='h-5 w-full' />
					<Skeleton className='h-5 w-[80%]' />
				</div>
			</div>
		</div>
	);
}
