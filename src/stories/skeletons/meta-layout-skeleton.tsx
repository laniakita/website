import { Skeleton } from "@/components/ui/skeleton";
import { PostRollerSkeleton } from "./post-roller-skeleton";

export function MetaLayoutSkeleton() {
	return (
		<div
			className="relative z-5 -mb-1 flex flex-col gap-4 common-padding md:gap-6"
			data-testid="meta-layout-skeleton"
		>
			<div className="flex items-center justify-center">
				<div className="flex w-full max-w-3xl flex-col gap-4 rounded-md border border-ctp-surface0 bg-ctp-base p-8 motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight">
					<div className="">
						<Skeleton className="h-9 w-48 md:h-10 md:w-64" />
					</div>
					<div className="h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base" />
					<div className="w-full max-w-sm space-y-2 mt-4">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-4/5" />
					</div>
				</div>
			</div>
			<PostRollerSkeleton />
		</div>
	);
}
