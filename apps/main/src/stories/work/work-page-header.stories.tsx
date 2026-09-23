import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkPageHeader } from "./work-page-header";
import { Default as HeroStory } from "./work-page-hero.stories";

const meta = {
	title: "Work/WorkPageHeader",
	component: WorkPageHeader,
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
} satisfies Meta<typeof WorkPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: HeroStory.args?.title ?? "Work",
		totalWorks: 12,
		description: HeroStory.args?.description,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByTestId("work-page-header")).toBeInTheDocument();
		await expect(canvas.getByTestId("work-page-masthead")).toBeInTheDocument();
		await expect(canvas.getByTestId("work-page-hero")).toBeInTheDocument();
	},
	decorators: [
		(Story) => (
			<div className='w-full max-w-5xl p-4'>
				<Story />
			</div>
		),
	],
};
