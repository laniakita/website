import type * as React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

function SimpleRoller({
	title,
	items,
}: {
	title: string;
	items: { title: string; url: string }[];
}) {
	if (!items || items.length === 0) return null;
	return (
		<div className="mb-4">
			<h3 className="font-bold mb-2 font-heading">{title}</h3>
			<div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
				{items.map((item, idx) => (
					<span key={`${item.url}`}>
						<a
							href={item.url}
							className="hover:underline hover:text-foreground"
						>
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
export function InfoBox({
	blogInfo,
	categories,
	tags,
	className,
}: InfoBoxProps) {
	return (
		<Card className={`${className} py-0`}>
			<Tabs defaultSelectedKey="info" className="w-full">
				<TabsList className="w-full justify-start rounded-none rounded-t-lg border-b bg-muted/50 p-0 h-auto font-heading capitalize">
					<TabsTrigger
						id="info"
						className="data-selected:bg-background rounded-none border-b-2 border-transparent data-selected:border-primary px-6 py-3"
					>
						<span className="icon-[ph--info] text-xl mr-2" /> info
					</TabsTrigger>
					<TabsTrigger
						id="meta"
						className="data-selected:bg-background rounded-none border-b-2 border-transparent data-selected:border-primary px-6 py-3"
					>
						<span className="icon-[ph--tag] text-xl mr-2" /> meta
					</TabsTrigger>
				</TabsList>
				<TabsContent id="info" className="p-4 md:p-6 -mt-2">
					<div className="prose dark:prose-invert max-w-none text-sm">
						{blogInfo}
					</div>
				</TabsContent>
				<TabsContent id="meta" className="p-4 md:p-6 -mt-2">
					<SimpleRoller title="Categories" items={categories} />
					<SimpleRoller title="Tags" items={tags} />
				</TabsContent>
			</Tabs>
		</Card>
	);
}
