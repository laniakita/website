import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { ShareButton, ShareButtonSkeleton } from "./share";

const meta = {
	title: "Blog/PostPage/ShareButton",
	component: ShareButton,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className='flex h-[50vh] w-full items-center justify-center bg-background p-10 text-foreground'>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof ShareButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		title: "My Awesome Blog Post",
		url: "https://example.com/blog/my-awesome-blog-post",
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step("Render share button", async () => {
			const shareBtn = canvas.getByRole("button", { name: /share/i });
			expect(shareBtn).toBeInTheDocument();
		});

		await step("Open dropdown menu", async () => {
			const shareBtn = canvas.getByRole("button", { name: /share/i });
			await userEvent.click(shareBtn);

			// Dropdown menu renders in a portal, so we query the document body
			const body = within(document.body);

			// Verify that the menu items are present
			const copyLink = await body.findByText(/copy link/i);
			expect(copyLink).toBeInTheDocument();

			const bluesky = await body.findByText(/Bluesky/i);
			expect(bluesky).toBeInTheDocument();

			const mastodon = await body.findByText(/Mastodon/i);
			expect(mastodon).toBeInTheDocument();

			const linkedin = await body.findByText(/LinkedIn/i);
			expect(linkedin).toBeInTheDocument();

			const substack = await body.findByText(/Substack/i);
			expect(substack).toBeInTheDocument();
		});
	},
};

export const Skeleton: StoryObj<typeof ShareButtonSkeleton> = {
	render: () => (
		<div className='flex h-64 w-full items-center justify-center bg-background'>
			<ShareButtonSkeleton />
		</div>
	),
};
