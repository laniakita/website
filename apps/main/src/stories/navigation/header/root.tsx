import type * as React from "react";
import { cn } from "$/src/lib/utils/cn";

export interface HeaderRootProps extends React.HTMLAttributes<HTMLElement> {
	isSticky?: boolean;
}

export function HeaderRoot({ className, isSticky = true, children, ...props }: HeaderRootProps) {
	return (
		<header className={cn("@container/navbar z-50 w-full", isSticky && "sticky top-0", className)} {...props}>
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
				"relative z-10 mx-auto flex h-16 items-center justify-between overflow-y-hidden @md/navbar:px-6 px-4",
				className,
			)}
		>
			{children}
		</div>
	);
}
