import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { WorkPageHeroSkeleton } from "./work-page-hero-skeleton";

const meta = {
	title: "Skeletons/WorkPageHero",
	component: WorkPageHeroSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof WorkPageHeroSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("work-page-hero-skeleton")).toBeInTheDocument();
	},
};
