import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { InfoBox } from "./info-box";

const meta = {
	title: "Sidebar/InfoBox",
	component: InfoBox,
	tags: ["autodocs"],
	args: {
		className: "max-w-sm",
	},
} satisfies Meta<typeof InfoBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		blogInfo: <p>A blog about life, Linux, and web development. Written by Lani Akita.</p>,
		categories: [
			{ title: "Linux", url: "/category/linux" },
			{ title: "Web Development", url: "/category/web-development" },
		],
		tags: [
			{ title: "tutorial", url: "/tag/tutorial" },
			{ title: "react", url: "/tag/react" },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check info tab content is visible by default
		const infoContent = canvas.getByText(/A blog about life/i);
		expect(infoContent).toBeVisible();

		// Switch to meta tab
		const metaTab = canvas.getByRole("tab", { name: /meta/i });
		await userEvent.click(metaTab);

		// Check meta content is visible
		const categoryLink = await canvas.findByRole("link", { name: "Linux" });
		expect(categoryLink).toBeVisible();

		const tagLink = await canvas.findByRole("link", { name: "tutorial" });
		expect(tagLink).toBeVisible();
	},
};
