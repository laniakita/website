import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkPageMastheadSkeleton } from "./work-page-masthead-skeleton";

const meta = {
	title: "Skeletons/WorkPageMasthead",
	component: WorkPageMastheadSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof WorkPageMastheadSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-page-masthead-skeleton")).toBeInTheDocument();
	},
};
