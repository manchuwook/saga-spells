import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { SpellbooksProvider, SpellbooksContext } from '../context/SpellbooksContext';
import { useContext } from 'react';
import { Spell } from '../models/spells.zod';
import '@testing-library/jest-dom';

// Test component to interact with the context
function TestComponent() {
  const {
    spellbooks,
    addSpellbook,
    updateSpellbook,
    deleteSpellbook,
    getSpellbook,
    addSpellToSpellbook,
    removeSpellFromSpellbook,
  } = useContext(SpellbooksContext);

  return (
    <div>
      <div data-testid="spellbooks-count">{spellbooks.length}</div>
      <button
        data-testid="add-spellbook"
        onClick={() =>
          addSpellbook({
            name: 'Test Spellbook',
            character: 'Test Character',
            description: 'Test Description',
            spells: [],
          })
        }
      >
        Add Spellbook
      </button>
      {spellbooks.map((spellbook) => (
        <div key={spellbook.id} data-testid={`spellbook-${spellbook.id}`}>
          <h3 data-testid={`spellbook-name-${spellbook.id}`}>{spellbook.name}</h3>
          <p data-testid={`spellbook-character-${spellbook.id}`}>{spellbook.character}</p>
          <p data-testid={`spellbook-description-${spellbook.id}`}>{spellbook.description}</p>
          <div data-testid={`spellbook-spells-count-${spellbook.id}`}>{spellbook.spells.length}</div>
          <button
            data-testid={`add-spell-${spellbook.id}`}
            onClick={() =>
              addSpellToSpellbook(spellbook.id, {
                spellName: 'Test Spell',
                spellClass: 'Wizard',
                school: 'Evocation',
                complexity: 'medium-complexity',
                flare: 'medium-flare',
                range: '30 feet',
                target: 'single-target',
                action: 'Standard',
                duration: 'Instant',
                keywords: 'fire, damage',
                check: 'Intelligence + Spellcraft',
                skill: 'Spellcraft',
                focus: 'Staff',
                spellType: 'Attack',
                description: 'A test spell that does damage',
                altDescription: null,
              })
            }
          >
            Add Spell
          </button>
          {spellbook.spells.map((spell) => (
            <div key={spell.spellName} data-testid={`spell-${spell.spellName}`}>
              <span data-testid={`spell-name-${spell.spellName}`}>{spell.spellName}</span>
              <button
                data-testid={`remove-spell-${spell.spellName}`}
                onClick={() => removeSpellFromSpellbook(spellbook.id, spell.spellName)}
              >
                Remove Spell
              </button>
            </div>
          ))}
          <button
            data-testid={`delete-spellbook-${spellbook.id}`}
            onClick={() => deleteSpellbook(spellbook.id)}
          >
            Delete Spellbook
          </button>
        </div>
      ))}
    </div>
  );
}

describe('SpellbooksContext Component', () => {
  // Clear localStorage before each test to ensure a clean state
  beforeEach(() => {
    window.localStorage.clear();
    
    // Mock crypto.randomUUID for consistent IDs in tests
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-456'
    });
  });

  test('should create a spellbook, add a spell, remove the spell, and delete the spellbook', async () => {
    // Render the test component with the SpellbooksProvider
    render(
      <SpellbooksProvider>
        <TestComponent />
      </SpellbooksProvider>
    );

    // Verify initial state: no spellbooks
    expect(screen.getByTestId('spellbooks-count').textContent).toBe('0');

    // Step 1: Create a new spellbook
    act(() => {
      fireEvent.click(screen.getByTestId('add-spellbook'));
    });    // Verify a spellbook was created
    await waitFor(() => {
      expect(screen.getByTestId('spellbooks-count').textContent).toBe('1');
    });

    // Since we know the ID is fixed by our mock, we can just use the exact ID
    const spellbookId = 'test-uuid-456';

    // Verify spellbook properties
    expect(screen.getByTestId(`spellbook-${spellbookId}`)).toBeInTheDocument();

    // Verify spellbook properties
    expect(screen.getByTestId(`spellbook-name-${spellbookId}`).textContent).toBe('Test Spellbook');
    expect(screen.getByTestId(`spellbook-character-${spellbookId}`).textContent).toBe('Test Character');
    expect(screen.getByTestId(`spellbook-description-${spellbookId}`).textContent).toBe('Test Description');
    expect(screen.getByTestId(`spellbook-spells-count-${spellbookId}`).textContent).toBe('0');

    // Step 2: Add a spell to the spellbook
    act(() => {
      fireEvent.click(screen.getByTestId(`add-spell-${spellbookId}`));
    });

    // Verify the spell was added
    await waitFor(() => {
      expect(screen.getByTestId(`spellbook-spells-count-${spellbookId}`).textContent).toBe('1');
    });
    
    // Verify spell exists
    expect(screen.getByTestId('spell-Test Spell')).toBeInTheDocument();
    expect(screen.getByTestId('spell-name-Test Spell').textContent).toBe('Test Spell');

    // Step 3: Remove the spell from the spellbook
    act(() => {
      fireEvent.click(screen.getByTestId(`remove-spell-Test Spell`));
    });

    // Verify the spell was removed
    await waitFor(() => {
      expect(screen.getByTestId(`spellbook-spells-count-${spellbookId}`).textContent).toBe('0');
    });
    
    // Verify spell no longer exists
    expect(screen.queryByTestId('spell-Test Spell')).not.toBeInTheDocument();

    // Step 4: Delete the spellbook
    act(() => {
      fireEvent.click(screen.getByTestId(`delete-spellbook-${spellbookId}`));
    });

    // Verify the spellbook was deleted
    await waitFor(() => {
      expect(screen.getByTestId('spellbooks-count').textContent).toBe('0');
    });
    
    // Verify spellbook no longer exists
    expect(screen.queryByTestId(`spellbook-${spellbookId}`)).not.toBeInTheDocument();
  });
});
