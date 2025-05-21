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
  Paper
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft, IconEdit, IconPlus, IconSearch, IconBooks } from '@tabler/icons-react';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { SpellCard } from '../components/SpellCard';
import { SpellDetailsModal } from '../components/SpellDetailsModal';
import { EditSpellbookModal } from '../components/EditSpellbookModal';
import { SpellbookExportButton } from '../components/SpellbookExportButton';
import { Spell } from '../models/spells.zod';
import { useSpells } from '../hooks/useSpells';
import { SpellsFilter } from '../components/SpellsFilter';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';

export default function SpellbookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getSpellbook, removeSpellFromSpellbook, addSpellToSpellbook } = useSpellbooks();
  const { data: allSpells } = useSpells();
  const { isDark, styleService } = useStyles();

  const spellbook = id ? getSpellbook(id) : undefined;
  const [activeTab, setActiveTab] = useState<string | null>('spells');
  const [selectedSpell, setSelectedSpell] = useState<Spell | null>(null);
  const [filteredSpells, setFilteredSpells] = useState<Spell[]>([]);

  const [detailsModalOpened, { open: openDetailsModal, close: closeDetailsModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  if (!spellbook) {
    return (
      <Container size="md" py="xl">        <Paper p="xl" withBorder radius="md" bg={isDark ? 'dark.6' : 'white'}>
        <Title order={2} ta="center" mb="md" c={isDark ? 'white' : 'dark.8'}>Spellbook Not Found</Title>
        <Text ta="center" mb="xl" c={isDark ? 'white' : 'dark.6'} fw={isDark ? 500 : 400}>The spellbook you're looking for doesn't exist or has been deleted.</Text>
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
  }; const handleRemoveSpell = (spellName: string) => {
    // Get modal styles from style service
    const modalStyles = styleService.getModalStyles();

    modals.openConfirmModal({
      title: <Text c={isDark ? 'white' : 'dark.9'} fw={700}>Remove Spell</Text>,
      children: (
        <Text size="sm" c={isDark ? 'gray.2' : 'dark.7'}>
          Are you sure you want to remove "{spellName}" from this spellbook?
        </Text>
      ),
      labels: { confirm: 'Remove', cancel: 'Cancel' },
      confirmProps: { color: isDark ? 'red.4' : 'red.6' },
      cancelProps: { color: isDark ? 'gray.4' : 'gray.6' },
      overlayProps: modalStyles.overlayProps,
      styles: {
        header: modalStyles.header,
        content: modalStyles.content,
        body: modalStyles.body,
        close: modalStyles.close
      },
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
  }; const handleAddSpell = (spell: Spell) => {
    if (id) {
      addSpellToSpellbook(id, spell);

      // Get notification styles from style service
      const notificationStyles = styleService.getNotificationStyles('green');

      notifications.show({
        title: 'Spell Added',
        message: `${spell.spellName} has been added to ${spellbook.name}`,
        color: notificationStyles.color,
        icon: <IconBooks size={20} />,
        autoClose: notificationStyles.autoClose,
        withBorder: notificationStyles.withBorder,
        style: notificationStyles.style,
      });
      // Removed auto-switching to spells tab to keep user on add-spells tab
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
      </Group>      <Group justify="space-between" mb="xl">
        <Stack gap={0}>
          <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>{spellbook.name}</Title>
          <Text size="lg" c={isDark ? 'gray.3' : 'dimmed'} fw={isDark ? 500 : 400}>Character: {spellbook.character}</Text>
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
      </Group>      {spellbook.description && (
        <Text mb="xl" c={isDark ? 'white' : 'dark.7'} fw={isDark ? 500 : 400}>{spellbook.description}</Text>
      )}
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        styles={styleService.getTabsStyles()}      >
        <Tabs.List mb="xl" bg={isDark ? 'dark.6' : 'white'} style={isDark ? { borderRadius: '4px' } : undefined}>
          <Tabs.Tab value="spells" style={{ color: isDark ? 'white' : 'black' }} leftSection={<IconSearch size={16} />}>
            Spellbook Contents ({spellbook.spells.length})
          </Tabs.Tab>
          <Tabs.Tab value="add-spells" style={{ color: isDark ? 'white' : 'black' }} leftSection={<IconPlus size={16} />}>
            Add Spells
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="spells">
          {spellbook.spells.length === 0 ? (<Card withBorder p="xl" ta="center" bg={isDark ? 'dark.6' : 'white'}>
            <Text size="lg" fw={500} mb="md" c={isDark ? 'gray.1' : 'dark.8'}>
              This spellbook is empty
            </Text>
            <Text mb="xl" c={isDark ? 'white' : 'dark.6'} fw={isDark ? 500 : 400}>
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
            />            <Text c={isDark ? 'white' : 'dark.7'} fw={isDark ? 500 : 400}>
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
