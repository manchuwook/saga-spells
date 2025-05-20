import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { SpellbooksProvider } from '../context/SpellbooksContext';
import { Spell } from '../models/spells.zod';
import { ReactNode } from 'react';

// Test wrapper component for the context
const wrapper = ({ children }: { children: ReactNode }) => (
  <SpellbooksProvider>{children}</SpellbooksProvider>
);

// Sample spell data for testing
const testSpell: Spell = {
  spellName: 'Test Spell',
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
  spellType: 'Attack',
  description: 'A test spell that shoots fire',
  altDescription: null,
};

describe('useSpellbooks Hook', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    window.localStorage.clear();
    
    // Mock crypto.randomUUID for consistent IDs in tests
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-uuid-123'
    });
  });

  test('should create a spellbook, add a spell, remove a spell, and delete the spellbook', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useSpellbooks(), { wrapper });

    // Verify initial state: empty spellbooks array
    expect(result.current.spellbooks).toEqual([]);

    // Step 1: Create a new spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Test Spellbook',
        character: 'Test Character',
        description: 'Test Description',
        spells: [],
      });
    });

    // Verify spellbook was created with correct data
    expect(result.current.spellbooks).toHaveLength(1);
    expect(result.current.spellbooks[0]).toMatchObject({
      id: 'test-uuid-123',
      name: 'Test Spellbook',
      character: 'Test Character',
      description: 'Test Description',
      spells: [],
    });
    expect(result.current.spellbooks[0].createdAt).toBeInstanceOf(Date);
    expect(result.current.spellbooks[0].updatedAt).toBeInstanceOf(Date);

    // Step 2: Add a spell to the spellbook
    act(() => {
      result.current.addSpellToSpellbook('test-uuid-123', testSpell);
    });

    // Verify spell was added
    expect(result.current.spellbooks[0].spells).toHaveLength(1);
    expect(result.current.spellbooks[0].spells[0]).toEqual(testSpell);

    // Step 3: Remove the spell from the spellbook
    act(() => {
      result.current.removeSpellFromSpellbook('test-uuid-123', 'Test Spell');
    });

    // Verify spell was removed
    expect(result.current.spellbooks[0].spells).toHaveLength(0);

    // Step 4: Delete the spellbook
    act(() => {
      result.current.deleteSpellbook('test-uuid-123');
    });

    // Verify spellbook was deleted
    expect(result.current.spellbooks).toHaveLength(0);
  });

  test('should not add duplicate spells to a spellbook', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useSpellbooks(), { wrapper });

    // Create a spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Test Spellbook',
        character: 'Test Character',
        description: 'Test Description',
        spells: [],
      });
    });

    // Add a spell
    act(() => {
      result.current.addSpellToSpellbook('test-uuid-123', testSpell);
    });

    // Try to add the same spell again
    act(() => {
      result.current.addSpellToSpellbook('test-uuid-123', testSpell);
    });

    // Verify the spell was added only once
    expect(result.current.spellbooks[0].spells).toHaveLength(1);
  });

  test('should correctly update a spellbook', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useSpellbooks(), { wrapper });

    // Create a spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Test Spellbook',
        character: 'Test Character',
        description: 'Test Description',
        spells: [],
      });
    });

    // Update the spellbook
    act(() => {
      result.current.updateSpellbook('test-uuid-123', {
        name: 'Updated Spellbook',
        character: 'Updated Character',
        description: 'Updated Description',
      });
    });

    // Verify the update
    expect(result.current.spellbooks[0].name).toBe('Updated Spellbook');
    expect(result.current.spellbooks[0].character).toBe('Updated Character');
    expect(result.current.spellbooks[0].description).toBe('Updated Description');
  });

  test('should correctly retrieve a spellbook by id', () => {
    // Initialize the hook with context
    const { result } = renderHook(() => useSpellbooks(), { wrapper });

    // Create a spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Test Spellbook',
        character: 'Test Character',
        description: 'Test Description',
        spells: [],
      });
    });

    // Get the spellbook by ID
    const spellbook = result.current.getSpellbook('test-uuid-123');

    // Verify the retrieved spellbook
    expect(spellbook).toBeDefined();
    expect(spellbook?.name).toBe('Test Spellbook');
    expect(spellbook?.character).toBe('Test Character');
  });
});
