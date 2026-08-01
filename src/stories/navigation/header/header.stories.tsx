import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within } from 'storybook/test';
import { Header } from '@/components/navigation/header';
import { defaultNavItems, defaultSocialItems } from '@/components/navigation/header/data';
import { ThemeStoreProvider } from '@/features/providers/theme-store-provider';
import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';

// TanStack Router requires a router context for Links to work in Storybook
const rootRoute = createRootRoute({
  component: () => (
    <ThemeStoreProvider>
      <Header navItems={defaultNavItems} socialItems={defaultSocialItems} />
    </ThemeStoreProvider>
  )
});

const router = createRouter({
  routeTree: rootRoute,
  history: createMemoryHistory(),
});

const HeaderWithRouter = () => (
  <RouterProvider router={router} />
);

const meta = {
  title: 'Navigation/Header/Header',
  component: HeaderWithRouter,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof HeaderWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PostLayout: Story = {
  decorators: [
    (Story) => {
      // Modify router context for post layout if needed
      const rootRoute = createRootRoute({
        component: () => (
          <ThemeStoreProvider>
            <Header navItems={defaultNavItems} socialItems={defaultSocialItems} isPost={true} tocInView={false} />
          </ThemeStoreProvider>
        )
      });
      const router = createRouter({ routeTree: rootRoute, history: createMemoryHistory() });
      return <RouterProvider router={router} />;
    }
  ]
};

export const WithDevWarning: Story = {
  decorators: [
    (Story) => {
      const rootRoute = createRootRoute({
        component: () => (
          <ThemeStoreProvider>
            <Header navItems={defaultNavItems} socialItems={defaultSocialItems} warnDev={true} />
          </ThemeStoreProvider>
        )
      });
      const router = createRouter({ routeTree: rootRoute, history: createMemoryHistory() });
      return <RouterProvider router={router} />;
    }
  ]
};

export const MobileMenuInteraction: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    
    let menuBtn: HTMLElement;
    
    await step('Find mobile menu button', async () => {
      // It should be visible on mobile viewport
      menuBtn = canvas.getByRole('button', { name: /open menu/i });
      await expect(menuBtn).toBeInTheDocument();
    });

    await step('Open mobile menu', async () => {
      await userEvent.click(menuBtn);
      // Look for a link inside the dialog
      // Dialog is rendered in a portal, so we query body
      const dialog = within(document.body).getByRole('dialog');
      await expect(dialog).toBeInTheDocument();
      
      const blogLink = within(dialog).getByRole('link', { name: /blog/i });
      await expect(blogLink).toBeInTheDocument();
    });
  },
};
