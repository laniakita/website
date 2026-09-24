import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { PostRollerSkeleton } from "./post-roller-skeleton";

const meta = {
	title: "Skeletons/PostRoller",
	component: PostRollerSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof PostRollerSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("post-roller-skeleton")).toBeInTheDocument();
		expect(canvas.getAllByTestId("post-preview-skeleton")).toHaveLength(3);
	},
};
