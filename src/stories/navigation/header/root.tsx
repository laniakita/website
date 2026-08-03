import type * as React from "react";
import { cn } from "@/lib/utils";

export interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
	isSticky?: boolean;
}

export function HeaderRoot({
	className,
	isSticky = true,
	children,
	...props
}: HeaderRootProps) {
	return (
		<header
			className={cn(
				"z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60",
				isSticky && "sticky top-0",
				className,
			)}
			{...props}
		>
			{children}
		</header>
	);
}

export function HeaderContainer({
	children,
	className,
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"container mx-auto px-4 sm:px-6 h-16 flex items-center justify-between",
				className,
			)}
		>
			{children}
		</div>
	);
}
