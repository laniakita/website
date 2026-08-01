import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { Header } from "@/components/navigation/header";
import {
	defaultNavItems,
	defaultSocialItems,
} from "@/components/navigation/header/data";
import { ThemeStoreProvider } from "@/features/providers/theme-store-provider";

// TanStack Router requires a router context for Links to work in Storybook
const rootRoute = createRootRoute({
	component: () => (
		<ThemeStoreProvider>
			<Header navItems={defaultNavItems} socialItems={defaultSocialItems} />
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
		(Story) => {
			// Modify router context for post layout if needed
			const rootRoute = createRootRoute({
				component: () => (
					<ThemeStoreProvider>
						<Header
							navItems={defaultNavItems}
							socialItems={defaultSocialItems}
							isPost={true}
							tocInView={false}
						/>
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
		(Story) => {
			const rootRoute = createRootRoute({
				component: () => (
					<ThemeStoreProvider>
						<Header
							navItems={defaultNavItems}
							socialItems={defaultSocialItems}
							warnDev={true}
						/>
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
