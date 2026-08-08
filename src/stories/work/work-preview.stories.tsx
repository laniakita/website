import type { Meta, StoryObj } from "@storybook/react";
import { WorkPreview } from "./work-preview";

const meta = {
	title: "Work/WorkPreview",
	component: WorkPreview,
	parameters: {
		layout: "centered",
		a11y: {
			config: {
				rules: [
					{
						id: "color-contrast",
						enabled: false,
					},
				],
			},
		},
	},
} satisfies Meta<typeof WorkPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		id: "sample-work",
		title: "Acme Corp Rebrand",
		source: "https://acme.corp",
		active: true,
		createdAt: "2023-01-15T00:00:00Z",
		tech: ["Next.js", "Tailwind CSS", "TypeScript", "Framer Motion"],
		featured_image: {
			src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
			localHash: "test",
			altText: "A laptop showing code",
		},
		RenderableMDX: (
			<p>
				Redesigned the entire digital presence for Acme Corp. Included migrating their legacy system to a modern web
				stack, improving performance scores by 40% and user retention by 25%.
			</p>
		),
	},
	decorators: [
		(Story) => (
			<div className='min-h-full w-full max-w-7xl p-8'>
				<Story />
			</div>
		),
	],
};

export const Ongoing: Story = {
	args: {
		...Default.args,
		title: "Open Source Initiative",
		source: "https://opensource.org",
		RenderableMDX: <p>An ongoing effort to maintain and contribute to vital open source libraries.</p>,
	},
	decorators: Default.decorators,
};
