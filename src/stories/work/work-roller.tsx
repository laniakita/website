import { WorkPreview, type WorkPreviewProps } from "./work-preview";

export interface WorkRollerProps {
	/** An array of work item data to render in the list. */
	works: WorkPreviewProps[];
}

/**
 * Renders an editorial exhibition vertical list of work previews.
 */
export function WorkRoller({ works }: WorkRollerProps) {
	return (
		<div className='flex w-full flex-col gap-32 py-20 md:gap-48' data-testid='work-roller'>
			{works.map((work, index) => (
				<WorkPreview key={`work-${work.id}`} {...work} index={index} />
			))}
		</div>
	);
}
