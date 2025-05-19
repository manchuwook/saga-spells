import { describe, it, vi, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpellsFilter } from './SpellsFilter';
import { Spell } from '../models/spells.zod';
import '@testing-library/jest-dom';

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
    }),
    TextInput: ({ placeholder, onChange }: any) => 
      <input placeholder={placeholder} onChange={onChange} />,
    Accordion: ({ children }: any) => <div>{children}</div>,
    AccordionPanel: ({ children }: any) => <div>{children}</div>,
    AccordionItem: ({ children }: any) => <div>{children}</div>,
    AccordionControl: ({ children }: any) => <button>{children}</button>,
    MultiSelect: ({ data, onChange, placeholder }: any) => (
      <div>
        <span>{placeholder}</span>
        {data.map((item: any) => (
          <button key={item.value} onClick={() => onChange([item.value])}>
            {item.label}
          </button>
        ))}
      </div>
    ),
    Group: ({ children }: any) => <div>{children}</div>,
    Stack: ({ children }: any) => <div>{children}</div>,
    Paper: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  };
});

// Mock Tabler icons
vi.mock('@tabler/icons-react', async () => {
  return {
    IconSearch: () => <span>Search Icon</span>,
    IconFilter: () => <span>Filter Icon</span>,
    IconX: () => <span>X Icon</span>,
    IconTags: () => <span>Tags Icon</span>,
  };
});

// Mock context
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

  it('renders filter options correctly', () => {
    render(<SpellsFilter spells={mockSpells} onFilterChange={mockOnFilterChange} />);
    
    // Search field
    expect(screen.getByPlaceholderText(/search spells/i)).toBeInTheDocument();
    
    // Filter buttons (may be in collapsed state)
    expect(screen.getByText(/filters/i)).toBeInTheDocument();
  });

  it('filters spells by search text', async () => {
    render(<SpellsFilter spells={mockSpells} onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText(/search spells/i);
    fireEvent.change(searchInput, { target: { value: 'fire' } });
    
    // Wait for debounced search
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ spellName: 'Fireball' })
      ]));
    });

    // Should not contain Healing Word
    await waitFor(() => {
      const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
      expect(lastCall.find((spell: Spell) => spell.spellName === 'Healing Word')).toBeFalsy();
    });
  });

  it('filters spells by class', async () => {
    render(<SpellsFilter spells={mockSpells} onFilterChange={mockOnFilterChange} />);
    
    // Open the filters accordion
    const filtersButton = screen.getByText(/filters/i);
    fireEvent.click(filtersButton);
    
    // Get the classes filter
    const classesFilterButton = screen.getByText(/class/i);
    fireEvent.click(classesFilterButton);
    
    // Select Wizard
    const wizardOption = screen.getByText('Wizard');
    fireEvent.click(wizardOption);
    
    await waitFor(() => {
      expect(mockOnFilterChange).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({ spellName: 'Fireball' })
      ]));
    });

    // Should not contain Healing Word
    await waitFor(() => {
      const lastCall = mockOnFilterChange.mock.calls[mockOnFilterChange.mock.calls.length - 1][0];
      expect(lastCall.find((spell: Spell) => spell.spellName === 'Healing Word')).toBeFalsy();
    });
  });
});
