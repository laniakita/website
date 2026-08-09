import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkPreviewSkeleton } from "./work-preview-skeleton";

const meta = {
	title: "Skeletons/WorkPreview",
	component: WorkPreviewSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof WorkPreviewSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Even: Story = {
	args: {
		isEven: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-preview-skeleton")).toBeInTheDocument();
	},
};

export const Odd: Story = {
	args: {
		isEven: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-preview-skeleton")).toBeInTheDocument();
	},
};
