import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import * as React from "react";
import { expect, within } from "storybook/test";
import LogoDarkmode from "@/assets/laniakita-logo-transparent-darkmode.svg?react";
import LogoLightmode from "@/assets/laniakita-logo-transparent-lightmode.svg?react";
import { HeaderLogo } from "./logo";

// We must allow args to be passed in, so we wrap it inside a component that takes args
const LogoWithRouter = (args: React.ComponentProps<typeof HeaderLogo>) => {
	const router = React.useMemo(() => {
		const rootRoute = createRootRoute({
			component: () => <HeaderLogo {...args} />,
		});
		return createRouter({
			routeTree: rootRoute,
			history: createMemoryHistory(),
		});
	}, [args]);

	return <RouterProvider router={router} />;
};

const meta = {
	title: "Navigation/Header/Logo",
	component: LogoWithRouter,
	tags: ["autodocs"],
	args: {},
} satisfies Meta<typeof LogoWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = await canvas.findByRole("link");
		await expect(link).toBeInTheDocument();

		// Default logo now has images
		const lightImg = canvasElement.querySelector('svg[title="Logo Light"]');
		const darkImg = canvasElement.querySelector('svg[title="Logo Dark"]');
		await expect(lightImg).toBeInTheDocument();
		await expect(darkImg).toBeInTheDocument();
	},
};

export const WithImages: Story = {
	args: {
		logoLight: <LogoLightmode title='Logo Light' />,
		logoDark: <LogoDarkmode title='Logo Dark' />,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = await canvas.findByRole("link");
		await expect(link).toBeInTheDocument();

		// We can check if images are rendered
		const lightImg = canvasElement.querySelector('svg[title="Logo Light"]');
		const darkImg = canvasElement.querySelector('svg[title="Logo Dark"]');
		await expect(lightImg).toBeInTheDocument();
		await expect(darkImg).toBeInTheDocument();
	},
};

export const FallbackBranding: Story = {
	args: {
		logoLight: null,
		logoDark: null,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = await canvas.findByRole("link");
		await expect(link).toBeInTheDocument();
		await expect(link).toHaveTextContent(/Lani Akita/i);
	},
};
