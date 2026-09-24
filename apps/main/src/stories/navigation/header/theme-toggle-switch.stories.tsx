import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, userEvent, within } from "storybook/test";
import { ThemeToggleSwitch } from "@/components/navigation/header/theme-toggle-switch";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";

// A wrapper to inject state if needed, though ThemeToggleSwitch reads from ThemeStoreProvider
const ThemeSwitchWrapper = () => (
	<ThemeStoreProvider>
		<div className='flex flex-col items-center gap-4 rounded-lg border bg-background p-8 text-foreground'>
			<p className='text-muted-foreground text-sm'>The switch syncs with local storage and root document classes.</p>
			<ThemeToggleSwitch />
		</div>
	</ThemeStoreProvider>
);

const meta = {
	title: "Navigation/Header/ThemeToggleSwitch",
	component: ThemeSwitchWrapper,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ThemeSwitchWrapper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CycleInteraction: Story = {
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		// Find the button (it has aria-label starting with Current theme)
		const button = canvas.getByRole("button");

		await step("Verify switch is rendered", async () => {
			await expect(button).toBeInTheDocument();
		});

		await step("Cycle theme once", async () => {
			await userEvent.click(button);
			// Wait for re-render if necessary, checking if class or aria-label changed
		});

		await step("Cycle theme twice", async () => {
			await userEvent.click(button);
		});
	},
};
