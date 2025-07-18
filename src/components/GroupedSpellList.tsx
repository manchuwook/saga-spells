import { Divider, SimpleGrid, Stack, Text, useMantineColorScheme } from '@mantine/core';
import { SpellGroup } from '../lib/spellGrouping';
import { Spell } from '../models/spells.zod';
import { SpellCard } from './SpellCard';
import { SpellCardWide } from './SpellCardWide';

interface GroupedSpellListProps {
  readonly groups: SpellGroup[];
  readonly viewMode: 'grid' | 'list';
  readonly onViewDetails: (spell: Spell) => void;
  readonly onRemoveFromSpellbook?: (spellName: string) => void;
  readonly onAddToSpellbook?: (spell: Spell) => void;
  readonly showRemoveButton?: boolean;
}

export function GroupedSpellList({
  groups,
  viewMode,
  onViewDetails,
  onRemoveFromSpellbook,
  onAddToSpellbook,
  showRemoveButton = false,
}: GroupedSpellListProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // If there's only one group called "All Spells", don't show group headers
  const showGroupHeaders = groups.length > 1 || groups[0]?.groupName !== 'All Spells';

  return (
    <Stack gap="xl">
      {groups.map((group) => (
        <div key={group.groupName}>
          {showGroupHeaders && (
            <>
              <Text
                size="lg"
                fw={600}
                c={isDark ? 'gray.1' : 'dark.8'}
                style={{ marginBottom: '8px' }}
              >
                {group.groupName} ({group.spells.length})
              </Text>
              <Divider mb="md" color={isDark ? 'dark.4' : 'gray.3'} />
            </>
          )}

          {viewMode === 'grid' ? (
            <SimpleGrid cols={{ base: 1, xs: 2, md: 3, lg: 4 }} spacing="md">
              {group.spells.map((spell) => (
                <SpellCard
                  key={spell.spellName}
                  spell={spell}
                  onViewDetails={onViewDetails}
                  onRemoveFromSpellbook={onRemoveFromSpellbook}
                  onAddToSpellbook={onAddToSpellbook}
                  showRemoveButton={showRemoveButton}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Stack gap="md">
              {group.spells.map((spell) => (
                <SpellCardWide
                  key={spell.spellName}
                  spell={spell}
                  onViewDetails={onViewDetails}
                  onRemoveFromSpellbook={onRemoveFromSpellbook}
                  onAddToSpellbook={onAddToSpellbook}
                  showRemoveButton={showRemoveButton}
                />
              ))}
            </Stack>
          )}
        </div>
      ))}
    </Stack>
  );
}
