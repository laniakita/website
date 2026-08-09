import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { MAIN_PAGES } from "$/src/components/nav-constants";
import { HeaderNav } from "./nav";

const rootRoute = createRootRoute({
	component: () => <HeaderNav navItems={MAIN_PAGES} />,
});
const router = createRouter({
	routeTree: rootRoute,
	history: createMemoryHistory(),
});

const NavWithRouter = () => <RouterProvider router={router} />;

const meta = {
	title: "Navigation/Header/Nav",
	component: NavWithRouter,
	tags: ["autodocs"],
} satisfies Meta<typeof NavWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const links = await canvas.findAllByRole("link");
		await expect(links.length).toBeGreaterThan(0);
		const firstLink = links[0];
		if (firstLink && MAIN_PAGES[0]) {
			await expect(firstLink).toHaveTextContent(MAIN_PAGES[0].label);
		}
	},
};
