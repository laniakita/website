import type * as React from "react";
import { cn } from "$/src/lib/utils/cn";

export interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
	isSticky?: boolean;
}

export function HeaderRoot({ className, isSticky = true, children, ...props }: HeaderRootProps) {
	return (
		<header className={cn("z-50 w-full", isSticky && "sticky top-0", className)} {...props}>
			<div className='nav-glassy-bg' />
			<div className='nav-glassy-edge' />
			{children}
		</header>
	);
}

export function HeaderContainer({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"container relative z-10 mx-auto flex h-16 items-center justify-between overflow-y-hidden px-4 sm:px-6",
				className,
			)}
		>
			{children}
		</div>
	);
}
