import { CoreRoller } from "@/stories/core/core-roller";
import { WorkPreview, type WorkPreviewProps } from "./work-preview";

export interface WorkRollerProps {
	/** An array of work item data to render in the list. */
	works: WorkPreviewProps[];
}

/**
 * Renders a vertical list of work previews.
 */
export function WorkRoller({ works }: WorkRollerProps) {
	return (
		<CoreRoller data-testid="work-roller">
			{works.map((work) => (
				<WorkPreview key={`work-${work.id}`} {...work} />
			))}
		</CoreRoller>
	);
}
