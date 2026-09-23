import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { CommentsSkeleton } from "./comments-skeleton";

const meta = {
	title: "Skeletons/Comments",
	component: CommentsSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof CommentsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("comments-skeleton")).toBeInTheDocument();
	},
};
