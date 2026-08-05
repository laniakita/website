import type * as React from "react";
import { cn } from "@/lib/utils";

export interface FooterRootProps extends React.HTMLAttributes<HTMLElement> {
	/** Optional extra wrapper class */
	wrapperClassName?: string;
}

export function FooterRoot({
	className,
	wrapperClassName,
	children,
	...props
}: FooterRootProps) {
	return (
		<footer className={cn("relative w-full @container", className)} {...props}>
			<div
				className={cn(
					"relative flex w-full flex-col items-center justify-center overflow-hidden",
					wrapperClassName,
				)}
			>
				{children}
			</div>
		</footer>
	);
}

export function FooterBackdrop({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn("flex size-full flex-col backdrop-blur-2xl", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function FooterContainer({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-4 @xl:px-6 @xl:pb-8",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function FooterContent({
	className,
	children,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={cn(
				"relative w-full space-y-8 p-6 @xl:p-10 @xl:max-w-3xl", //md:rounded-md md:border md:border-border",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
}
