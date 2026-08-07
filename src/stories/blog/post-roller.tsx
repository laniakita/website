import * as React from "react";
import { CoreRoller } from "@/stories/core/core-roller";
import { PostPreview, type PostPreviewProps } from "./post-preview";

export interface PostRollerProps {
	/** An array of post preview data to render in the list. */
	posts: PostPreviewProps[];
	/** An optional component to inject into the list (e.g., a newsletter sign-up or ad). */
	injectedComponent?: React.ReactNode;
	/** The index at which to inject the custom component. Defaults to 1 (after the first post). */
	injectAtIndex?: number;
}

/**
 * Renders a vertical list of post previews.
 * Allows injecting a custom component at a specific index within the list.
 */
export function PostRoller({ posts, injectedComponent, injectAtIndex = 1 }: PostRollerProps) {
	return (
		<CoreRoller data-testid='post-roller'>
			{posts.map((post, idx) => {
				const isInjectIndex = injectedComponent && idx === injectAtIndex;

				return (
					<React.Fragment key={`post-${post.url}`}>
						{isInjectIndex && <div className='w-full'>{injectedComponent}</div>}
						<PostPreview {...post} />
					</React.Fragment>
				);
			})}
		</CoreRoller>
	);
}
