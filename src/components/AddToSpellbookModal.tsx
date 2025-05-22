import { Button, Select, Text, useMantineColorScheme, Paper } from '@mantine/core';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spell } from '../models/spells.zod';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';
import { SafeModal } from './common/SafeModal';

interface AddToSpellbookModalProps {
  readonly spell: Spell | null;
  readonly opened: boolean;
  readonly onClose: () => void;
}

export function AddToSpellbookModal({ spell, opened, onClose }: AddToSpellbookModalProps) {
  const { spellbooks, addSpellToSpellbook } = useSpellbooks();
  const [selectedSpellbookId, setSelectedSpellbookId] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { inputStyles } = useStyles();
  
  // Handle adding spell to spellbook
  const handleAddToSpellbook = (spell: Spell) => {
    if (!selectedSpellbookId) return;

    addSpellToSpellbook(selectedSpellbookId, spell);
    
    const spellbookName = spellbooks.find(sb => sb.id === selectedSpellbookId)?.name;
    notifications.show({
      title: 'Spell Added',
      message: `${spell.spellName} has been added to ${spellbookName}`,
      color: 'green',
    });
    
    setSelectedSpellbookId(null);
    onClose();
  };

  // Handle modal closing
  const handleClose = () => {
    setSelectedSpellbookId(null);
    onClose();
  };

  // Convert spellbooks to options for Select and sort alphabetically
  const spellbookOptions = spellbooks
    .map(sb => ({
      value: sb.id,
      label: `${sb.name} (${sb.character})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const renderModalContent = (spell: Spell) => {
    return (
      <Paper 
        p="md" 
        withBorder={false} 
        bg={isDark ? 'dark.6' : 'gray.0'}
        style={{ height: '100%', margin: 0 }}
      >
        <Text mb="md" c={isDark ? 'gray.2' : 'dark.7'}>
          Add <strong>{spell.spellName}</strong> to one of your spellbooks:
        </Text>
        
        <Select
          data={spellbookOptions}
          placeholder="Select a spellbook"
          value={selectedSpellbookId}
          onChange={setSelectedSpellbookId}
          clearable
          mb="md"
          styles={{
            input: inputStyles.input,
            dropdown: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            }
          }}
        />
        
        <Button 
          onClick={() => handleAddToSpellbook(spell)} 
          disabled={!selectedSpellbookId}
          fullWidth
          color={isDark ? 'blue.4' : 'blue.6'}
          variant="filled"
          style={{ 
            marginBottom: '0.5rem'
          }}
        >
          Add to Spellbook
        </Button>
      </Paper>
    );
  };

  // Define title component outside the render function
  const ModalTitle = () => (
    <Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">Add to Spellbook</Text>
  );

  return (
    <SafeModal
      data={spell}
      opened={opened}
      onClose={handleClose}
      title={ModalTitle}
      size="md"
      styles={{
        body: {
          padding: 0,
        }
      }}
    >
      {renderModalContent}
    </SafeModal>
  );
}
