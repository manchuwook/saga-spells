import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SpellsFilter } from './SpellsFilter';
import { Spell } from '../models/spells.zod';

// Mock spell tags hook
vi.mock('../hooks/useSpellTags', () => ({
  useSpellTags: () => ({
    data: {
      tags: [
        'offensive', 'defensive', 'fire', 'water', 'healing'
      ]
    },
    isLoading: false
  })
}));

// Mock Mantine hooks
vi.mock('@mantine/core', async () => {
  const actual = await import('@mantine/core');
  return {
    ...actual,
    useMantineColorScheme: () => ({
      colorScheme: 'light'
    })
  };
});

// Mock hooks
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      accent: '#4c6ef5',
      background: '#ffffff',
      text: '#333333',
    }
  })
}));

describe('SpellsFilter', () => {
  const mockSpells: Spell[] = [
    {
      spellName: 'Fireball',
      spellClass: 'Wizard',
      school: 'Evocation',
      complexity: 3,
      description: 'A ball of fire',
      keywords: 'offensive, fire, damage',
      range: '120 feet',
      duration: 'Instantaneous',
      action: '1 action',
      target: 'Area',
      check: 'None',
      flare: 2,
      focus: 'Arcane',
      skill: 'None',
      spellType: 'Offensive',
      altDescription: null
    },
    {
      spellName: 'Healing Word',
      spellClass: 'Cleric',
      school: 'Healing',
      complexity: 2,
      description: 'A healing spell',
      keywords: 'healing, restoration',
      range: '60 feet',
      duration: 'Instantaneous',
      action: '1 bonus action',
      target: 'Single creature',
      check: 'None',
      flare: 1,
      focus: 'Divine',
      skill: 'None',
      spellType: 'Healing',
      altDescription: null
    }
  ];

  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SpellsFilter spells={mockSpells} onFilterChange={mockOnFilterChange} />);
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });
});
