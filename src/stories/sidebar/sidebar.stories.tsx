import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { InfoBox } from "./info-box";
import { Sidebar } from "./sidebar";
import { SocialBox } from "./social-box";
import { SubscribeBox } from "./subscribe-box";

const mockSocialItems = [
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
];

const mockCategories = [
	{ title: "Linux", url: "/category/linux" },
	{ title: "Web Development", url: "/category/web-development" },
];

const mockTags = [
	{ title: "tutorial", url: "/tag/tutorial" },
	{ title: "react", url: "/tag/react" },
];

const meta = {
	title: "Sidebar/Sidebar",
	component: Sidebar,
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const rootRoute = createRootRoute({ component: Story });
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return (
				<div className="max-w-sm mx-auto">
					<RouterProvider router={router} />
				</div>
			);
		},
	],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		infoBoxSlot: (
			<InfoBox
				blogInfo={
					<p>
						A blog about life, Linux, and web development. Written by Lani
						Akita.
					</p>
				}
				categories={mockCategories}
				tags={mockTags}
			/>
		),
		subscribeBoxSlot: <SubscribeBox />,
		socialBoxSlot: <SocialBox items={mockSocialItems} />,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Check Info Box content
		expect(canvas.getByText(/A blog about life/i)).toBeInTheDocument();

		// Check Subscribe Box content
		expect(
			canvas.getByRole("heading", {
				name: /Articles delivered right to your feed reader/i,
			}),
		).toBeInTheDocument();

		// Check Social Box content
		expect(
			canvas.getByRole("link", { name: /Follow on Github!/i }),
		).toBeInTheDocument();
	},
};
