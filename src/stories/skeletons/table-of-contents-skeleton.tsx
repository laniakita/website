export function TableOfContentsDesktopSkeleton() {
	return (
		<nav aria-label="Table of Contents Skeleton" data-testid="toc-desktop-skeleton" className="sticky top-0 hidden max-h-dvh min-w-80 overflow-x-hidden overflow-y-auto border-r border-border bg-background shadow-xl md:block md:w-80 lg:w-96 lg:min-w-96">
			<div className="sticky top-0 z-10 flex min-h-16 w-full flex-row items-center justify-start bg-background/80 px-4 backdrop-blur-md">
				<div className="h-6 w-6 animate-pulse rounded bg-muted" />
			</div>
			<div className="p-4">
				<div className="flex flex-col gap-4">
					<div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
					<div className="h-4 w-1/2 animate-pulse rounded bg-muted ml-4" />
					<div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
					<div className="h-4 w-2/3 animate-pulse rounded bg-muted ml-4" />
					<div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
				</div>
			</div>
		</nav>
	);
}

export function TableOfContentsMobileSkeleton() {
	return (
		<nav aria-label="Mobile Table of Contents Skeleton" data-testid="toc-mobile-skeleton" className="sticky top-16 z-40 block w-full md:hidden">
			<div className="absolute z-30 flex w-full flex-row items-center border-b border-border/50 bg-background/80 backdrop-blur-sm">
				<div className="relative z-35 flex size-full h-12 flex-row items-center gap-4 px-6">
					<div className="h-4 w-24 animate-pulse rounded bg-muted" />
					<div className="flex flex-row items-center gap-2 overflow-hidden">
						<span className="icon-[ph--caret-double-right-bold] text-muted" />
						<div className="h-4 w-32 animate-pulse rounded bg-muted" />
					</div>
				</div>
			</div>
		</nav>
	);
}

export function TableOfContentsSkeleton() {
	return (
		<>
			<TableOfContentsDesktopSkeleton />
			<TableOfContentsMobileSkeleton />
		</>
	);
}
