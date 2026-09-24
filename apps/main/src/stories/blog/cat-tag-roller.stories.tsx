import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { CatTagRoller } from "./cat-tag-roller";

const meta = {
	title: "Blog/CatTagRoller",
	component: CatTagRoller,
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const rootRoute = createRootRoute({ component: Story });
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return <RouterProvider router={router} />;
		},
	],
} satisfies Meta<typeof CatTagRoller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		cats: [{ title: "Linux", url: "/category/linux", type: "category" }],
		tags: [
			{ title: "bash", url: "/tag/bash", type: "tag" },
			{ title: "tutorial", url: "/tag/tutorial", type: "tag" },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check for Category
		const linuxCategory = canvas.getByRole("link", { name: "Linux" });
		expect(linuxCategory).toBeInTheDocument();
		expect(linuxCategory).toHaveAttribute("href", "/category/linux");

		// Check for Tags
		const bashTag = canvas.getByRole("link", { name: "#bash" });
		expect(bashTag).toBeInTheDocument();
		expect(bashTag).toHaveAttribute("href", "/tag/bash");
	},
};
