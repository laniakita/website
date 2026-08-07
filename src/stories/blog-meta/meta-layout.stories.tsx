import type { Meta, StoryObj } from "@storybook/react";
import { CatTagType } from "@/stories/blog/cat-tag-roller";
import { MetaLayout } from "@/stories/blog-meta/meta-layout";
import { MetaLayoutSkeleton } from "@/stories/skeletons/meta-layout-skeleton";
import { MetaPostRoller } from "./meta-roller";

const meta = {
	title: "Blog-Meta/MetaLayout",
	component: MetaLayout,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof MetaLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockPosts = [
	{
		headline: "Understanding React Server Components",
		url: "/blog/understanding-rsc",
		description: "A deep dive into how React Server Components work under the hood.",
		date: "2023-10-01",
		categories: [{ title: "React", url: "/categories/react", type: CatTagType.Category }],
		tags: [{ title: "performance", url: "/tags/performance", type: CatTagType.Tag }],
		featured_image: {
			src: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=764&auto=format&fit=crop",
			altText: "Placeholder",
			localHash: "",
		},
	},
	{
		headline: "Mastering Tailwind CSS",
		url: "/blog/mastering-tailwind",
		description: "Tips and tricks for building beautiful UIs with Tailwind CSS.",
		date: "2023-09-15",
		categories: [{ title: "CSS", url: "/categories/css", type: CatTagType.Category }],
		tags: [{ title: "design", url: "/tags/design", type: CatTagType.Tag }],
		featured_image: {
			src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1169&auto=format&fit=crop",
			altText: "Placeholder",
			localHash: "",
		},
	},
];

export const CategoryLayout: Story = {
	args: {
		title: "React",
		isTag: false,
		RenderablePosts: <MetaPostRoller posts={mockPosts} />,
		children: (
			<div>
				<p>Everything you need to know about React, its ecosystem, and best practices.</p>
			</div>
		),
	},
};

export const TagLayout: Story = {
	args: {
		title: "performance",
		isTag: true,
		RenderablePosts: <MetaPostRoller posts={[mockPosts[0]]} />, // Only one post for the tag
		children: (
			<div>
				<p>Articles focusing on web performance optimization techniques.</p>
			</div>
		),
	},
};

export const EmptyPosts: Story = {
	args: {
		title: "Empty Tag",
		isTag: true,
		RenderablePosts: (
			<div>
				<p>Oops no matching posts founds. Hmm, somethings wrong here.</p>
			</div>
		),
		children: (
			<div>
				<p>This tag currently has no posts associated with it.</p>
			</div>
		),
	},
};

export const Skeleton: StoryObj<typeof MetaLayoutSkeleton> = {
	render: () => <MetaLayoutSkeleton />,
};
