import type { Meta, StoryObj } from '@storybook/react';
import { SpellsFilter } from './SpellsFilter';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const meta: Meta<typeof SpellsFilter> = {
  title: 'Components/SpellsFilter',
  component: SpellsFilter,
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      });
      
      return (
        <MantineProvider>
          <QueryClientProvider client={queryClient}>
            <Story />
          </QueryClientProvider>
        </MantineProvider>
      );
    },
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive filter component for searching and filtering spells by various criteria.',
      },
    },
  },
  argTypes: {
    onFilterChange: { action: 'filter changed' },
  },
};

export default meta;
type Story = StoryObj<typeof SpellsFilter>;

export const Default: Story = {
  args: {
    spells: [],
    onFilterChange: () => {},
  },
};

export const WithMockData: Story = {
  args: {
    spells: [
      {
        spellName: 'Fireball',
        spellClass: 'elementalism',
        school: 'pyromancy',
        complexity: 'medium-complexity',
        flare: 'medium-flare',
        range: '30 feet',
        target: 'single-target',
        action: 'Standard',
        duration: 'Instant',
        keywords: 'fire, damage',
        check: 'Intelligence + Evocation',
        skill: 'Evocation',
        focus: 'Wand',
        components: 'V, S, F',
        castingTime: '1 Standard Action',
        description: 'A sphere of flame erupts from your fingertips.',
        tags: ['offensive', 'fire'],
      },
      {
        spellName: 'Heal',
        spellClass: 'vitalism',
        school: 'restoration',
        complexity: 'low-complexity',
        flare: 'low-flare',
        range: 'Touch',
        target: 'single-target',
        action: 'Standard',
        duration: 'Instant',
        keywords: 'healing',
        check: 'Wisdom + Restoration',
        skill: 'Restoration',
        focus: 'Holy Symbol',
        components: 'V, S, F',
        castingTime: '1 Standard Action',
        description: 'You channel positive energy to heal wounds.',
        tags: ['healing', 'restoration'],
      },
    ],
    onFilterChange: () => {},
  },
};
