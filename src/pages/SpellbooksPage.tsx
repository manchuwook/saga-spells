// filepath: x:\dev\saga-spells\src\pages\SpellbooksPage.tsx
import { useState } from 'react';
import { 
  Container, 
  Title, 
  Text, 
  Card, 
  Group, 
  Button, 
  SimpleGrid, 
  Badge, 
  Stack, 
  ActionIcon, 
  Tooltip,
  useMantineColorScheme
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { IconEye, IconEdit, IconTrash, IconPlus } from '@tabler/icons-react';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spellbook } from '../context/SpellbooksContext';
import { NewSpellbookModal } from '../components/NewSpellbookModal';
import { EditSpellbookModal } from '../components/EditSpellbookModal';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';

export default function SpellbooksPage() {
  const { spellbooks, deleteSpellbook } = useSpellbooks();
  const navigate = useNavigate();
  const [selectedSpellbook, setSelectedSpellbook] = useState<Spellbook | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [newModalOpened, { open: openNewModal, close: closeNewModal }] = useDisclosure(false);
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);

  const handleEditSpellbook = (spellbook: Spellbook) => {
    setSelectedSpellbook(spellbook);
    openEditModal();
  };

  const handleViewSpellbook = (id: string) => {
    navigate(`/spellbooks/${id}`);
  };
  const handleDeleteSpellbook = (spellbook: Spellbook) => {
    modals.openConfirmModal({
      title: <Text c={isDark ? 'white' : 'dark.9'} fw={700}>Delete Spellbook</Text>,
      children: (
        <Text size="sm" c={isDark ? 'gray.2' : 'dark.7'}>
          Are you sure you want to delete "{spellbook.name}" for {spellbook.character}? 
          This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: isDark ? 'red.4' : 'red.6' },
      cancelProps: { color: isDark ? 'gray.4' : 'gray.6' },
      overlayProps: {
        backgroundOpacity: 0.65,
        blur: 3,
        color: isDark ? 'black' : '#e6d9c2',
      },
      styles: {
        header: { 
          backgroundColor: isDark ? '#1A1B1E' : 'white',
          color: isDark ? 'white' : 'black',
          borderBottom: isDark ? '1px solid #2C2E33' : 'inherit',
        },
        content: { 
          backgroundColor: isDark ? '#1A1B1E' : 'white',
        },
        body: {
          backgroundColor: isDark ? '#1A1B1E' : 'white',
        },
        close: {
          color: isDark ? 'white' : 'black',
        }
      },
      onConfirm: () => {
        deleteSpellbook(spellbook.id);
        notifications.show({
          title: 'Spellbook Deleted',
          message: `${spellbook.name} has been deleted`,
          color: 'red',
        });
      },
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Container size="xl" py="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1} c={isDark ? 'gray.1' : 'dark.8'}>My Spellbooks</Title>
        <Button 
          leftSection={<IconPlus size={16} />} 
          onClick={openNewModal}
          color={isDark ? 'blue.4' : 'blue.6'}
        >
          New Spellbook
        </Button>
      </Group>
      
      {spellbooks.length === 0 ? (
        <Card withBorder p="xl" ta="center" bg={isDark ? 'dark.6' : 'white'}>
          <Text size="lg" fw={500} mb="md" c={isDark ? 'gray.1' : 'dark.8'}>
            You don't have any spellbooks yet
          </Text>
          <Text mb="xl" c={isDark ? 'gray.3' : 'dark.6'}>
            Create your first spellbook to start collecting spells for your character.
          </Text>
          <Button onClick={openNewModal} color={isDark ? 'blue.4' : 'blue.6'}>Create Spellbook</Button>
        </Card>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing="md"
        >
          {spellbooks.map((spellbook) => (
            <Card 
              key={spellbook.id} 
              withBorder 
              shadow="sm" 
              padding="md" 
              radius="md"
              bg={isDark ? 'dark.6' : 'white'}
              style={{ 
                borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'
              }}
            >
              <Stack gap="xs">
                <Group justify="space-between">
                  <Title order={3} c={isDark ? 'gray.1' : 'dark.8'}>{spellbook.name}</Title>
                  <Group gap={5}>
                    <Tooltip label="View Spellbook">
                      <ActionIcon
                        variant="subtle"
                        color={isDark ? 'blue.4' : 'blue.6'}
                        onClick={() => handleViewSpellbook(spellbook.id)}
                      >
                        <IconEye size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Edit Spellbook">
                      <ActionIcon
                        variant="subtle"
                        color={isDark ? 'yellow.4' : 'yellow.6'}
                        onClick={() => handleEditSpellbook(spellbook)}
                      >
                        <IconEdit size={16} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Delete Spellbook">
                      <ActionIcon
                        variant="subtle"
                        color={isDark ? 'red.4' : 'red.6'}
                        onClick={() => handleDeleteSpellbook(spellbook)}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
                <Text fw={500} c={isDark ? 'gray.4' : 'gray.7'}>
                  Character: {spellbook.character}
                </Text>
                
                <Group>
                  <Badge color={isDark ? 'green.4' : 'green.6'}>
                    {spellbook.spells.length} {spellbook.spells.length === 1 ? 'spell' : 'spells'}
                  </Badge>
                  <Text size="xs" c={isDark ? 'gray.5' : 'gray.6'}>
                    Updated: {formatDate(spellbook.updatedAt)}
                  </Text>
                </Group>
                
                {spellbook.description && (
                  <Text lineClamp={2} size="sm" c={isDark ? 'gray.3' : 'dark.7'}>
                    {spellbook.description}
                  </Text>
                )}
                
                <Button 
                  variant="light" 
                  fullWidth
                  onClick={() => handleViewSpellbook(spellbook.id)}
                  mt="md"
                  color={isDark ? 'blue.4' : 'blue.6'}
                >
                  Open Spellbook
                </Button>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}
      
      <NewSpellbookModal
        opened={newModalOpened}
        onClose={closeNewModal}
      />
      
      <EditSpellbookModal
        spellbook={selectedSpellbook}
        opened={editModalOpened}
        onClose={closeEditModal}
      />
    </Container>
  );
}
