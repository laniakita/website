import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { PostDate } from "./post-date";

const meta = {
	title: "Blog/PostPage/PostDate",
	component: PostDate,
	tags: ["autodocs"],
} satisfies Meta<typeof PostDate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		date: "2026-08-01",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const timeElement = canvas.getByText(/(Aug 1st|Jul 31st), 2026/);
		expect(timeElement).toBeInTheDocument();
		expect(timeElement.tagName.toLowerCase()).toBe("time");
	},
};

export const TagMode: Story = {
	args: {
		date: "2026-08-01",
		tag: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const spanElement = canvas.getByText(/(Aug 1st|Jul 31st), 2026/);
		expect(spanElement).toBeInTheDocument();
		expect(spanElement.tagName.toLowerCase()).toBe("span");
	},
};
