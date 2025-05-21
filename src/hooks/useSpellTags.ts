import { useQuery } from '@tanstack/react-query';

interface SpellTag {
  name: string;
  tag: string;
  description: string;
  matches?: string[];
}

interface SpellTagsData {
  tags: SpellTag[];
}

async function fetchSpellTags(): Promise<SpellTagsData> {
  const response = await fetch('/spells.tags.json');
  if (!response.ok) {
    throw new Error('Failed to fetch spell tags');
  }
  
  const data = await response.json();
  
  // Sort tags alphabetically by name
  data.tags = data.tags.sort((a: SpellTag, b: SpellTag) => a.name.localeCompare(b.name));
  
  return data;
}

export function useSpellTags() {
  return useQuery({
    queryKey: ['spellTags'],
    queryFn: fetchSpellTags,
  });
}
