import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { expect, within } from "storybook/test";
import { HeroBlur } from "./hero-blur";

const meta = {
	title: "Blog/PostPage/HeroBlur",
	component: HeroBlur,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<div className='mx-auto h-100 max-w-3xl'>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof HeroBlur>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		featured_image: {
			src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
			altText: "Computer code on a screen",
			imgData: undefined,
			//width: 1000,
			//height: 600,
			//imgData: {
			//css: "LGF5]+Yk^6#M@-5c,1J5@[or[k6.", // Dummy blurhash/base64 equivalent
			//}
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const container = canvas.getByTestId("hero-blur-container");
		expect(container).toBeInTheDocument();

		const img = canvas.getByRole("img");
		expect(img).toBeInTheDocument();
		expect(img).toHaveAttribute("alt", "Computer code on a screen");
	},
};
