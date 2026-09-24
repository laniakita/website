import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { PostPageSkeleton } from "./post-page-skeleton";

const meta = {
	title: "Skeletons/PostPage",
	component: PostPageSkeleton,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<ThemeStoreProvider>
				<Story />
			</ThemeStoreProvider>
		),
	],
} satisfies Meta<typeof PostPageSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	parameters: {
		layout: "fullscreen",
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("post-page-skeleton")).toBeInTheDocument();
	},
};
