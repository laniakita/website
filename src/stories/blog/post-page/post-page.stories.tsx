import type { Meta, StoryObj } from "@storybook/react";
import {
	createMemoryHistory,
	createRootRoute,
	createRouter,
	RouterProvider,
} from "@tanstack/react-router";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { NavScrollViewStoreProvider } from "@/lib/providers/nav-scroll-view-store-provider";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { ToCViewStoreProvider } from "@/lib/providers/toc-view-store-provider";
import { SOCIALS_NAVBAR } from "$/src/components/nav-constants";
import { defaultNavItems } from "$/src/components/navigation/header/data";
import { PostPage } from "./post-page";

const meta = {
	title: "Blog/PostPage",
	component: PostPage,
	tags: ["autodocs"],
	decorators: [
		(Story) => {
			const rootRoute = createRootRoute({ component: Story });
			const router = createRouter({
				routeTree: rootRoute,
				history: createMemoryHistory(),
			});
			return (
				<ThemeStoreProvider>
					<NavScrollViewStoreProvider>
						<ToCViewStoreProvider>
							<RouterProvider router={router} />
						</ToCViewStoreProvider>
					</NavScrollViewStoreProvider>
				</ThemeStoreProvider>
			);
		},
	],
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof PostPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		url: "/blog/my-test-post",
		headline: "Full Blog Post Page Render",
		subheadline: "Testing the entire page assembly",
		author: "Lani",
		date: "2026-08-01",
		categories: [{ title: "Tech", type: "Category", url: "/category/tech" }],
		tags: [{ title: "storybook", type: "Tag", url: "/tag/storybook" }],
		featured_image: {
			src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
			altText: "Computer code on a screen",
			hasImage: true,
			width: 1000,
			height: 600,
		},
		toc: {
			nestedHeadings: [
				{ title: "Introduction", url: "#introduction", depth: 1 },
				{ title: "Usage", url: "#usage", depth: 1 },
			],
			flatHeadings: [
				{ content: "Introduction", id: "introduction" },
				{ content: "Usage", id: "usage" },
			],
		},
		header: {
			navItems: defaultNavItems,
			socialItems: SOCIALS_NAVBAR,
		},
		MDXContent: (
			<div>
				<h1 id="introduction">Introduction</h1>
				<p>
					This is standard MDX content being rendered directly inside the prose
					wrapper.
				</p>
				<h1 id="usage">Usage</h1>
				<p>Here is some more content to pad out the page and test scrolling.</p>
				<div className="h-[50vh]" />
			</div>
		),
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step("Verify initial render", async () => {
			// Check header
			const headline = canvas.getByText("Full Blog Post Page Render");
			expect(headline).toBeInTheDocument();

			// Check prose content
			const intro = canvas.getByText(
				"This is standard MDX content being rendered directly inside the prose wrapper.",
			);
			expect(intro).toBeInTheDocument();
		});

		await step("Verify TOC interaction", async () => {
			// Find the navbar TOC toggle button
			const navbarTocBtn = canvas.getByRole("button", {
				name: /Toggle Table of Contents/i,
			});
			expect(navbarTocBtn).toBeInTheDocument();

			// Find the TOC sidebar close button
			const sidebarCloseBtn = canvas.getByRole("button", {
				name: /Close Table of Contents/i,
			});
			expect(sidebarCloseBtn).toBeInTheDocument();

			// By default, TOC is visible (tocInView is true), so the navbar button should be hidden (w-0, opacity-0)
			expect(navbarTocBtn).toHaveClass("w-0", "opacity-0");
			// And the sidebar should be open (w-80 or w-96)
			const sidebarNav = sidebarCloseBtn.closest("nav");
			expect(sidebarNav).not.toHaveClass("w-0");

			// Close the TOC
			await userEvent.click(sidebarCloseBtn);

			// The navbar TOC button should now reappear (w-9, opacity-100)
			expect(navbarTocBtn).toHaveClass("w-9", "opacity-100");
			expect(navbarTocBtn).not.toHaveClass("w-0", "opacity-0");

			// The sidebar should now be closed (w-0)
			expect(sidebarNav).toHaveClass("w-0");

			// Re-open the TOC from the navbar
			await userEvent.click(navbarTocBtn);

			// Verify it goes back to the initial state
			expect(navbarTocBtn).toHaveClass("w-0", "opacity-0");
			expect(sidebarNav).not.toHaveClass("w-0");

			// Close it one more time to be absolutely sure
			await userEvent.click(sidebarCloseBtn);
			expect(navbarTocBtn).toHaveClass("w-9", "opacity-100");
			expect(sidebarNav).toHaveClass("w-0");
		});
	},
};

