import type { ReactNode } from "react";
import { WorkPageHeader } from "./work-page-header";
import type { WorkPreviewProps } from "./work-preview";
import { WorkRoller } from "./work-roller";

export interface WorkPageProps {
	/** Title of the page */
	title: string;
	/** Total count of works for telemetry row */
	totalWorks: number;
	/** Description / MDX component to render in the header */
	description: ReactNode;
	/** Array of work items to display in the roller */
	works: WorkPreviewProps[];
}

export function WorkPage({ title, totalWorks, description, works }: WorkPageProps) {
	return (
		<main className='m-auto w-full max-w-7xl' data-testid='work-page'>
			<div className='@container/page flex w-full flex-col items-center justify-center'>
				<WorkPageHeader title={title} totalWorks={totalWorks} description={description} />
				<WorkRoller works={works} className='@4xl/page:px-10 px-2' />
			</div>
		</main>
	);
}
