import type * as React from "react";
import { Card } from "@/components/ui/card";
import { SmoothTabsTrigger, Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { cn } from "$/src/lib/utils/cn";

export interface InfoBoxProps extends React.HTMLAttributes<HTMLDivElement> {
	/** The main text or React node containing biographical or descriptive info. */
	blogInfo?: React.ReactNode;
	/** A list of category links to display in the meta tab. */
	categories: { title: string; url: string }[];
	/** A list of tag links to display in the meta tab. */
	tags: { title: string; url: string }[];
	/** Optional CSS class name for overriding container styles. */
	//className?: string;
}

function SimpleRoller({ title, items }: { title: string; items: { title: string; url: string }[] }) {
	if (!items || items.length === 0) return null;
	return (
		<div className='mb-4'>
			<h3 className='mb-2 font-bold font-heading'>{title}</h3>
			<div className='flex flex-wrap gap-2 text-muted-foreground text-sm'>
				{items.map((item, idx) => (
					<span key={`${item.url}`}>
						<a href={item.url} className='hover:text-foreground hover:underline'>
							{item.title}
						</a>
						{idx < items.length - 1 && <span>,</span>}
					</span>
				))}
			</div>
		</div>
	);
}

/**
 * A tabbed card component that displays either general blog information
 * or meta information (like categories and tags).
 */
export function InfoBox({ blogInfo, categories, tags, className }: InfoBoxProps) {
	return (
		<Card className={cn("bg-background py-0", className)}>
			<Tabs defaultSelectedKey='info' className='w-full'>
				<TabsList className='h-auto w-full justify-start rounded-none border-background border-b-2 bg-secondary px-6 pt-2 font-heading capitalize'>
					<SmoothTabsTrigger id='info'>
						<span className='icon-[ph--info] mr-2 text-xl' /> info
					</SmoothTabsTrigger>
					<SmoothTabsTrigger id='meta'>
						<span className='icon-[ph--tag] mr-2 text-xl' /> meta
					</SmoothTabsTrigger>
				</TabsList>
				<TabsContent id='info' className='-mt-2 p-4 md:p-6'>
					<div className='prose dark:prose-invert max-w-none text-sm'>{blogInfo}</div>
				</TabsContent>
				<TabsContent id='meta' className='-mt-2 p-4 md:p-6'>
					<SimpleRoller title='Categories' items={categories} />
					<SimpleRoller title='Tags' items={tags} />
				</TabsContent>
			</Tabs>
		</Card>
	);
}
