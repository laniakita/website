import type { Meta, StoryObj } from "@storybook/react";
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from "@tanstack/react-router";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { MAIN_PAGES, SOCIALS_NAVBAR } from "@/components/nav-constants";
import { NavScrollViewStoreProvider } from "@/lib/providers/nav-scroll-view-store-provider";
import { ThemeStoreProvider } from "@/lib/providers/theme-store-provider";
import { ToCViewStoreProvider } from "@/lib/providers/toc-view-store-provider";
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
		createdAt: "2026-08-01",
		categories: [{ title: "Tech", type: "category", url: "/category/tech" }],
		tags: [{ title: "storybook", type: "tag", url: "/tag/storybook" }],
		featured_image: {
			src: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
			altText: "Computer code on a screen",
			localHash: "",
			//width: 1000,
			//height: 600,
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
			navItems: MAIN_PAGES,
			socialItems: SOCIALS_NAVBAR,
		},
		MDXContent: (
			<div>
				<h1 id='introduction'>Introduction</h1>
				<p>This is standard MDX content being rendered directly inside the prose wrapper.</p>
				<div className='h-[150vh]' />
				<h1 id='usage'>Usage</h1>
				<p>Here is some more content to pad out the page and test scrolling.</p>
				<div className='h-[150vh]' />
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
			const intro = canvas.getByText("This is standard MDX content being rendered directly inside the prose wrapper.");
			expect(intro).toBeInTheDocument();
		});

		await step("Verify TOC interaction", async () => {
			// Find the navbar TOC toggle button explicitly in the header to avoid conflicts
			// with the sidebar button which is also a TocToggle component
			const header = canvasElement.querySelector("header");
			if (!header) throw new Error("Header not found");
			const headerCanvas = within(header as HTMLElement);
			const navbarTocBtn = headerCanvas.getByRole("button", {
				name: /Toggle Table of Contents/i,
			});
			expect(navbarTocBtn).toBeInTheDocument();

			// Find the TOC sidebar close button
			// Since we replaced the Close button with TocToggle, its aria-label is also Toggle Table of Contents.
			// We can find it by looking inside the TOC nav (IPAD_TOC_ID)
			const sidebarNav = canvasElement.querySelector("#horizontal-table-of-contents");
			if (!sidebarNav) throw new Error("Sidebar TOC not found");
			const sidebarCanvas = within(sidebarNav as HTMLElement);
			const sidebarCloseBtn = sidebarCanvas.getByRole("button", {
				name: /Toggle Table of Contents/i,
			});
			expect(sidebarCloseBtn).toBeInTheDocument();

			// By default, TOC is visible (tocInView is true), so the navbar button should be hidden (w-0, opacity-0)
			expect(navbarTocBtn).toHaveClass("w-0", "opacity-0");
			// And the sidebar should be open (w-80 or w-96)
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

			// Scroll the usage heading into view, specifically to the center so it intersects the observer
			usageHeading.scrollIntoView({ behavior: "instant", block: "center" });

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

		await step("Verify mobile TOC overlay z-index is lower than Header", async () => {
			const mobileTocBtn = canvas.getByRole("button", {
				name: /On this page/i,
				hidden: true,
			});
			await userEvent.click(mobileTocBtn);

			// Find the opened collapsible content (DisclosurePanel uses role="group")
			// It renders inline, not in a portal
			const tocGroup = await canvas.findByRole("group", { hidden: true });
			expect(tocGroup).toBeInTheDocument();

			// We added z-30 to the CollapsibleContent so let's verify that's applied correctly
			// This ensures it slides OUT under the mobile menu bar which is z-40, and the header which is z-50
			expect(tocGroup).toHaveClass("z-30");

			// Verify the menu bar is visually above
			const nav = mobileTocBtn.closest("nav");
			expect(nav).toBeInTheDocument();
		});

		await step("Verify mobile TOC closes on item click", async () => {
			// Find the opened collapsible content
			const tocGroup = await canvas.findByRole("group", { hidden: true });

			// Find a link inside the TOC and click it
			const groupCanvas = within(tocGroup);
			const usageLink = await groupCanvas.findByRole("link", {
				name: /Usage/i,
				hidden: true,
			});
			await userEvent.click(usageLink);

			// Verify the group closes (is removed from DOM or gets hidden attribute)
			// wait for the exit animation to finish
			await waitFor(() => {
				const group = canvas.queryByRole("group", { hidden: true });
				if (group) {
					expect(group).toHaveAttribute("hidden");
				}
			});
		});

		await step("Verify clicking outside mobile TOC closes it", async () => {
			// Ensure it's closed first
			const initialGroup = canvas.queryByRole("group", { hidden: true });
			if (initialGroup) {
				expect(initialGroup).toHaveAttribute("hidden");
			}

			// Open it
			const mobileTocBtn = canvas.getByRole("button", {
				name: /On this page/i,
				hidden: true,
			});
			await userEvent.click(mobileTocBtn);

			// Wait for it to appear
			await waitFor(() => {
				expect(canvas.getByRole("group", { hidden: true })).not.toHaveAttribute("hidden");
			});

			// Verify scrim is present
			const scrim = canvas.getByTestId("mobile-toc-scrim");
			expect(scrim).toBeInTheDocument();

			// Click the scrim to close
			await userEvent.click(scrim);

			// Wait for exit animations and verify it closes
			await waitFor(() => {
				const closedGroup = canvas.queryByRole("group", { hidden: true });
				if (closedGroup) {
					expect(closedGroup).toHaveAttribute("hidden");
				}

				// Verify scrim is gone
				expect(canvas.queryByTestId("mobile-toc-scrim")).not.toBeInTheDocument();
			});
		});

		await step("Verify mobile TOC can be toggled by the 'On this page' button", async () => {
			const _bodyCanvas = within(document.body);
			const mobileTocBtn = canvas.getByRole("button", {
				name: /On this page/i,
				hidden: true,
			});

			// 1. Open the TOC
			await userEvent.click(mobileTocBtn);
			expect(await canvas.findByRole("group", { hidden: true })).toBeInTheDocument();

			// 2. Close the TOC by clicking the button again
			await userEvent.click(mobileTocBtn);
			await waitFor(() => {
				expect(canvas.queryByRole("group", { hidden: true })).not.toBeVisible();
			});

			// 3. Open it again
			await userEvent.click(mobileTocBtn);
			expect(await canvas.findByRole("group", { hidden: true })).toBeInTheDocument();

			// Cleanup: close it
			await userEvent.click(mobileTocBtn);
		});
	},
};
