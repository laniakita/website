import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { SocialBox } from "./social-box";

const meta = {
	title: "Sidebar/SocialBox",
	component: SocialBox,
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
} satisfies Meta<typeof SocialBox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		viewport: {
			defaultViewport: "desktop",
		},
	},
	args: {
		items: [
			{
				title: "Github",
				url: "https://github.com/laniakita",
				iconName: "icon-[ant-design--github-filled]",
				linkName: "Github!",
			},
			{
				title: "Bluesky",
				url: "https://bsky.app/profile/laniakita.com",
				iconName: "icon-[fa6-brands--bluesky]",
				linkName: "Bluesky!",
			},
			{
				title: "Mastodon",
				url: "https://hachyderm.io/@lani",
				iconName: "icon-[fa6-brands--mastodon]",
				linkName: "Mastodon!",
			},
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const githubLink = canvas.getByRole("link", {
			name: /Follow on Github!/i,
		});
		expect(githubLink).toHaveAttribute("href", "https://github.com/laniakita");
		expect(githubLink).toHaveAttribute("target", "_blank");

		const mastodonLink = canvas.getByRole("link", {
			name: /Follow on Mastodon!/i,
		});
		expect(mastodonLink).toHaveAttribute("rel", "me");
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
