import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { Comments } from "./comments";
import { CommentsSkeleton } from "@/stories/skeletons/comments-skeleton";

const meta = {
	title: "Blog/PostPage/Comments",
	component: Comments,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<ThemeStoreProvider>
				<Story />
			</ThemeStoreProvider>
		),
	],
} satisfies Meta<typeof Comments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const container = canvas.getByTestId("comments-container");
		expect(container).toBeInTheDocument();
	},
};

export const Skeleton: StoryObj<typeof CommentsSkeleton> = {
	render: () => <CommentsSkeleton />,
};
