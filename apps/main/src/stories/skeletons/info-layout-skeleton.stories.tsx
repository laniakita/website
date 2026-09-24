import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { InfoLayoutSkeleton } from "./info-layout-skeleton";

const meta = {
	title: "Skeletons/InfoLayout",
	component: InfoLayoutSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof InfoLayoutSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("info-layout-skeleton")).toBeInTheDocument();
	},
};
