import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import * as React from "react";
import { expect, within } from "storybook/test";
import logoDarkmode from "@/assets/laniakita-logo-darkmode.png";
import logoLightmode from "@/assets/laniakita-logo-lightmode.png";
import { HeaderLogo } from "./logo";

// We must allow args to be passed in, so we wrap it inside a component that takes args
const LogoWithRouter = (args: any) => {
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
		const lightImg = await canvas.findByAltText(/Logo Light/i);
		const darkImg = await canvas.findByAltText(/Logo Dark/i);
		await expect(lightImg).toBeInTheDocument();
		await expect(darkImg).toBeInTheDocument();
	},
};

export const WithImages: Story = {
	args: {
		logoLight: <img src={logoLightmode} alt="Logo Light" />,
		logoDark: <img src={logoDarkmode} alt="Logo Dark" />,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const link = await canvas.findByRole("link");
		await expect(link).toBeInTheDocument();

		// We can check if images are rendered
		const lightImg = await canvas.findByAltText(/Logo Light/i);
		const darkImg = await canvas.findByAltText(/Logo Dark/i);
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
