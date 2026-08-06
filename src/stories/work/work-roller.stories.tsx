import type { Meta, StoryObj } from "@storybook/react";
import { WorkRoller } from "./work-roller";
import { Default as WorkPreviewStory, Ongoing as OngoingStory } from "./work-preview.stories";

const meta = {
	title: "Work/WorkRoller",
	component: WorkRoller,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof WorkRoller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		works: [
			WorkPreviewStory.args!,
			OngoingStory.args!,
		],
	},
	decorators: [
		(Story) => (
			<div className="w-full max-w-3xl p-4">
				<Story />
			</div>
		),
	],
};
