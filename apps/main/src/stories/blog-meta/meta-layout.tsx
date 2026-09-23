import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
		<div className='common-padding relative z-5 -mb-1 flex flex-col gap-4 px-2 pt-4 md:gap-6 md:px-4 md:pt-10'>
			<div className='flex items-center justify-center'>
				<Card className='flex w-full max-w-3xl flex-col gap-4 rounded-md border border-primary/30 bg-transparent p-8 shadow-none'>
					<div>
						<span className='font-mono text-2xs text-primary uppercase tracking-widest'>
							{isTag ? "> Tags" : "> Categories"}
						</span>
						<h1 className='font-black text-4xl uppercase md:text-5xl'>{`${isTag ? "#" : ""}${title}`}</h1>
					</div>

					<Separator className='bg-primary/30' />
					<div className='prose-protocol-omega prose-p:my-0 w-full max-w-sm'>{children}</div>
				</Card>
			</div>
			<div className='m-auto max-w-3xl'>{RenderablePosts}</div>
		</div>
	);
}
