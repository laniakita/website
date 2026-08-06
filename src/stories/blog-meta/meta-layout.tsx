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

export function MetaLayout({
	title,
	isTag,
	RenderablePosts,
	children,
}: MetaLayoutProps) {
	return (
		<div className="pt-10 relative z-5 -mb-1 flex flex-col gap-4 common-padding md:gap-6">
			<div className="flex items-center justify-center">
				<div className="flex w-full max-w-3xl flex-col gap-4 rounded-md border border-ctp-surface0 bg-ctp-base p-8 motion-safe:simple-color-trans dark:border-ctp-base dark:bg-ctp-midnight">
					<div className="">
						<h1 className="text-3xl font-black md:text-4xl">{`${
							isTag ? "#" : ""
						}${title}`}</h1>
					</div>
					<div className="h-px w-full rounded bg-ctp-surface0 dark:bg-ctp-base" />
					<div className="prose-protocol-omega w-full max-w-sm prose-p:my-0">
						{children}
					</div>
				</div>
			</div>
			<div className="max-w-3xl m-auto">{RenderablePosts}</div>
		</div>
	);
}
