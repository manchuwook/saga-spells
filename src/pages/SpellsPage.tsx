// filepath: x:\dev\saga-spells\src\pages\SpellsPage.tsx
import { useState, useEffect } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Loader, 
  Center, 
  SimpleGrid, 
  Group, 
  useMantineColorScheme,
  Paper
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useSpells } from '../hooks/useSpells';
import { SpellCard } from '../components/SpellCard';
import { SpellDetailsModal } from '../components/SpellDetailsModal';
import { AddToSpellbookModal } from '../components/AddToSpellbookModal';
import { SpellsFilter } from '../components/SpellsFilter';
import { ExportButton } from '../components/ExportButton';
import { Spell } from '../models/spells.zod';

export default function SpellsPage() {
  const { data: spells, isLoading, error } = useSpells();
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [spellbookModalOpened, { open: openSpellbookModal, close: closeSpellbookModal }] = useDisclosure(false);

  // Initialize filtered spells when data is loaded
  useEffect(() => {
    if (spells) {
      setFilteredSpells(spells);
    }
  }, [spells]);

  const handleViewDetails = (spell: Spell) => {
    setSelectedSpell(spell);
    openDetailsModal();
  };

  const handleAddToSpellbook = (spell: Spell) => {
    setSelectedSpell(spell);
    openSpellbookModal();
  };

  if (isLoading) {
    return (
      <Center h="70vh">
        <Loader size="xl" color={isDark ? 'blue.4' : 'blue.6'} />
      </Center>
    );
  }

  if (error) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
          <Title order={2} ta="center" c="red" mb="xl">
            Error Loading Spells
          </Title>
          <Text ta="center" c={isDark ? 'gray.2' : 'dark.7'}>
            {error instanceof Error ? error.message : 'An unknown error occurred'}
          </Text>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>Spells Library</Title>
        <ExportButton spells={filteredSpells} label="Export Spells" />
      </Group>
      
      <SpellsFilter 
        spells={spells || []} 
        onFilterChange={setFilteredSpells} 
      />
      
      <Text mt="md" mb="md" c={isDark ? 'gray.3' : 'dark.7'}>
        {filteredSpells.length} {filteredSpells.length === 1 ? 'spell' : 'spells'} found
      </Text>
      
      <SimpleGrid
        cols={{ base: 1, xs: 2, md: 3, lg: 4 }}
        spacing="md"
        mt="xl"
      >
        {filteredSpells.map((spell) => (
          <SpellCard
            key={spell.spellName}
            spell={spell}
            onViewDetails={handleViewDetails}
            onAddToSpellbook={handleAddToSpellbook}
          />
        ))}
      </SimpleGrid>
      
      <SpellDetailsModal
        spell={selectedSpell}
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
      />
      
      <AddToSpellbookModal
        spell={selectedSpell}
        opened={spellbookModalOpened}
        onClose={closeSpellbookModal}
      />
    </Container>
  );
}
