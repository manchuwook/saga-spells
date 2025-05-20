import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContext } from 'react';
import { SpellbooksProvider, SpellbooksContext } from '../context/SpellbooksContext';

describe('Spellbook Management Tests', () => {
  // Create a simple integration test that verifies the complete lifecycle 
  // of creating a spellbook, adding a spell, removing a spell, and deleting the spellbook
  
  test('full spellbook lifecycle', async () => {
    // Mock the localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Set up a test component to test the spellbook context
    const TestHook = () => {
      const context = useContext(SpellbooksContext);
      return context;
    };
    
    // Step 1: Render the hook and verify initial state
    const { result } = renderHook(() => TestHook(), {
      wrapper: SpellbooksProvider
    });
    
    // Mock crypto.randomUUID for predictable IDs
    const mockUUID = 'mock-spellbook-id';
    vi.stubGlobal('crypto', {
      randomUUID: () => mockUUID
    });
    
    // Verify initial state: empty spellbooks array
    expect(result.current.spellbooks).toEqual([]);
    
    // Step 2: Create a new spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Test Spellbook',
        character: 'Test Character',
        description: 'Test Description',
        spells: []
      });
    });
    
    // Verify spellbook was created
    expect(result.current.spellbooks.length).toBe(1);
    expect(result.current.spellbooks[0].name).toBe('Test Spellbook');
    expect(result.current.spellbooks[0].character).toBe('Test Character');
    expect(result.current.spellbooks[0].id).toBe(mockUUID);
    
    // Step 3: Add a spell to the spellbook
    const testSpell = {
      spellName: 'Fireball',
      spellClass: 'elementalism',
      school: 'pyromancy',
      complexity: 'medium-complexity',
      flare: 'medium-flare',
      range: '30 feet',
      target: 'burst',
      action: 'Standard',
      duration: 'instant',
      keywords: 'fire, damage',
      check: 'Intelligence + Spellcraft',
      skill: 'Spellcraft',
      focus: 'Wand',
      spellType: 'Attack',
      description: 'A ball of fire that explodes on impact',
      altDescription: null
    };
    
    act(() => {
      result.current.addSpellToSpellbook(mockUUID, testSpell);
    });
    
    // Verify spell was added
    expect(result.current.spellbooks[0].spells.length).toBe(1);
    expect(result.current.spellbooks[0].spells[0].spellName).toBe('Fireball');
    
    // Step 4: Remove the spell from the spellbook
    act(() => {
      result.current.removeSpellFromSpellbook(mockUUID, 'Fireball');
    });
    
    // Verify spell was removed
    expect(result.current.spellbooks[0].spells.length).toBe(0);
    
    // Step 5: Delete the spellbook
    act(() => {
      result.current.deleteSpellbook(mockUUID);
    });
    
    // Verify spellbook was deleted
    expect(result.current.spellbooks.length).toBe(0);
  });
});
