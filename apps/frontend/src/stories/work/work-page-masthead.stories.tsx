import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { WorkPageMasthead } from "./work-page-masthead";

const meta = {
	title: "Work/WorkPageMasthead",
	component: WorkPageMasthead,
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
} satisfies Meta<typeof WorkPageMasthead>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		totalWorks: 12,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("MISSION //")).toBeInTheDocument();
		await expect(canvas.getByText("THRIVE")).toBeInTheDocument();
		await expect(canvas.getByText("EXPEDITION:")).toBeInTheDocument();
		await expect(canvas.getByText("012")).toBeInTheDocument();
		await expect(canvas.getByText("NOMINAL")).toBeInTheDocument();
	},
	decorators: [
		(Story) => (
			<div className='w-full max-w-5xl p-4'>
				<Story />
			</div>
		),
	],
};

export const SingleWork: Story = {
	args: {
		totalWorks: 1,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByText("001")).toBeInTheDocument();
	},
	decorators: Default.decorators,
};
