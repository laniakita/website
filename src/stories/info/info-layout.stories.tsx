import type { Meta, StoryObj } from "@storybook/react";
import { InfoLayout } from "@/stories/info/info-layout";

const meta = {
	title: "Info/InfoLayout",
	component: InfoLayout,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof InfoLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<div>
				<h1>About Me</h1>
				<p>
					Welcome to my website. I am a software engineer passionate about building robust and scalable web
					applications.
				</p>
				<h2>My Journey</h2>
				<p>It all started when I wrote my first line of code...</p>
				<ul>
					<li>First point</li>
					<li>Second point</li>
					<li>Third point</li>
				</ul>
			</div>
		),
	},
};

import { InfoLayoutSkeleton } from "@/stories/skeletons/info-layout-skeleton";

export const Skeleton: StoryObj<typeof InfoLayoutSkeleton> = {
	render: () => <InfoLayoutSkeleton />,
};
