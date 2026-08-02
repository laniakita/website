import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { HeaderBanner } from "./banner";

const meta = {
	title: "Navigation/Header/Banner",
	component: HeaderBanner,
	tags: ["autodocs"],
	args: {
		warnDev: true,
		productionUrl: "https://example.com",
		warnDevBannerDescription: "[WARN]: Development environment.",
		warnDevBannerReturnText: "Back to safety",
	},
} satisfies Meta<typeof HeaderBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(
			canvas.getByText(/development environment/i),
		).toBeInTheDocument();
		await expect(
			canvas.getByRole("link", { name: /back to safety/i }),
		).toBeInTheDocument();
	},
};

export const Hidden: Story = {
	args: {
		warnDev: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(
			canvas.queryByText(/development environment/i),
		).not.toBeInTheDocument();
	},
};
