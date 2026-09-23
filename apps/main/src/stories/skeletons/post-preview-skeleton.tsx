import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export function PostPreviewSkeleton() {
	return (
		<Card
			data-testid='post-preview-skeleton'
			className='flex basis-full flex-col overflow-hidden rounded-lg border border-secondary bg-transparent pt-6 shadow-none duration-300 motion-safe:transition-colors'
		>
			<div className='-mt-6 aspect-video w-full md:aspect-2/1'>
				<Skeleton className='h-full w-full rounded-none' />
			</div>

			<CardHeader className='mt-2 gap-2'>
				<div className='flex flex-wrap gap-x-2 font-mono text-sm'>
					<Skeleton className='h-5 w-32' />
				</div>
				<div>
					<CardTitle className='mt-2 font-bold text-2xl'>
						<Skeleton className='h-8 w-3/4' />
					</CardTitle>
					<div className='mt-2'>
						<Skeleton className='h-6 w-1/2' />
					</div>
				</div>
			</CardHeader>

			<Separator />

			<CardContent className='max-w-full py-6'>
				<div className='space-y-2'>
					<Skeleton className='h-4 w-full' />
					<Skeleton className='h-4 w-[90%]' />
					<Skeleton className='h-4 w-[95%]' />
				</div>
			</CardContent>

			<Separator />

			<CardFooter className='pt-6'>
				<div className='flex flex-wrap gap-2'>
					<Skeleton className='h-6 w-16 rounded-full' />
					<Skeleton className='h-6 w-20 rounded-full' />
					<Skeleton className='h-6 w-24 rounded-full' />
				</div>
			</CardFooter>
		</Card>
	);
}
