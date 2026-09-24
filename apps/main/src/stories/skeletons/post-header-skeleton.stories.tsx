import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { PostHeaderSkeleton } from "./post-header-skeleton";

const meta = {
	title: "Skeletons/PostHeader",
	component: PostHeaderSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof PostHeaderSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("post-header-skeleton")).toBeInTheDocument();
	},
};
