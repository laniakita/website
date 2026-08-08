import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { PostHeader } from "./post-header";

const meta = {
	title: "Blog/PostPage/PostHeader",
	component: PostHeader,
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
} satisfies Meta<typeof PostHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		url: "/blog/hello-world",
		headline: "Building Modern Web Applications",
		subheadline: "A comprehensive guide to TanStack and Shadcn",
		author: "Lani",
		createdAt: "2026-08-01",
		categories: [{ title: "Tech", type: "Category", url: "/category/tech" }],
		tags: [{ title: "tanstack", type: "Tag", url: "/tag/tanstack" }],
		featured_image: {
			src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
			altText: "Computer code on a screen",
			caption: "A beautiful stock photo of code",
			hasImage: true,
			//width: 1000,
			//height: 600,
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const headline = canvas.getByText("Building Modern Web Applications");
		expect(headline).toBeInTheDocument();

		const subheadline = canvas.getByText("A comprehensive guide to TanStack and Shadcn");
		expect(subheadline).toBeInTheDocument();

		const date = canvas.getByText(/(Aug 1st|Jul 31st), 2026/);
		expect(date).toBeInTheDocument();

		const img = canvas.getByRole("img");
		expect(img).toBeInTheDocument();
	},
};
