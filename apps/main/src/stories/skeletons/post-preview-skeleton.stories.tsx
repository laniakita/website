import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { PostPreviewSkeleton } from "./post-preview-skeleton";

const meta = {
	title: "Skeletons/PostPreview",
	component: PostPreviewSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof PostPreviewSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("post-preview-skeleton")).toBeInTheDocument();
	},
};
