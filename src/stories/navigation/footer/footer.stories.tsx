import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { expect, within } from "storybook/test";
import { Footer } from "@/components/navigation/footer";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import {
	defaultFooterNavItems,
	defaultFooterSocialItems,
} from "$/src/components/navigation/footer/data";

// TanStack Router requires a router context for Links to work in Storybook
const rootRoute = createRootRoute({
	component: () => (
		<ThemeStoreProvider>
			<div className="min-h-screen flex flex-col justify-end bg-background p-4">
				<Footer
					navItems={defaultFooterNavItems}
					socialItems={defaultFooterSocialItems}
				/>
			</div>
		</ThemeStoreProvider>
	),
});

const router = createRouter({
	routeTree: rootRoute,
	history: createMemoryHistory(),
});

const FooterWithRouter = () => <RouterProvider router={router} />;

const meta = {
	title: "Navigation/Footer/Footer",
	component: FooterWithRouter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof FooterWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		// Ensure the main navigation elements are rendered
		const homeLink = canvas.getByRole("link", { name: /^home$/i });
		expect(homeLink).toBeInTheDocument();
		expect(homeLink).toHaveAttribute("href", "/");

		// Ensure social links have proper external attributes (checking the text one specifically)
		const socialLinks = canvas.getAllByRole("link", { name: /github/i });
		expect(socialLinks.length).toBeGreaterThan(0);
		socialLinks.forEach((link) => {
			expect(link).toHaveAttribute("target", "_blank");
			expect(link).toHaveAttribute("rel", "noopener noreferrer");
		});

		// Ensure copyright year renders (appears twice: desktop and mobile)
		const copyrightElements = canvas.getAllByText(/All Rights Reserved/i);
		expect(copyrightElements.length).toBeGreaterThan(0);
	},
};

export const CustomData: Story = {
	decorators: [
		(_Story) => {
			const customNav = [{ label: "Docs", to: "/docs" }];
			const customSocials = [
				{
					title: "Twitter",
					url: "https://twitter.com",
					iconName: "icon-[fa-brands--twitter]",
					linkName: "Twitter",
					textSize: "",
				},
			];
			const rootRoute = createRootRoute({
				component: () => (
					<ThemeStoreProvider>
						<div className="min-h-screen flex flex-col justify-end bg-background p-4">
							<Footer
								navItems={customNav}
								socialItems={customSocials}
								startYear={2020}
								authorName="Acme Corp"
							/>
						</div>
					</ThemeStoreProvider>
				),
			});
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return <RouterProvider router={router} />;
		},
	],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);

		const customLink = canvas.getByRole("link", { name: /^docs$/i });
		expect(customLink).toBeInTheDocument();
		expect(customLink).toHaveAttribute("href", "/docs");

		const customSocial = canvas.getAllByRole("link", { name: /twitter/i });
		expect(customSocial.length).toBeGreaterThan(0);

		const copyrightElements = canvas.getAllByText(/2020.*Acme Corp/i);
		expect(copyrightElements.length).toBeGreaterThan(0);
	},
};
