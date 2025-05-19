// filepath: x:\dev\saga-spells\src\pages\SpellbookDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Title, 
  Text, 
  Group, 
  Button, 
  Tabs, 
  SimpleGrid, 
  Card, 
  Stack, 
  useMantineColorScheme,
  Paper
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconEdit, IconPlus, IconSearch } from '@tabler/icons-react';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { SpellCard } from '../components/SpellCard';
import { SpellDetailsModal } from '../components/SpellDetailsModal';
import { EditSpellbookModal } from '../components/EditSpellbookModal';
import { SpellbookExportButton } from '../components/SpellbookExportButton';
import { Spell } from '../../spells.zod';
import { useSpells } from '../hooks/useSpells';
import { SpellsFilter } from '../components/SpellsFilter';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export default function SpellbookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpellbook, removeSpellFromSpellbook, addSpellToSpellbook } = useSpellbooks();
  const { data: allSpells } = useSpells();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const spellbook = id ? getSpellbook(id) : undefined;
  const [activeTab, setActiveTab] = useState<string | null>('spells');
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);
  
  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  if (!spellbook) {
    return (
      <Container size="md" py="xl">
        <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
          <Title order={2} ta="center" mb="md" c={isDark ? 'gray.1' : 'dark.8'}>Spellbook Not Found</Title>
          <Text ta="center" mb="xl" c={isDark ? 'gray.3' : 'dark.6'}>The spellbook you're looking for doesn't exist or has been deleted.</Text>
          <Group justify="center">
            <Button onClick={() => navigate('/spellbooks')} color={isDark ? 'blue.4' : 'blue.6'}>
              Back to Spellbooks
            </Button>
          </Group>
        </Paper>
      </Container>
    );
  }

  const handleViewDetails = (spell: Spell) => {
    setSelectedSpell(spell);
    openDetailsModal();
  };

  const handleRemoveSpell = (spellName: string) => {
    modals.openConfirmModal({
      title: 'Remove Spell',
      children: (
        <Text size="sm">
          Are you sure you want to remove "{spellName}" from this spellbook?
        </Text>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (id) {
          removeSpellFromSpellbook(id, spellName);
          notifications.show({
            title: 'Spell Removed',
            message: `${spellName} has been removed from ${spellbook.name}`,
            color: 'red',
          });
        }
      },
    });
  };

  const handleAddSpell = (spell: Spell) => {
    if (id) {
      addSpellToSpellbook(id, spell);
      notifications.show({
        title: 'Spell Added',
        message: `${spell.spellName} has been added to ${spellbook.name}`,
        color: 'green',
      });
      // Switch to the spells tab
      setActiveTab('spells');
    }
  };

  // Filter out spells that are already in the spellbook
  const availableSpells = allSpells?.filter(
    spell => !spellbook.spells.some(s => s.spellName === spell.spellName)
  ) || [];

  return (
    <Container size="xl" py="xl">
      <Group mb="md">
        <Button 
          variant="subtle" 
          leftSection={<IconArrowLeft size={16} />}
          onClick={() => navigate('/spellbooks')}
          color={isDark ? 'gray.4' : 'dark.4'}
        >
          Back to Spellbooks
        </Button>
      </Group>
      
      <Group justify="space-between" mb="xl">
        <Stack gap={0}>
          <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>{spellbook.name}</Title>
          <Text size="lg" c={isDark ? 'gray.5' : 'dimmed'}>Character: {spellbook.character}</Text>
        </Stack>
        <Group>
          <Button 
            variant="outline" 
            leftSection={<IconEdit size={16} />}
            onClick={openEditModal}
            color={isDark ? 'blue.4' : 'blue.6'}
          >
            Edit Spellbook
          </Button>
          <SpellbookExportButton spellbook={spellbook} label="Export Spellbook" />
        </Group>
      </Group>
      
      {spellbook.description && (
        <Text mb="xl" c={isDark ? 'gray.3' : 'dark.7'}>{spellbook.description}</Text>
      )}
      
      <Tabs 
        value={activeTab} 
        onChange={setActiveTab}
        styles={{
          tab: {
            color: isDark ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-dark-6)',
            '&[data-active]': {
              color: isDark ? 'var(--mantine-color-blue-4)' : 'var(--mantine-color-blue-6)',
            },
          },
        }}
      >
        <Tabs.List mb="xl">
          <Tabs.Tab value="spells" leftSection={<IconSearch size={16} />}>
            Spellbook Contents ({spellbook.spells.length})
          </Tabs.Tab>
          <Tabs.Tab value="add-spells" leftSection={<IconPlus size={16} />}>
            Add Spells
          </Tabs.Tab>
        </Tabs.List>
        
        <Tabs.Panel value="spells">
          {spellbook.spells.length === 0 ? (
            <Card withBorder p="xl" ta="center" bg={isDark ? 'dark.6' : 'white'}>
              <Text size="lg" fw={500} mb="md" c={isDark ? 'gray.1' : 'dark.8'}>
                This spellbook is empty
              </Text>
              <Text mb="xl" c={isDark ? 'gray.3' : 'dark.6'}>
                Go to the "Add Spells" tab to start adding spells to this spellbook.
              </Text>
              <Button onClick={() => setActiveTab('add-spells')} color={isDark ? 'blue.4' : 'blue.6'}>Add Spells</Button>
            </Card>
          ) : (
            <SimpleGrid
              cols={{ base: 1, xs: 2, md: 3, lg: 4 }}
              spacing="md"
            >
              {spellbook.spells.map((spell) => (
                <SpellCard
                  key={spell.spellName}
                  spell={spell}
                  onViewDetails={handleViewDetails}
                  onRemoveFromSpellbook={handleRemoveSpell}
                  showRemoveButton
                />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
        
        <Tabs.Panel value="add-spells">
          <Stack gap="lg">
            <SpellsFilter 
              spells={availableSpells} 
              onFilterChange={setFilteredSpells} 
            />
            
            <Text c={isDark ? 'gray.3' : 'dark.7'}>
              {filteredSpells.length} available {filteredSpells.length === 1 ? 'spell' : 'spells'}
            </Text>
            
            <SimpleGrid
              cols={{ base: 1, xs: 2, md: 3, lg: 4 }}
              spacing="md"
            >
              {filteredSpells.map((spell) => (
                <SpellCard
                  key={spell.spellName}
                  spell={spell}
                  onViewDetails={handleViewDetails}
                  onAddToSpellbook={handleAddSpell}
                />
              ))}
            </SimpleGrid>
          </Stack>
        </Tabs.Panel>
      </Tabs>
      
      <SpellDetailsModal
        spell={selectedSpell}
        opened={detailsModalOpened}
        onClose={closeDetailsModal}
      />
      
      <EditSpellbookModal
        spellbook={spellbook}
        opened={editModalOpened}
        onClose={closeEditModal}
      />
    </Container>
  );
}
