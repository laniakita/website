import type { HTMLAttributes } from "react";
import { cn } from "$/src/lib/utils/cn";
import { WorkPreview, type WorkPreviewProps } from "./work-preview";

export interface WorkRollerProps extends HTMLAttributes<HTMLDivElement> {
	/** An array of work item data to render in the list. */
	works: WorkPreviewProps[];
}

/**
 * Renders an editorial exhibition vertical list of work previews.
 */
export function WorkRoller({ works, className, ...props }: WorkRollerProps) {
	return (
		<div className={cn("flex w-full flex-col gap-10", className)} data-testid='work-roller' {...props}>
			{works.map((work, index) => (
				<WorkPreview key={`work-${work.id}`} {...work} index={index} />
			))}
		</div>
	);
}