export const Mobile: Story = {
	args: {
		...Default.args,
	},
	parameters: {
		viewport: {
			defaultViewport: "mobile1",
		},
	},
	play: async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step("Verify mobile TOC appears", async () => {
			// Find the mobile TOC button "On this page"
			// Note: test-runner runs at desktop resolution so md:hidden hides it. We must use { hidden: true }
			const mobileTocBtn = canvas.getByRole("button", {
				name: /On this page/i,
				hidden: true,
			});
			expect(mobileTocBtn).toBeInTheDocument();
		});

		await step("Verify concatenated title updates on scroll", async () => {
			// Initially, it might show the first heading if it's in view, or just have empty state.
			// Let's get the "Usage" heading
			const usageHeading = canvas.getByRole("heading", { name: "Usage" });

			// Scroll the usage heading into view
			usageHeading.scrollIntoView({ behavior: "instant" });

			// The IntersectionObserver should update the activeId, and the ConcatTitle should render "Usage"
			// Next to the "On this page" button, there is a <p> tag that contains the ConcatTitle
			const mobileTocBtn = canvas.getByRole("button", {
				name: /On this page/i,
				hidden: true,
			});
			const navContainer = mobileTocBtn.closest("div");

			// We need to wait for the IntersectionObserver to fire and state to update
			// We can use a small delay or loop, but testing library's `findByText` or `waitFor` is best.
			// However `within(navContainer)` might fail if it's not strongly typed.
			if (navContainer) {
				const navCanvas = within(navContainer as HTMLElement);
				const usageText = await navCanvas.findByText(/Usage/i, undefined, {
					timeout: 3000,
				});
				expect(usageText).toBeInTheDocument();
			} else {
				throw new Error("Could not find mobile TOC nav container");
			}
		});

		await step(
			"Verify mobile TOC overlay z-index is lower than Header",
			async () => {
				const mobileTocBtn = canvas.getByRole("button", {
					name: /On this page/i,
					hidden: true,
				});
				await userEvent.click(mobileTocBtn);

				// Find the opened dialog overlay (ModalOverlay uses fixed inset-0)
				// It renders in a portal outside the canvas, so we check document.body
				const bodyCanvas = within(document.body);
				const tocDialog = await bodyCanvas.findByRole("dialog");
				expect(tocDialog).toBeInTheDocument();

				// We added !z-30 to the SheetContent (which applies to ModalPrimitive), so let's verify that's applied correctly
				// This ensures it slides OUT under the mobile menu bar which is z-40, and the header which is z-50
				expect(tocDialog.parentElement).toHaveClass("!z-30");

				// Verify the menu bar is z-40
				const nav = mobileTocBtn.closest("nav");
				expect(nav).toHaveClass("z-40");
			},
		);

		await step("Verify mobile TOC closes on item click", async () => {
			// Find the opened dialog overlay
			const bodyCanvas = within(document.body);
			const tocDialog = await bodyCanvas.findByRole("dialog");

			// Find a link inside the TOC and click it
			const dialogCanvas = within(tocDialog);
			const usageLink = dialogCanvas.getByRole("link", { name: /Usage/i });
			await userEvent.click(usageLink);

			// Verify the dialog closes (is removed from DOM)
			// queryByRole returns null if not found
			expect(bodyCanvas.queryByRole("dialog")).not.toBeInTheDocument();
		});
	},
};
