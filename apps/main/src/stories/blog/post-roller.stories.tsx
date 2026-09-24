import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { CatTagType } from "./cat-tag-roller";
import type { PostPreviewProps } from "./post-preview";
import { PostRoller } from "./post-roller";

const mockPosts: PostPreviewProps[] = [
	{
		url: "/blog/first-post",
		headline: "First Post",
		description: <p>This is the first post.</p>,
		createdAt: "2026-08-01",
		categories: [{ title: "News", url: "/category/news", type: CatTagType.Category }],
	},
	{
		url: "/blog/second-post",
		headline: "Second Post",
		featured_image: {
			src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000",
			altText: "Computer code on a screen",
		},
		description: <p>This is the second post.</p>,
		createdAt: "2026-08-02",
		categories: [{ title: "Updates", url: "/category/updates", type: CatTagType.Category }],
	},
	{
		url: "/blog/third-post",
		headline: "Third Post",
		description: <p>This is the third post.</p>,
		createdAt: "2026-08-03",
	},
];

const meta = {
	title: "Blog/PostRoller",
	component: PostRoller,
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
} satisfies Meta<typeof PostRoller>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		posts: mockPosts,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByText("First Post")).toBeInTheDocument();
		expect(canvas.getByText("Second Post")).toBeInTheDocument();
		expect(canvas.getByText("Third Post")).toBeInTheDocument();
	},
};

export const WithInjectedComponent: Story = {
	args: {
		posts: mockPosts,
		injectAtIndex: 1,
		injectedComponent: (
			<div className='rounded-lg border border-primary/20 bg-primary/10 p-6 text-center'>
				<h3 className='mb-2 font-bold text-primary text-xl'>Subscribe to our newsletter!</h3>
				<p className='text-foreground'>Get the latest updates right in your inbox.</p>
			</div>
		),
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		expect(canvas.getByText("First Post")).toBeInTheDocument();
		expect(canvas.getByText("Subscribe to our newsletter!")).toBeInTheDocument();
		expect(canvas.getByText("Second Post")).toBeInTheDocument();
	},
};
