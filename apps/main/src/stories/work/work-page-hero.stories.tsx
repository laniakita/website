import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { WorkPageHero } from "./work-page-hero";

const meta = {
	title: "Work/WorkPageHero",
	component: WorkPageHero,
	parameters: {
		layout: "centered",
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
} satisfies Meta<typeof WorkPageHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: "Work",
		description: (
			<p>
				A curated archive of key projects, architectural experiments, and open-source contributions crafted over the
				years.
			</p>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("LOG IDENTIFIER")).toBeInTheDocument();
		await expect(canvas.getByText("Work")).toBeInTheDocument();
		await expect(canvas.getByText("> INITIALIZING REMARKS")).toBeInTheDocument();
		await expect(
			canvas.getByText(
				"A curated archive of key projects, architectural experiments, and open-source contributions crafted over the years.",
			),
		).toBeInTheDocument();
	},
	decorators: [
		(Story) => (
			<div className='w-full max-w-5xl p-4'>
				<Story />
			</div>
		),
	],
};
