import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { SidebarSkeleton } from "./sidebar-skeleton";

const meta = {
	title: "Skeletons/Sidebar",
	component: SidebarSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof SidebarSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("sidebar-skeleton")).toBeInTheDocument();
	},
};
