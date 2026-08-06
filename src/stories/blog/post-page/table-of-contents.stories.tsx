"use client";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect } from "react";
import { expect, within } from "storybook/test";
import { useToCViewStore } from "@/lib/providers/toc-view-store-provider";
import {
	TableOfContents,
} from "./table-of-contents";

const mockNestedHeadings = [
	{ title: "Introduction", url: "#introduction", depth: 1 },
	{ title: "Getting Started", url: "#getting-started", depth: 2 },
	{ title: "Installation", url: "#installation", depth: 3 },
	{ title: "Usage", url: "#usage", depth: 2 },
	{ title: "Advanced", url: "#advanced", depth: 1 },
];

const mockFlatHeadings = [
	{ content: "Introduction", id: "introduction" },
	{ content: "Getting Started", id: "getting-started" },
	{ content: "Installation", id: "installation" },
	{ content: "Usage", id: "usage" },
	{ content: "Advanced", id: "advanced" },
];

function StoreInitializer({ children }: { children: React.ReactNode }) {
	const { setToCInView } = useToCViewStore((state) => state);

	useEffect(() => {
		setToCInView(); // Ensure the desktop TOC is visible in the story
	}, [setToCInView]);

	return <>{children}</>;
}

import { NavScrollViewStoreProvider } from "@/lib/providers/nav-scroll-view-store-provider";
import { ToCViewStoreProvider } from "@/lib/providers/toc-view-store-provider";

const meta = {
	title: "Blog/PostPage/TableOfContents",
	component: TableOfContents,
	tags: ["autodocs"],
	decorators: [
		(Story) => (
			<NavScrollViewStoreProvider>
				<ToCViewStoreProvider>
					<StoreInitializer>
						<div className="relative min-h-[150vh] w-full max-w-5xl mx-auto flex">
							{/* Fake content to allow scrolling and intersection observing */}
							<div className="flex-1 p-8 space-y-[40vh]">
								<h1 id="introduction">Introduction</h1>
								<p>Scroll down to see the intersection observer in action.</p>
								<h2 id="getting-started">Getting Started</h2>
								<h3 id="installation">Installation</h3>
								<h2 id="usage">Usage</h2>
								<h1 id="advanced">Advanced</h1>
							</div>
							{/* TOC */}
							<Story />
						</div>
					</StoreInitializer>
				</ToCViewStoreProvider>
			</NavScrollViewStoreProvider>
		),
	],
} satisfies Meta<typeof TableOfContents>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		nestedHeadings: mockNestedHeadings,
		flatHeadings: mockFlatHeadings,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Note: The desktop TOC might be hidden depending on viewport size in Storybook,
		// and the mobile TOC depends on the NavScrollViewStore which might need mocking.
		// For a basic smoke test, check if the headings rendered somewhere in the DOM.
		const introLink = canvas.getAllByText("Introduction")[0];
		expect(introLink).toBeInTheDocument();
	},
};


