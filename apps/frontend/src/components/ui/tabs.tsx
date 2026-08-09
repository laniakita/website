"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import {
	TabList as TabListPrimitive,
	TabPanel as TabPanelPrimitive,
	Tab as TabPrimitive,
	Tabs as TabsPrimitive,
} from "react-aria-components";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive>) {
	return (
		<TabsPrimitive
			data-slot='tabs'
			className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
			{...props}
		/>
	);
}

const tabsListVariants = cva(
	"group/tabs-list inline-flex w-fit items-center justify-center rounded-full p-1 text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:rounded-2xl data-[variant=line]:rounded-none",
	{
		variants: {
			variant: {
				default: "bg-muted",
				line: "gap-1 bg-transparent",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

function TabsList({
	className,
	variant = "default",
	...props
}: React.ComponentProps<typeof TabListPrimitive> & VariantProps<typeof tabsListVariants>) {
	return (
		<TabListPrimitive
			data-slot='tabs-list'
			data-variant={variant}
			className={cn(tabsListVariants({ variant }), className)}
			{...props}
		/>
	);
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabPrimitive>) {
	return (
		<TabPrimitive
			data-slot='tabs-trigger'
			className={cn(
				"relative inline-flex h-[calc(100%-1px)] flex-1 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-full border border-transparent! px-3 py-1 font-medium text-foreground/60 text-sm transition-all hover:text-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 data-disabled:pointer-events-none data-disabled:opacity-50 group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:rounded-2xl group-data-vertical/tabs:px-3 group-data-vertical/tabs:py-1.5 dark:text-muted-foreground dark:hover:text-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
				"group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-selected:bg-transparent dark:group-data-[variant=line]/tabs-list:data-selected:border-transparent dark:group-data-[variant=line]/tabs-list:data-selected:bg-transparent",
				"data-selected:bg-background data-selected:text-foreground dark:data-selected:border-input dark:data-selected:bg-input/30 dark:data-selected:text-foreground",
				"after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-horizontal/tabs:after:-bottom-1.25 group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-selected:after:opacity-100",
				className,
			)}
			{...props}
		/>
	);
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabPanelPrimitive>) {
	return (
		<TabPanelPrimitive data-slot='tabs-content' className={cn("flex-1 text-sm outline-none", className)} {...props} />
	);
}

function SmoothTabsTrigger({ className, ...props }: React.ComponentProps<typeof TabPrimitive>) {
	return (
		<TabPrimitive
			data-slot='tabs-trigger-smooth'
			className={cn(
				"relative inline-flex flex-1 cursor-default items-center justify-center gap-2 whitespace-nowrap rounded-t-xl border border-transparent! px-3 py-1 pb-2 font-medium text-foreground/60 text-sm focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
				"text-foreground data-selected:bg-background dark:data-selected:bg-background",
				className,
			)}
			{...props}
		>
			{(renderProps) => {
				const { isSelected } = renderProps;
				return (
					<>
						{!isSelected && (
							<span className='absolute inset-0 z-10 mx-2 mt-px mb-1.5 rounded-xl transition-colors duration-300 hover:bg-primary/80 dark:hover:bg-primary/60' />
						)}

						{isSelected && (
							<>
								<div className='pointer-events-none absolute bottom-0 -left-2 h-2 w-2 bg-[radial-gradient(circle_at_top_left,transparent_8px,var(--color-background)_8px)] dark:bg-[radial-gradient(circle_at_top_left,transparent_8px,var(--color-background)_8px)]' />
								<div className='pointer-events-none absolute -right-2 bottom-0 h-2 w-2 bg-[radial-gradient(circle_at_top_right,transparent_8px,var(--color-background)_8px)] dark:bg-[radial-gradient(circle_at_top_right,transparent_8px,var(--color-background)_8px)]' />
							</>
						)}

						{/* Content wrapper with higher z-index so text sits above the hover effect */}
						<span className='pointer-events-none z-20 flex flex-row items-center gap-[1ch]'>
							{typeof props.children === "function" ? props.children(renderProps) : props.children}
						</span>
					</>
				);
			}}
		</TabPrimitive>
	);
}

export { SmoothTabsTrigger, Tabs, TabsContent, TabsList, TabsTrigger, tabsListVariants };
