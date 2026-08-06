import * as React from "react";
import { PostPreviewSkeleton } from "./post-preview-skeleton";

export interface PostRollerSkeletonProps {
	/** Number of skeletons to render. Defaults to 3. */
	count?: number;
}

export function PostRollerSkeleton({ count = 3 }: PostRollerSkeletonProps) {
	return (
		<div
			className="flex items-center justify-center w-full"
			data-testid="post-roller-skeleton"
		>
			<div className="flex w-full max-w-3xl flex-col gap-4 md:gap-8">
				{Array.from({ length: count }).map((_, i) => (
					<React.Fragment
						key={`skeleton-${
							// biome-ignore lint/suspicious/noArrayIndexKey: it's a simple random number generated for keys
							i * 3.14 * Math.random()
						}`}
					>
						<PostPreviewSkeleton />
					</React.Fragment>
				))}
			</div>
		</div>
	);
}
