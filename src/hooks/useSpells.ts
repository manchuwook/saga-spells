import { useQuery } from '@tanstack/react-query';
import { validateSpells, type Spell } from '../models/spells.zod';

async function fetchSpells(): Promise<Spell[]> {
  const response = await fetch('/spells.json');
  if (!response.ok) {
    throw new Error('Failed to fetch spells');
  }
  
  const data = await response.json();
  const validatedSpells = validateSpells(data);
  
  // Sort spells alphabetically by name
  return validatedSpells.sort((a, b) => a.spellName.localeCompare(b.spellName));
}

export function useSpells() {
  return useQuery({
    queryKey: ['spells'],
    queryFn: fetchSpells,
  });
}
