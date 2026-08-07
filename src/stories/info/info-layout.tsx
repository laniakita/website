import type { ReactNode } from "react";

export function InfoLayout({ children }: { children: ReactNode }) {
	return (
		<main className='pt-10'>
			<article id='content' className='flex size-full flex-col items-center justify-center'>
				<div className='padding-post flex min-h-full items-center justify-center'>
					<div className='prose-protocol-omega max-w-3xl px-0'>{children}</div>
				</div>
			</article>
		</main>
	);
}
