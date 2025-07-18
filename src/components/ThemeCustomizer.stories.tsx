import type { Meta, StoryObj } from '@storybook/react';
import { ThemeCustomizer } from './ThemeCustomizer';
import { MantineProvider } from '@mantine/core';
import { ThemeProvider } from '../context/ThemeContext';

const meta: Meta<typeof ThemeCustomizer> = {
  title: 'Components/ThemeCustomizer',
  component: ThemeCustomizer,
  decorators: [
    (Story) => (
      <MantineProvider>
        <ThemeProvider>
          <div style={{ height: '600px', padding: '20px' }}>
            <Story />
          </div>
        </ThemeProvider>
      </MantineProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A comprehensive theme customization panel that allows users to modify colors, fonts, and other visual aspects of the application.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeCustomizer>;

export const Default: Story = {};

export const Expanded: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Theme customizer with expanded panels showing all available options.',
      },
    },
  },
};
