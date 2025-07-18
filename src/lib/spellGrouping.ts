import { GroupingOption } from '../components/SpellGrouping';
import { Spell } from '../models/spells.zod';

export interface SpellGroup {
  groupName: string;
  spells: Spell[];
}

function categorizeAction(action: string): string {
  const actionLower = action.toLowerCase();

  if (actionLower.startsWith('stndrd')) {
    return 'Standard';
  } else if (actionLower.startsWith('cmplx')) {
    return 'Complex';
  } else if (actionLower.startsWith('boost')) {
    return 'Boost';
  } else if (actionLower.startsWith('surge')) {
    return 'Surge';
  } else if (actionLower.startsWith('reaction')) {
    return 'Reaction';
  } else if (actionLower.startsWith('prep')) {
    return 'Prep';
  } else if (actionLower.includes('prep pool')) {
    return 'Prep';
  } else if (actionLower.startsWith('narrative')) {
    return 'Narrative';
  } else if (actionLower.startsWith('modifier')) {
    return 'Modifier';
  } else {
    return 'Other';
  }
}

export function groupSpells(spells: Spell[], groupBy: GroupingOption): SpellGroup[] {
  if (groupBy === 'none') {
    return [
      {
        groupName: 'All Spells',
        spells: [...spells].sort((a, b) => a.spellName.localeCompare(b.spellName)),
      },
    ];
  }

  const groups = new Map<string, Spell[]>();

  spells.forEach((spell) => {
    let key: string;

    switch (groupBy) {
      case 'class':
        key = spell.spellClass;
        break;
      case 'school':
        key = spell.school;
        break;
      case 'action':
        key = categorizeAction(spell.action);
        break;
      default:
        key = 'Other';
    }

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(spell);
  });

  // Sort each group's spells alphabetically
  groups.forEach((spells) => {
    spells.sort((a, b) => a.spellName.localeCompare(b.spellName));
  });

  // Convert to array and sort groups by name
  return Array.from(groups.entries())
    .map(([groupName, spells]) => ({ groupName, spells }))
    .sort((a, b) => a.groupName.localeCompare(b.groupName));
}
