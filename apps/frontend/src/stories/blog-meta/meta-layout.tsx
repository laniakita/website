import type { ReactNode } from "react";

export interface MetaLayoutProps {
	/** Title of the category or tag */
	title: string;
	/** Whether this layout is for a tag (adds a # prefix to the title) */
	isTag?: boolean;
	/** The rendered posts component */
	RenderablePosts: ReactNode;
	/** The MDX content of the category/tag */
	children?: ReactNode;
}

export function MetaLayout({ title, isTag, RenderablePosts, children }: MetaLayoutProps) {
	return (
		<div className='common-padding relative z-5 -mb-1 flex flex-col gap-4 pt-10 md:gap-6'>
			<div className='flex items-center justify-center'>
				<div className='motion-safe:simple-color-trans flex w-full max-w-3xl flex-col gap-4 rounded-md border border-ctp-surface0 bg-ctp-base p-8 dark:border-ctp-base dark:bg-ctp-midnight'>
					<div className=''>
						<h1 className='font-black text-3xl md:text-4xl'>{`${isTag ? "#" : ""}${title}`}</h1>
					</div>
					<div className='h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base' />
					<div className='prose-protocol-omega prose-p:my-0 w-full max-w-sm'>{children}</div>
				</div>
			</div>
			<div className='m-auto max-w-3xl'>{RenderablePosts}</div>
		</div>
	);
}
