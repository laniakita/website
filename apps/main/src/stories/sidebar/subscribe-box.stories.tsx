import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { SubscribeBox } from "./subscribe-box";

const meta = {
	title: "Sidebar/SubscribeBox",
	component: SubscribeBox,
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const rootRoute = createRootRoute({ component: Story });
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return (
				<div className='mx-auto max-w-sm'>
					<RouterProvider router={router} />
				</div>
			);
		},
	],
} satisfies Meta<typeof SubscribeBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
	args: {},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const heading = canvas.getByRole("heading", {
			name: /Articles delivered right to your feed reader/i,
		});
		expect(heading).toBeInTheDocument();

		const subscribeLink = canvas.getByRole("link");
		expect(subscribeLink).toHaveAttribute("href", "/atom.xml");
	},
};

export const OnMobile: Story = {
	parameters: {
		viewport: {
			defaultViewport: "iphone14",
		},
	},
	args: Default.args,
	play: Default.play,
};
