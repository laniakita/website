import type { Meta, StoryObj } from "@storybook/react";
import { Ongoing as OngoingStory, Default as WorkPreviewStory } from "./work-preview.stories";
import { WorkRoller } from "./work-roller";

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
		works: [WorkPreviewStory.args!, OngoingStory.args!],
	},
	decorators: [
		(Story) => (
			<div className='w-full max-w-3xl p-4'>
				<Story key={Math.random().toString()} />
			</div>
		),
	],
};
