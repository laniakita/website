import type { ReactNode } from "react";
import { WorkPageHero } from "./work-page-hero";
import { WorkPageMasthead } from "./work-page-masthead";

export interface WorkPageHeaderProps {
	/** Title of the page (e.g. "Work") */
	title: string;
	/** Total count of works for telemetry row */
	totalWorks: number;
	/** Renderable description node (e.g. MDX component or JSX) */
	description: ReactNode;
}

export function WorkPageHeader({ title, totalWorks, description }: WorkPageHeaderProps) {
	return (
		<header
			className='@container/header mb-16 flex w-full flex-col @lg/page:gap-16 gap-8 @4xl/page:pt-4 md:mb-24'
			data-testid='work-page-header'
		>
			<div className='@4xl/header:px-8 px-2 pt-4'>
				<WorkPageMasthead totalWorks={totalWorks} />
			</div>
			<WorkPageHero title={title} description={description} />
		</header>
	);
}
