import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkPage } from "./work-page";
import { Default as HeroStory } from "./work-page-hero.stories";
import { Ongoing as OngoingWorkStory, Default as WorkPreviewStory } from "./work-preview.stories";

const meta = {
	title: "Work/WorkPage",
	component: WorkPage,
	parameters: {
		layout: "fullscreen",
		a11y: {
			config: {
				rules: [
					{
						id: "color-contrast",
						enabled: false,
					},
				],
			},
		},
	},
} satisfies Meta<typeof WorkPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: HeroStory.args?.title,
		totalWorks: 2,
		description: HeroStory.args?.description,
		works: [WorkPreviewStory.args, OngoingWorkStory.args],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId("work-page")).toBeInTheDocument();
		await expect(canvas.getByTestId("work-page-header")).toBeInTheDocument();
		await expect(canvas.getByTestId("work-page-masthead")).toBeInTheDocument();
		await expect(canvas.getByTestId("work-page-hero")).toBeInTheDocument();
		await expect(canvas.getByTestId("work-roller")).toBeInTheDocument();
		await expect(canvas.getByText("Acme Corp Rebrand")).toBeInTheDocument();
		await expect(canvas.getByText("Open Source Initiative")).toBeInTheDocument();
	},
};
