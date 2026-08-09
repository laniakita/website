import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkRollerSkeleton } from "./work-roller-skeleton";

const meta = {
	title: "Skeletons/WorkRoller",
	component: WorkRollerSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof WorkRollerSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		count: 3,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-roller-skeleton")).toBeInTheDocument();
	},
};
