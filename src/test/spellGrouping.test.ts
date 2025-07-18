import { describe, expect, it } from 'vitest';
import { groupSpells } from '../lib/spellGrouping';
import { Spell } from '../models/spells.zod';

// Mock spell data for testing
const mockSpells: Spell[] = [
  {
    spellName: 'Fireball',
    spellClass: 'Elementalism',
    school: 'Pyromancy',
    action: 'Stndrd (30T)',
    complexity: 3,
    flare: 4,
    range: '30 feet',
    target: 'Area',
    duration: 'Instant',
    keywords: 'Fire, Damage',
    check: 'Focus Magic',
    skill: 'Focus Magic',
    focus: 'Manipulate',
    spellType: 'Spell',
    description: 'A ball of fire that explodes on impact',
    altDescription: null,
  },
  {
    spellName: 'Magic Missile',
    spellClass: 'Elementalism',
    school: 'Force',
    action: 'Cmplx (45T)',
    complexity: 1,
    flare: 2,
    range: '60 feet',
    target: 'Single',
    duration: 'Instant',
    keywords: 'Force, Magic',
    check: 'Focus Magic',
    skill: 'Focus Magic',
    focus: 'Manipulate',
    spellType: 'Spell',
    description: 'Unerring bolts of magical force',
    altDescription: null,
  },
  {
    spellName: 'Heal',
    spellClass: 'Animism',
    school: 'Restoration',
    action: 'Boost (M)',
    complexity: 2,
    flare: 3,
    range: 'Touch',
    target: 'Single',
    duration: 'Instant',
    keywords: 'Healing',
    check: 'Blood Magic',
    skill: 'Blood Magic',
    focus: 'Morphic',
    spellType: 'Spell',
    description: 'Heals damage to a living creature',
    altDescription: null,
  },
  {
    spellName: 'Lightning Bolt',
    spellClass: 'Elementalism',
    school: 'Aeromancy',
    action: 'Surge (1RP)',
    complexity: 4,
    flare: 5,
    range: '100 feet',
    target: 'Line',
    duration: 'Instant',
    keywords: 'Lightning, Damage',
    check: 'Focus Magic',
    skill: 'Focus Magic',
    focus: 'Manipulate',
    spellType: 'Spell',
    description: 'A bolt of lightning strikes in a line',
    altDescription: null,
  },
  {
    spellName: 'Shield',
    spellClass: 'Sorcery',
    school: 'Alchemy',
    action: 'Reaction (G+15T)',
    complexity: 2,
    flare: 2,
    range: 'Self',
    target: 'Personal',
    duration: 'Instant',
    keywords: 'Defense',
    check: 'Axiomatic Magic',
    skill: 'Axiomatic Magic',
    focus: 'Formulae',
    spellType: 'Spell',
    description: 'Creates a protective barrier',
    altDescription: null,
  },
  {
    spellName: 'Enchanted Weapon',
    spellClass: 'Sorcery',
    school: 'Alchemy',
    action: 'Prep (1)',
    complexity: 3,
    flare: 3,
    range: 'Touch',
    target: 'Single',
    duration: 'Scene',
    keywords: 'Enchantment',
    check: 'Axiomatic Magic',
    skill: 'Axiomatic Magic',
    focus: 'Formulae',
    spellType: 'Spell',
    description: 'Enchants a weapon with magical properties',
    altDescription: null,
  },
];

