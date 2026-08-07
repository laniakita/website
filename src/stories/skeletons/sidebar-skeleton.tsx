import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/stories/sidebar/sidebar";

export function SidebarSkeleton() {
	return (
		<div data-testid='sidebar-skeleton'>
			<Sidebar
				infoBoxSlot={
					<div className='flex flex-col gap-4 rounded-lg bg-background p-4'>
						<Skeleton className='h-24 w-full rounded-md' />
						<div className='space-y-2'>
							<Skeleton className='h-4 w-full' />
							<Skeleton className='h-4 w-5/6' />
						</div>
						<div className='mt-2 flex flex-wrap gap-2'>
							<Skeleton className='h-6 w-16 rounded-full' />
							<Skeleton className='h-6 w-20 rounded-full' />
						</div>
					</div>
				}
				subscribeBoxSlot={
					<div className='flex flex-col gap-4 rounded-lg bg-background p-4'>
						<Skeleton className='h-6 w-3/4' />
						<Skeleton className='h-4 w-full' />
						<Skeleton className='h-10 w-full rounded-md' />
					</div>
				}
				socialBoxSlot={
					<div className='flex gap-4'>
						<Skeleton className='h-8 w-8 rounded-full' />
						<Skeleton className='h-8 w-8 rounded-full' />
						<Skeleton className='h-8 w-8 rounded-full' />
					</div>
				}
			/>
		</div>
	);
}
