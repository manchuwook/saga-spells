import { Modal, Button, Select, Text, useMantineColorScheme, Paper } from '@mantine/core';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spell } from '../models/spells.zod';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import '../styles/modal.css';

interface AddToSpellbookModalProps {
  readonly spell: Spell | null;
  readonly opened: boolean;
  readonly onClose: () => void;
}

// Component for modal content
function ModalContent({ 
  spell, 
  spellbookOptions, 
  selectedSpellbookId, 
  setSelectedSpellbookId, 
  handleAddToSpellbook,
  isDark 
}: { 
  readonly spell: Spell;
  readonly spellbookOptions: { value: string; label: string }[];
  readonly selectedSpellbookId: string | null;
  readonly setSelectedSpellbookId: (id: string | null) => void;
  readonly handleAddToSpellbook: () => void;
  readonly isDark: boolean;
}) {
  return (
    <Paper 
      p="md" 
      withBorder={false} 
      bg={isDark ? '#1A1B1E' : 'gray.0'}
      className={isDark ? 'dark-modal-paper' : ''}
      style={{ borderRadius: 0, height: '100%', margin: 0 }}
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
            backgroundColor: isDark ? '#25262B' : 'white',
            borderColor: isDark ? '#373A40' : 'var(--mantine-color-gray-4)',
            color: isDark ? 'white' : 'inherit',
          },
          dropdown: {
            backgroundColor: isDark ? '#25262B' : 'white',
          }
        }}
      />
      
      <Button 
        onClick={handleAddToSpellbook} 
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
}

export function AddToSpellbookModal({ spell, opened, onClose }: AddToSpellbookModalProps) {
  const { spellbooks, addSpellToSpellbook } = useSpellbooks();
  const [selectedSpellbookId, setSelectedSpellbookId] = useState<string | null>(null);
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  if (!spell) return null;

  // Convert spellbooks to options for Select
  const spellbookOptions = spellbooks.map(sb => ({
    value: sb.id,
    label: `${sb.name} (${sb.character})`,
  }));

  // Handle adding spell to spellbook
  const handleAddToSpellbook = () => {
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
  // Theme-related styling
  const modalClass = isDark ? 'dark-mode-modal' : '';
  
  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">Add to Spellbook</Text>}
      size="md"
      overlayProps={{
        backgroundOpacity: 0.65,
        blur: 4,
        color: isDark ? 'black' : '#e6d9c2',
      }}
      className={`spell-details-modal ${modalClass}`}
      data-dark={isDark ? "true" : "false"}
      styles={{
        header: { 
          backgroundColor: isDark ? '#1A1B1E' : 'white',
          color: isDark ? 'white' : 'black',
          borderBottom: isDark ? '1px solid #2C2E33' : 'inherit',
        },
        content: { 
          backgroundColor: isDark ? '#1A1B1E' : 'white',
          padding: 0,
        },
        body: {
          padding: 0,
        },
        inner: {
          padding: 0,
        },
        close: {
          color: isDark ? 'white' : 'black',
        }
      }}
      radius={0}
      padding={0}
    >
      <ModalContent
        spell={spell}
        spellbookOptions={spellbookOptions}
        selectedSpellbookId={selectedSpellbookId}
        setSelectedSpellbookId={setSelectedSpellbookId}
        handleAddToSpellbook={handleAddToSpellbook}
        isDark={isDark}
      />
    </Modal>
  );
}
