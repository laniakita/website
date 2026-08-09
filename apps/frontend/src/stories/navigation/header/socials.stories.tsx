import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import { SOCIALS_NAVBAR } from "$/src/components/nav-constants";
import { HeaderSocials } from "./socials";

const meta = {
	title: "Navigation/Header/Socials",
	component: HeaderSocials,
	tags: ["autodocs"],
	args: {
		socialItems: SOCIALS_NAVBAR,
	},
} satisfies Meta<typeof HeaderSocials>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const links = canvas.getAllByRole("link");
		await expect(links.length).toBe(SOCIALS_NAVBAR.length);
	},
};

export const Empty: Story = {
	args: {
		socialItems: [],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.queryAllByRole("link").length).toBe(0);
	},
};
