import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { TextBlockSkeleton } from "./text-block-skeleton";

const meta = {
	title: "Skeletons/TextBlock",
	component: TextBlockSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof TextBlockSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		lines: 3,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("text-block-skeleton")).toBeInTheDocument();
	},
};
