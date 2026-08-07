import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, userEvent, within } from "storybook/test";
import { defaultNavItems, defaultSocialItems } from "@/components/navigation/header/data";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { HeaderMobileMenu } from "./mobile-menu";

const rootRoute = createRootRoute({
	component: () => (
		<ThemeStoreProvider>
			<HeaderMobileMenu navItems={defaultNavItems} socialItems={defaultSocialItems} />
		</ThemeStoreProvider>
	),
});
const router = createRouter({
	routeTree: rootRoute,
	history: createMemoryHistory(),
});

const MobileMenuWithRouter = () => <RouterProvider router={router} />;

const meta = {
	title: "Navigation/Header/MobileMenu",
	component: MobileMenuWithRouter,
	tags: ["autodocs"],
} satisfies Meta<typeof MobileMenuWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		// Use findByRole because RouterProvider might render asynchronously
		const button = await canvas.findByRole("button", { name: /open menu/i });
		await expect(button).toBeInTheDocument();

		// Test the interaction
		await userEvent.click(button);
		// Menu content appears in a portal, so we query the document body
		const dialog = await within(document.body).findByRole("dialog", {
			name: /navigation menu/i,
		});
		await expect(dialog).toBeInTheDocument();

		const links = within(dialog).getAllByRole("link");
		await expect(links.length).toBeGreaterThan(0);
	},
};
