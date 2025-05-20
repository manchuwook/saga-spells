import { describe, test, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SpellbooksProvider, SpellbooksContext } from '../context/SpellbooksContext';
import { useContext } from 'react';
import '@testing-library/jest-dom';

// Create a simple hook to test the spellbook context
const useTestSpellbooks = () => useContext(SpellbooksContext);

describe('Improved Spellbook Management Tests', () => {
  // Create a comprehensive test that verifies the complete lifecycle 
  // of creating a spellbook, adding a spell, removing a spell, and deleting the spellbook
  
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    window.localStorage.clear();
    
    // Mock crypto.randomUUID for predictable IDs
    vi.stubGlobal('crypto', {
      randomUUID: () => 'test-spellbook-id-123'
    });
  });
  
  test('full spellbook lifecycle with comprehensive validation', async () => {
    // Setup: Initialize the hook with the spellbooks context
    const { result } = renderHook(() => useTestSpellbooks(), {
      wrapper: SpellbooksProvider
    });
    
    // STEP 1: Verify initial state - empty spellbooks array
    expect(result.current.spellbooks).toEqual([]);
    
    // STEP 2: Create a new spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Advanced Test Spellbook',
        character: 'Test Mage Character',
        description: 'A comprehensive test spellbook',
        spells: []
      });
    });
    
    // Verify spellbook was created correctly
    expect(result.current.spellbooks.length).toBe(1);
    expect(result.current.spellbooks[0]).toMatchObject({
      id: 'test-spellbook-id-123',
      name: 'Advanced Test Spellbook',
      character: 'Test Mage Character',
      description: 'A comprehensive test spellbook',
      spells: []
    });
    
    // STEP 3: Add multiple spells to the spellbook
    const testSpell1 = {
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
    
    const testSpell2 = {
      spellName: 'Ice Shield',
      spellClass: 'elementalism',
      school: 'cryomancy',
      complexity: 'high-complexity',
      flare: 'low-flare',
      range: 'self',
      target: 'single-target',
      action: 'Quick',
      duration: 'scene',
      keywords: 'ice, protection',
      check: 'Intelligence + Evocation',
      skill: 'Evocation',
      focus: 'Staff',
      spellType: 'Defense',
      description: 'Creates a shield of ice that protects against attacks',
      altDescription: null
    };
    
    act(() => {
      result.current.addSpellToSpellbook('test-spellbook-id-123', testSpell1);
    });
    
    // Verify first spell was added
    expect(result.current.spellbooks[0].spells.length).toBe(1);
    expect(result.current.spellbooks[0].spells[0].spellName).toBe('Fireball');
    
    act(() => {
      result.current.addSpellToSpellbook('test-spellbook-id-123', testSpell2);
    });
    
    // Verify second spell was added
    expect(result.current.spellbooks[0].spells.length).toBe(2);
    expect(result.current.spellbooks[0].spells[1].spellName).toBe('Ice Shield');
    
    // STEP 4: Test direct retrieval of spellbook
    const spellbook = result.current.getSpellbook('test-spellbook-id-123');
    expect(spellbook).toBeTruthy();
    expect(spellbook?.name).toBe('Advanced Test Spellbook');
    expect(spellbook?.spells.length).toBe(2);
    
    // STEP 5: Test updating the spellbook
    act(() => {
      result.current.updateSpellbook('test-spellbook-id-123', {
        name: 'Updated Test Spellbook',
        character: 'Updated Character',
        description: 'Updated description'
      });
    });
    
    // Verify the update
    expect(result.current.spellbooks[0].name).toBe('Updated Test Spellbook');
    expect(result.current.spellbooks[0].character).toBe('Updated Character');
    expect(result.current.spellbooks[0].description).toBe('Updated description');
    
    // STEP 6: Remove spells one by one
    act(() => {
      result.current.removeSpellFromSpellbook('test-spellbook-id-123', 'Fireball');
    });
    
    // Verify first spell was removed
    expect(result.current.spellbooks[0].spells.length).toBe(1);
    expect(result.current.spellbooks[0].spells[0].spellName).toBe('Ice Shield');
    
    act(() => {
      result.current.removeSpellFromSpellbook('test-spellbook-id-123', 'Ice Shield');
    });
    
    // Verify all spells were removed
    expect(result.current.spellbooks[0].spells.length).toBe(0);
    
    // STEP 7: Delete the spellbook
    act(() => {
      result.current.deleteSpellbook('test-spellbook-id-123');
    });
    
    // Verify spellbook was deleted
    expect(result.current.spellbooks.length).toBe(0);
  });
  
  test('should handle spellbook operations with error cases', () => {
    // Setup: Initialize the hook with the spellbooks context
    const { result } = renderHook(() => useTestSpellbooks(), {
      wrapper: SpellbooksProvider
    });
    
    // Create a test spellbook
    act(() => {
      result.current.addSpellbook({
        name: 'Error Test Spellbook',
        character: 'Error Test Character',
        description: 'Testing error conditions',
        spells: []
      });
    });
    
    // Test case: Trying to add a spell to a non-existent spellbook ID
    act(() => {
      result.current.addSpellToSpellbook('non-existent-id', {
        spellName: 'Test Spell',
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
        description: 'A test spell',
        altDescription: null
      });
    });
    
    // Verify original spellbook is unaffected
    expect(result.current.spellbooks.length).toBe(1);
    expect(result.current.spellbooks[0].spells.length).toBe(0);
    
    // Test case: Trying to remove a spell that doesn't exist
    act(() => {
      result.current.removeSpellFromSpellbook('test-spellbook-id-123', 'Non-Existent Spell');
    });
    
    // Verify nothing changed
    expect(result.current.spellbooks[0].spells.length).toBe(0);
    
    // Test case: Trying to update a non-existent spellbook
    act(() => {
      result.current.updateSpellbook('non-existent-id', {
        name: 'New Name'
      });
    });
    
    // Verify original spellbook is unaffected
    expect(result.current.spellbooks[0].name).toBe('Error Test Spellbook');
    
    // Test case: Trying to delete a non-existent spellbook
    act(() => {
      result.current.deleteSpellbook('non-existent-id');
    });
    
    // Verify original spellbook still exists
    expect(result.current.spellbooks.length).toBe(1);
  });
});
