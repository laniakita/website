import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { HeaderTocToggle } from "./toc-toggle";

const meta = {
	title: "Navigation/Header/TocToggle",
	component: HeaderTocToggle,
	tags: ["autodocs"],
	args: {
		isPost: true,
		tocInView: false,
		onTocToggle: fn(),
	},
} satisfies Meta<typeof HeaderTocToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button", {
			name: /toggle table of contents/i,
		});
		await expect(button).toBeInTheDocument();
		await userEvent.click(button);
		await expect(args.onTocToggle).toHaveBeenCalled();
	},
};

export const Hidden: Story = {
	args: {
		isPost: false,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.queryByRole("button", { name: /toggle table of contents/i })).not.toBeInTheDocument();
	},
};
