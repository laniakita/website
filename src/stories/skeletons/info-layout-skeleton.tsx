import { Skeleton } from "@/components/ui/skeleton";

export function InfoLayoutSkeleton() {
	return (
		<main className="py-common-info-page w-full" data-testid="info-layout-skeleton">
			<article className="flex size-full flex-col items-center justify-center">
				<div className="flex min-h-full items-center justify-center padding-post w-full">
					<div className="w-full max-w-3xl px-0 space-y-8">
						<div>
							<Skeleton className="h-12 w-64 mb-6" />
							<div className="space-y-3">
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-[95%]" />
								<Skeleton className="h-5 w-[90%]" />
								<Skeleton className="h-5 w-[92%]" />
								<Skeleton className="h-5 w-[85%]" />
							</div>
						</div>
						
						<div>
							<Skeleton className="h-8 w-48 mb-4 mt-8" />
							<div className="space-y-3">
								<Skeleton className="h-5 w-[98%]" />
								<Skeleton className="h-5 w-[90%]" />
								<Skeleton className="h-5 w-full" />
								<Skeleton className="h-5 w-[80%]" />
							</div>
						</div>
					</div>
				</div>
			</article>
		</main>
	);
}
