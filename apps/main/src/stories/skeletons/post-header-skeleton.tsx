export function PostHeaderSkeleton() {
	return (
		<header className='z-0 pt-post-page' data-testid='post-header-skeleton'>
			<div className='flex w-full flex-col items-center justify-center gap-2 px-6 pb-6 lg:pb-10'>
				{/* CatTagRoller skeleton */}
				<div className='mb-2 flex w-full max-w-3xl gap-2 md:max-w-2xl'>
					<div className='h-6 w-16 animate-pulse rounded-full bg-muted' />
					<div className='h-6 w-20 animate-pulse rounded-full bg-muted' />
				</div>

				{/* Headline skeleton */}
				<div className='h-10 w-full max-w-4xl animate-pulse rounded bg-muted md:h-12 md:max-w-2xl' />
				<div className='mt-2 h-10 w-3/4 max-w-4xl animate-pulse rounded bg-muted md:h-12 md:max-w-2xl' />

				{/* Byline / Date skeleton */}
				<div className='mt-4 flex w-full max-w-4xl md:max-w-2xl'>
					<div className='h-4 w-64 animate-pulse rounded bg-muted' />
				</div>

				{/* Share button skeleton */}
				<div className='mt-4 flex w-full max-w-4xl md:max-w-2xl'>
					<div className='h-8 w-24 animate-pulse rounded-md bg-muted' />
				</div>
			</div>

			<div className='flex size-full flex-col items-center justify-center'>
				{/* Hero image skeleton */}
				<div className='h-64 w-full animate-pulse rounded-none bg-muted object-cover md:h-96' />

				{/* Divider */}
				<div className='flex size-full w-full items-center justify-center px-6'>
					<div className='mt-6 w-full max-w-4xl rounded bg-ctp-text py-px md:max-w-2xl lg:mt-10' />
				</div>
			</div>
		</header>
	);
}
