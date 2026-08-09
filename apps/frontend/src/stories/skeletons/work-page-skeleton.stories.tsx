import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkPageSkeleton } from "./work-page-skeleton";

const meta = {
	title: "Skeletons/WorkPage",
	component: WorkPageSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof WorkPageSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		count: 3,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-page-skeleton")).toBeInTheDocument();
	},
};
