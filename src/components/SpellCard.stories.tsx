import type { Meta, StoryObj } from '@storybook/react';
import { SpellCard } from './SpellCard';
import { MantineProvider } from '@mantine/core';
import { Spell } from '../models/spells.zod';

const meta: Meta<typeof SpellCard> = {
  title: 'Components/SpellCard',
  component: SpellCard,
  decorators: [
    (Story) => (
      <MantineProvider>
        <Story />
      </MantineProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A card component that displays spell information in a clean, organized layout.',
      },
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof SpellCard>;

const mockSpell: Spell = {
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
  description: 'A sphere of flame erupts from your fingertips, dealing fire damage to all creatures in a 20-foot radius.',
  higherLevels: 'When cast at higher levels, the damage increases by 1d6 for each level above 3rd.',
  tags: ['offensive', 'fire', 'area-effect'],
};

const longDescriptionSpell: Spell = {
  ...mockSpell,
  spellName: 'Greater Elemental Mastery',
  description: 'This is an incredibly powerful spell that demonstrates how the spell card handles very long descriptions. It contains multiple paragraphs of detailed information about the spell\'s effects, mechanics, and lore. The spell allows the caster to manipulate multiple elements simultaneously, creating devastating combinations of fire, ice, lightning, and earth magic. The description continues to test the layout and ensure proper text wrapping and visual hierarchy.',
  higherLevels: 'At higher levels, this spell becomes even more powerful, gaining additional elemental types and increased damage. The caster can target more enemies and the area of effect expands significantly.',
};

export const Default: Story = {
  args: {
    spell: mockSpell,
  },
};

export const LongDescription: Story = {
  args: {
    spell: longDescriptionSpell,
  },
};

export const HighComplexitySpell: Story = {
  args: {
    spell: {
      ...mockSpell,
      spellName: 'Time Stop',
      complexity: 'high-complexity',
      flare: 'high-flare',
      school: 'chronomancy',
      description: 'You briefly stop the flow of time for everyone but yourself.',
      tags: ['temporal', 'utility', 'legendary'],
    },
  },
};

export const LowComplexitySpell: Story = {
  args: {
    spell: {
      ...mockSpell,
      spellName: 'Light',
      complexity: 'low-complexity',
      flare: 'low-flare',
      school: 'illumination',
      description: 'You create a small orb of light that illuminates the area.',
      tags: ['utility', 'light'],
    },
  },
};

export const HealingSpell: Story = {
  args: {
    spell: {
      ...mockSpell,
      spellName: 'Cure Wounds',
      spellClass: 'vitalism',
      school: 'restoration',
      description: 'You channel positive energy to heal wounds and restore vitality.',
      tags: ['healing', 'restoration', 'positive-energy'],
    },
  },
};
