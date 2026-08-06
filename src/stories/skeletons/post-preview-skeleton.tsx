import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PostPreviewSkeleton() {
	return (
		<Card
			data-testid="post-preview-skeleton"
			className="pt-6 flex basis-full flex-col overflow-hidden motion-safe:transition-colors duration-300 bg-transparent shadow-none rounded-lg border border-secondary"
		>
			<div className="-mt-6 w-full aspect-video md:aspect-[2/1]">
				<Skeleton className="h-full w-full rounded-none" />
			</div>

			<CardHeader className="gap-2 mt-2">
				<div className="flex flex-wrap gap-x-2 font-mono text-sm">
					<Skeleton className="h-5 w-32" />
				</div>
				<div>
					<CardTitle className="text-2xl font-bold mt-2">
						<Skeleton className="h-8 w-3/4" />
					</CardTitle>
					<div className="mt-2">
						<Skeleton className="h-6 w-1/2" />
					</div>
				</div>
			</CardHeader>

			<Separator />

			<CardContent className="max-w-full py-6">
				<div className="space-y-2">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-[90%]" />
					<Skeleton className="h-4 w-[95%]" />
				</div>
			</CardContent>

			<Separator />

			<CardFooter className="pt-6">
				<div className="flex flex-wrap gap-2">
					<Skeleton className="h-6 w-16 rounded-full" />
					<Skeleton className="h-6 w-20 rounded-full" />
					<Skeleton className="h-6 w-24 rounded-full" />
				</div>
			</CardFooter>
		</Card>
	);
}
