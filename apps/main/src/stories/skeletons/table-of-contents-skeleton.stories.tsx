import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import {
	TableOfContentsDesktopSkeleton,
	TableOfContentsMobileSkeleton,
	TableOfContentsSkeleton,
} from "./table-of-contents-skeleton";

const meta = {
	title: "Skeletons/TableOfContents",
	component: TableOfContentsSkeleton,
	tags: ["autodocs"],
} satisfies Meta<typeof TableOfContentsSkeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("toc-desktop-skeleton")).toBeInTheDocument();
		expect(canvas.getByTestId("toc-mobile-skeleton")).toBeInTheDocument();
	},
};

export const DesktopOnly: StoryObj<typeof TableOfContentsDesktopSkeleton> = {
	render: () => <TableOfContentsDesktopSkeleton />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("toc-desktop-skeleton")).toBeInTheDocument();
	},
};

export const MobileOnly: StoryObj<typeof TableOfContentsMobileSkeleton> = {
	render: () => <TableOfContentsMobileSkeleton />,
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByTestId("toc-mobile-skeleton")).toBeInTheDocument();
	},
};
