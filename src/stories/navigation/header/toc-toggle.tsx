import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Props for the HeaderTocToggle component.
 */
export interface HeaderTocToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
	/**
	 * Determines if the current page is a post. If false, the toggle is not rendered.
	 */
	isPost?: boolean;
	/**
	 * Indicates whether the Table of Contents is currently visible in the viewport.
	 * If true, the button shrinks and becomes transparent.
	 */
	tocInView?: boolean;
	/**
	 * Callback fired when the toggle button is pressed.
	 */
	onTocToggle?: () => void;
}

/**
 * A toggle button for the Table of Contents on post pages.
 * Animates its visibility based on whether the TOC is already in view on the page.
 */
export function HeaderTocToggle({ isPost, tocInView, onTocToggle, ...props }: HeaderTocToggleProps) {
	if (!isPost) return null;

	return (
		<Button
			variant='ghost'
			size='icon'
			className={cn(
				"hidden transition-all duration-300 md:flex",
				tocInView ? "w-0 overflow-hidden p-0 opacity-0" : "w-9 opacity-100",
				props.className,
			)}
			onPress={onTocToggle}
			aria-label='Toggle Table of Contents'
			aria-expanded={tocInView}
		>
			<span className='icon-[ph--sidebar-simple-fill] size-6 shrink-0' />
		</Button>
	);
}
