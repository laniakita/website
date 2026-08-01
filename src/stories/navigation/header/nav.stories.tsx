import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from 'storybook/test';
import { HeaderNav } from './nav';
import { defaultNavItems } from '@/components/navigation/header/data';

import { createMemoryHistory, createRootRoute, createRouter, RouterProvider } from '@tanstack/react-router';

const rootRoute = createRootRoute({
  component: () => <HeaderNav navItems={defaultNavItems} />
});
const router = createRouter({ routeTree: rootRoute, history: createMemoryHistory() });

const NavWithRouter = () => (
  <RouterProvider router={router} />
);

const meta = {
  title: 'Navigation/Header/Nav',
  component: NavWithRouter,
  tags: ['autodocs'],
} satisfies Meta<typeof NavWithRouter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const links = await canvas.findAllByRole('link');
    await expect(links.length).toBeGreaterThan(0);
    await expect(links[0]).toHaveTextContent(defaultNavItems[0].label);
  },
};
