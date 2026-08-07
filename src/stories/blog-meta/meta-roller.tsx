import * as React from "react";
import { CoreRoller } from "@/stories/core/core-roller";
import { PostPreview } from "../blog/post-preview";
import type { PostRollerProps } from "../blog/post-roller";

export interface PostMetaRollerProps extends Omit<PostRollerProps, "injectAtIndex" | "injectedComponent"> {}

/**
 * Renders a vertical list of post previews.
 * Allows injecting a custom component at a specific index within the list.
 */
export function MetaPostRoller({ posts }: PostMetaRollerProps) {
	return (
		<CoreRoller data-testid='post-roller'>
			{posts.map((post) => {
				return (
					<React.Fragment key={`post-${post.url}`}>
						<PostPreview {...post} />
					</React.Fragment>
				);
			})}
		</CoreRoller>
	);
}
