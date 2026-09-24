import '../src/styles.css'
import type { Preview } from '@storybook/tanstack-react'
import { INITIAL_VIEWPORTS, MINIMAL_VIEWPORTS } from 'storybook/viewport'

const preview: Preview = {
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
  },
  parameters: {
    viewport: {
      options: {
        ...INITIAL_VIEWPORTS,
        ...MINIMAL_VIEWPORTS,
      },
    },
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'error'
    }
  },
};

export default preview;