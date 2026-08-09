import type * as React from "react";

export interface CoreRollerProps {
	/** The rendered preview items to display */
	children: React.ReactNode;
	/** Optional data-testid for testing */
	"data-testid"?: string;
}

/**
 * A standardized container for rendering lists of previews (e.g. blog posts, work items).
 * Enforces consistent column-based flex layouts.
 */
export function CoreRoller({ children, "data-testid": testId = "core-roller" }: CoreRollerProps) {
	return (
		<div className='flex size-full w-full flex-col gap-6' data-testid={testId}>
			{children}
		</div>
	);
}
