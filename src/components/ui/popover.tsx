"use client";

import type * as React from "react";
import {
	DialogTrigger,
	type DialogTriggerProps,
	Heading,
	Popover as PopoverPrimitive,
	type PopoverProps as PopoverPrimitiveProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

function PopoverTrigger({ children, ...props }: DialogTriggerProps) {
	return (
		<DialogTrigger data-slot='popover-trigger' {...props}>
			{children}
		</DialogTrigger>
	);
}

function Popover({
	className,
	placement = "bottom",
	offset = 4,
	crossOffset = 0,
	...props
}: Omit<PopoverPrimitiveProps, "className"> & {
	className?: string;
}) {
	return (
		<PopoverPrimitive
			data-slot='popover-content'
			placement={placement}
			offset={offset}
			crossOffset={crossOffset}
			className={cn(
				"data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:fade-out-0 data-exiting:zoom-out-95 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 z-50 flex w-72 origin-(--trigger-anchor-point) flex-col gap-4 rounded-3xl bg-popover p-4 text-popover-foreground text-sm shadow-lg outline-hidden ring-1 ring-foreground/5 duration-100 data-entering:animate-in data-exiting:animate-out dark:ring-foreground/10",
				className,
			)}
			{...props}
		/>
	);
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot='popover-header' className={cn("flex flex-col gap-1 text-sm", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: React.ComponentProps<typeof Heading>) {
	return <Heading data-slot='popover-title' className={cn("font-medium text-base", className)} {...props} />;
}

function PopoverDescription({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot='popover-description' className={cn("text-muted-foreground", className)} {...props} />;
}

export { Popover, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
