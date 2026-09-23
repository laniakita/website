import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { MetaLayoutSkeleton } from "./meta-layout-skeleton";

const meta = {
	title: "Skeletons/MetaLayout",
	component: MetaLayoutSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof MetaLayoutSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("meta-layout-skeleton")).toBeInTheDocument();
		expect(canvas.getByTestId("post-roller-skeleton")).toBeInTheDocument();
	},
};
