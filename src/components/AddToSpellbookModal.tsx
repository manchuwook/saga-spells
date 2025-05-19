import { Modal, Button, Select, Text, useMantineColorScheme } from '@mantine/core';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spell } from '../../spells.zod';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';

interface AddToSpellbookModalProps {
  spell: Spell | null;
  opened: boolean;
  onClose: () => void;
}

export function AddToSpellbookModal({ spell, opened, onClose }: AddToSpellbookModalProps) {
  const { spellbooks, addSpellToSpellbook } = useSpellbooks();
  const [selectedSpellbookId, setSelectedSpellbookId] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAddToSpellbook = () => {
    if (!spell || !selectedSpellbookId) {
      return;
    }

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

  // Reset selected spellbook when modal is closed
  const handleClose = () => {
    setSelectedSpellbookId(null);
    onClose();
  };

  if (!spell) {
    return null;
  }

  // Convert spellbooks to options for Select
  const spellbookOptions = spellbooks.map(sb => ({
    value: sb.id,
    label: `${sb.name} (${sb.character})`,
  }));

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Text fw={700} c={isDark ? 'gray.1' : 'dark.8'}>Add to Spellbook</Text>}
      overlayProps={{
        backgroundOpacity: 0.65,
        blur: 3,
        color: isDark ? 'dark.8' : '#e6d9c2',
      }}
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
          input: {
            backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
          }
        }}
      />
      
      <Button 
        onClick={handleAddToSpellbook} 
        disabled={!selectedSpellbookId}
        fullWidth
        color={isDark ? 'blue.4' : 'blue.6'}
      >
        Add to Spellbook
      </Button>
    </Modal>
  );
}
