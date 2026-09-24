import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { WorkPageHeaderSkeleton } from "./work-page-header-skeleton";

const meta = {
	title: "Skeletons/WorkPageHeader",
	component: WorkPageHeaderSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof WorkPageHeaderSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-page-header-skeleton")).toBeInTheDocument();
	},
};
