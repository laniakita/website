import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { PostPreview } from "./post-preview";

const meta = {
	title: "Blog/PostPreview",
	component: PostPreview,
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const rootRoute = createRootRoute({ component: Story });
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return (
				<div className="max-w-3xl mx-auto">
					<RouterProvider router={router} />
				</div>
			);
		},
	],
} satisfies Meta<typeof PostPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		url: "/blog/hello-world",
		headline: "Hello World! Welcome to the new blog.",
		subheadline: "A subheadline that gives more context.",
		description: (
			<p>
				This is a short description of the blog post. It could be rendered
				Markdown or just standard text. Here is a little more text to show how
				it wraps.
			</p>
		),
		date: "2026-08-01",
		featuredImage: {
			src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
			altText: "Computer code on a screen",
		},
		categories: [
			{ title: "Web Dev", url: "/category/web-dev", type: "Category" },
		],
		tags: [
			{ title: "react", url: "/tag/react", type: "Tag" },
			{ title: "storybook", url: "/tag/storybook", type: "Tag" },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Find the outer card element
		const card = canvas.getByTestId("post-preview-card");
		expect(card).toBeInTheDocument();

		// Verify the card has overflow-hidden which clips the image corners
		expect(card).toHaveClass("overflow-hidden");

		// Verify computed styles in the browser environment
		const styles = window.getComputedStyle(card);
		expect(styles.overflow).toBe("hidden");
		// Ensure the card has rounded corners to begin with (rounded-xl usually resolves to 0.75rem or similar)
		expect(styles.borderRadius).not.toBe("0px");

		// Check for headline and subheadline
		const headlineLink = canvas.getByRole("link", {
			name: /Hello World! Welcome to the new blog./i,
		});
		expect(headlineLink).toBeInTheDocument();

		const subheadline = canvas.getByText(
			/A subheadline that gives more context./i,
		);
		expect(subheadline).toBeInTheDocument();
	},
};
