import type { Preview } from '@storybook/sveltekit';
import '../src/lib/styles/theme.css';

const preview: Preview = {
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'bliss-light',
      values: [
        { name: 'bliss-light', value: '#fafafa' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark', value: '#09090b' },
      ],
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