describe('groupSpells', () => {
  it('should return all spells in one group when groupBy is "none"', () => {
    const result = groupSpells(mockSpells, 'none');

    expect(result).toHaveLength(1);
    expect(result[0].groupName).toBe('All Spells');
    expect(result[0].spells).toHaveLength(6);
    expect(result[0].spells[0].spellName).toBe('Enchanted Weapon'); // Should be sorted alphabetically
  });

  it('should group spells by class', () => {
    const result = groupSpells(mockSpells, 'class');

    expect(result).toHaveLength(3);

    const animismGroup = result.find((g) => g.groupName === 'Animism');
    const elementalismGroup = result.find((g) => g.groupName === 'Elementalism');
    const sorceryGroup = result.find((g) => g.groupName === 'Sorcery');

    expect(animismGroup).toBeDefined();
    expect(animismGroup!.spells).toHaveLength(1);
    expect(animismGroup!.spells[0].spellName).toBe('Heal');

    expect(elementalismGroup).toBeDefined();
    expect(elementalismGroup!.spells).toHaveLength(3);
    // Should be sorted alphabetically within group
    expect(elementalismGroup!.spells[0].spellName).toBe('Fireball');
    expect(elementalismGroup!.spells[1].spellName).toBe('Lightning Bolt');
    expect(elementalismGroup!.spells[2].spellName).toBe('Magic Missile');

    expect(sorceryGroup).toBeDefined();
    expect(sorceryGroup!.spells).toHaveLength(2);
    expect(sorceryGroup!.spells[0].spellName).toBe('Enchanted Weapon');
    expect(sorceryGroup!.spells[1].spellName).toBe('Shield');
  });

  it('should group spells by school', () => {
    const result = groupSpells(mockSpells, 'school');

    expect(result).toHaveLength(5); // Pyromancy, Force, Restoration, Aeromancy, Alchemy

    const schools = result.map((g) => g.groupName).sort();
    expect(schools).toEqual(['Aeromancy', 'Alchemy', 'Force', 'Pyromancy', 'Restoration']);
  });

  it('should group spells by action type (generalized)', () => {
    const result = groupSpells(mockSpells, 'action');

    expect(result).toHaveLength(6); // Standard, Complex, Boost, Surge, Reaction, Prep

    const standardGroup = result.find((g) => g.groupName === 'Standard');
    const complexGroup = result.find((g) => g.groupName === 'Complex');
    const boostGroup = result.find((g) => g.groupName === 'Boost');
    const surgeGroup = result.find((g) => g.groupName === 'Surge');
    const reactionGroup = result.find((g) => g.groupName === 'Reaction');
    const prepGroup = result.find((g) => g.groupName === 'Prep');

    expect(standardGroup).toBeDefined();
    expect(standardGroup!.spells).toHaveLength(1);
    expect(standardGroup!.spells[0].spellName).toBe('Fireball');

    expect(complexGroup).toBeDefined();
    expect(complexGroup!.spells).toHaveLength(1);
    expect(complexGroup!.spells[0].spellName).toBe('Magic Missile');

    expect(boostGroup).toBeDefined();
    expect(boostGroup!.spells).toHaveLength(1);
    expect(boostGroup!.spells[0].spellName).toBe('Heal');

    expect(surgeGroup).toBeDefined();
    expect(surgeGroup!.spells).toHaveLength(1);
    expect(surgeGroup!.spells[0].spellName).toBe('Lightning Bolt');

    expect(reactionGroup).toBeDefined();
    expect(reactionGroup!.spells).toHaveLength(1);
    expect(reactionGroup!.spells[0].spellName).toBe('Shield');

    expect(prepGroup).toBeDefined();
    expect(prepGroup!.spells).toHaveLength(1);
    expect(prepGroup!.spells[0].spellName).toBe('Enchanted Weapon');
  });

  it('should sort spells alphabetically within each group', () => {
    const result = groupSpells(mockSpells, 'class');

    const elementalismGroup = result.find((g) => g.groupName === 'Elementalism');
    expect(elementalismGroup!.spells[0].spellName).toBe('Fireball');
    expect(elementalismGroup!.spells[1].spellName).toBe('Lightning Bolt');
  });

  it('should sort groups alphabetically', () => {
    const result = groupSpells(mockSpells, 'class');

    expect(result[0].groupName).toBe('Animism');
    expect(result[1].groupName).toBe('Elementalism');
    expect(result[2].groupName).toBe('Sorcery');
  });

  describe('action categorization', () => {
    it('should correctly categorize various action types', () => {
      const testSpells: Spell[] = [
        { ...mockSpells[0], spellName: 'Standard Test', action: 'Stndrd (30T)' },
        { ...mockSpells[0], spellName: 'Standard Test 2', action: 'Stndrd (25T+M)' },
        { ...mockSpells[0], spellName: 'Complex Test', action: 'Cmplx (45T)' },
        { ...mockSpells[0], spellName: 'Complex Test 2', action: 'Cmplx (60T+1RP)' },
        { ...mockSpells[0], spellName: 'Boost Test', action: 'Boost (M)' },
        { ...mockSpells[0], spellName: 'Boost Test 2', action: 'Boost (M+10T)' },
        { ...mockSpells[0], spellName: 'Surge Test', action: 'Surge (1RP)' },
        { ...mockSpells[0], spellName: 'Surge Test 2', action: 'Surge (M)' },
        { ...mockSpells[0], spellName: 'Reaction Test', action: 'Reaction (G+15T)' },
        { ...mockSpells[0], spellName: 'Reaction Test 2', action: 'Reaction (5T+G+M)' },
        { ...mockSpells[0], spellName: 'Prep Test', action: 'Prep (1)' },
        { ...mockSpells[0], spellName: 'Prep Test 2', action: '4 Prep Pool' },
        { ...mockSpells[0], spellName: 'Prep Test 3', action: '2 Prep Pool per yard in Diameter' },
        { ...mockSpells[0], spellName: 'Narrative Test', action: 'Narrative' },
      ];

      const result = groupSpells(testSpells, 'action');

      expect(result).toHaveLength(7); // Standard, Complex, Boost, Surge, Reaction, Prep, Narrative

      const groupNames = result.map((g) => g.groupName).sort();
      expect(groupNames).toEqual([
        'Boost',
        'Complex',
        'Narrative',
        'Prep',
        'Reaction',
        'Standard',
        'Surge',
      ]);

      // Check specific categorizations
      const standardGroup = result.find((g) => g.groupName === 'Standard');
      expect(standardGroup!.spells).toHaveLength(2);

      const complexGroup = result.find((g) => g.groupName === 'Complex');
      expect(complexGroup!.spells).toHaveLength(2);

      const boostGroup = result.find((g) => g.groupName === 'Boost');
      expect(boostGroup!.spells).toHaveLength(2);

      const surgeGroup = result.find((g) => g.groupName === 'Surge');
      expect(surgeGroup!.spells).toHaveLength(2);

      const reactionGroup = result.find((g) => g.groupName === 'Reaction');
      expect(reactionGroup!.spells).toHaveLength(2);

      const prepGroup = result.find((g) => g.groupName === 'Prep');
      expect(prepGroup!.spells).toHaveLength(3);

      const narrativeGroup = result.find((g) => g.groupName === 'Narrative');
      expect(narrativeGroup!.spells).toHaveLength(1);
    });
  });
});
