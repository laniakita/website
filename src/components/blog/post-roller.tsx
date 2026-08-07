import { PostRoller, type PostRollerProps } from "@/stories/blog/post-roller";
import { SidebarSubscribe } from "../sidebar/subscribe";

/**
 * Renders a list of blog posts in a grid format, with an optional injected
 * component at a specific index.
 *
 * @param posts - An array of blog posts to display.
 * @param injectedComponent - An optional React component to inject into the grid.
 * @param injectAtIndex - The index at which to inject the component (0-based).
 */
export function BlogPostRoller({
	posts,
	injectedComponent = <SidebarSubscribe className='block lg:hidden' />,
	injectAtIndex = 1,
}: PostRollerProps) {
	return <PostRoller posts={posts} injectedComponent={injectedComponent} injectAtIndex={injectAtIndex} />;
}
