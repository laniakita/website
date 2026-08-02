import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "@/components/ui/button";

const meta = {
	title: "Navigation/Header/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"destructive",
				"outline",
				"secondary",
				"ghost",
				"link",
			],
		},
		size: {
			control: "select",
			options: [
				"default",
				"sm",
				"lg",
				"icon",
				"xs",
				"icon-xs",
				"icon-sm",
				"icon-lg",
			],
		},
		isDisabled: {
			control: "boolean",
		},
	},
	args: {
		children: "Button",
		variant: "default",
		size: "default",
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
	args: {
		variant: "outline",
		children: "Outline Button",
	},
};

export const Ghost: Story = {
	args: {
		variant: "ghost",
		children: "Ghost Button",
	},
};

export const IconButton: Story = {
	args: {
		variant: "outline",
		size: "icon",
		children: <span className="icon-[ph--star-fill] size-4" />,
		"aria-label": "Star",
	},
};

// Interaction test
export const ClickInteraction: Story = {
	args: {
		children: "Click Me",
		onPress: () => console.log("Clicked!"),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole("button", { name: /click me/i });

		await step("Verify button is rendered and enabled", async () => {
			await expect(button).toBeInTheDocument();
			await expect(button).not.toBeDisabled();
		});

		await step("Click the button", async () => {
			await userEvent.click(button);
			await expect(button).toHaveFocus();
		});
	},
};
