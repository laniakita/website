import type { Meta, StoryObj } from "@storybook/tanstack-react";
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
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
	decorators: [
		(Story) => (
			<div className='@container/navbar w-full'>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof NavWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
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

export const OnMobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: "iphone14",
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const nav = canvas.getByRole("navigation", { hidden: true });
		await expect(nav).toHaveClass("hidden");
	},
};
