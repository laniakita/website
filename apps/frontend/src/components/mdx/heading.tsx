"use client";

import { CopyCheckIcon, LinkIcon } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCopyButton } from "@/lib/utils/use-copy-button";
import { cn } from "$/src/lib/utils/cn";

type Types = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps<T extends Types> = Omit<ComponentPropsWithoutRef<T>, "as"> & {
	as?: T;
};

export function Heading<T extends Types = "h1">({ as, ...props }: HeadingProps<T>) {
	const As = as ?? "h1";

	const [isChecked, onCopy] = useCopyButton(() => {
		if (!props.id) return;
		const url = new URL(window.location.href);
		url.hash = props.id;
		return navigator.clipboard.writeText(url.href);
	});

	if (!props.id) return <As {...props} />;

	return (
		<As {...props} className={cn("group/heading flex scroll-m-28 flex-row items-center gap-2", props.className)}>
			<a href={`#${props.id}`} className='text-foreground no-underline'>
				{props.children}
			</a>

			<Button
				onClick={onCopy}
				aria-label='Copy Link'
				className={cn(
					buttonVariants({
						variant: "ghost",
						size: "icon-xs",
					}),
					"not-prose shrink-0 bg-transparent text-foreground opacity-0 transition-opacity hover:bg-primary hover:text-primary-foreground group-hover/heading:opacity-50 dark:hover:bg-primary",
				)}
			>
				{isChecked ? <CopyCheckIcon className='size-4' /> : <LinkIcon className='size-4' />}
			</Button>
		</As>
	);
}
