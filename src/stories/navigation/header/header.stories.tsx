import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { Header } from "@/components/navigation/header";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { MAIN_PAGES, SOCIALS_NAVBAR } from "$/src/components/nav-constants";

// TanStack Router requires a router context for Links to work in Storybook
const rootRoute = createRootRoute({
	component: () => (
		<ThemeStoreProvider>
			<Header navItems={MAIN_PAGES} socialItems={SOCIALS_NAVBAR} />
		</ThemeStoreProvider>
	),
});

const router = createRouter({
	routeTree: rootRoute,
	history: createMemoryHistory(),
});

const HeaderWithRouter = () => <RouterProvider router={router} />;

const meta = {
	title: "Navigation/Header/Header",
	component: HeaderWithRouter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof HeaderWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PostLayout: Story = {
	decorators: [
		(_Story) => {
			// Modify router context for post layout if needed
			const rootRoute = createRootRoute({
				component: () => (
					<ThemeStoreProvider>
						<Header navItems={MAIN_PAGES} socialItems={SOCIALS_NAVBAR} isPost={true} tocInView={false} />
					</ThemeStoreProvider>
				),
			});
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return <RouterProvider router={router} />;
		},
	],
};

export const WithDevWarning: Story = {
	decorators: [
		(_Story) => {
			const rootRoute = createRootRoute({
				component: () => (
					<ThemeStoreProvider>
						<Header navItems={MAIN_PAGES} socialItems={SOCIALS_NAVBAR} warnDev={true} />
					</ThemeStoreProvider>
				),
			});
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return <RouterProvider router={router} />;
		},
	],
};
