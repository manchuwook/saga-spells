import { Modal, Button, Select, Text, useMantineColorScheme, Paper } from '@mantine/core';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spell } from '../models/spells.zod';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';

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
  const { inputStyles } = useStyles();
  
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
  const { modalStyles } = useStyles();

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

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">Add to Spellbook</Text>}
      size="md"
      overlayProps={modalStyles.overlayProps}
      styles={{
        header: modalStyles.header,
        content: modalStyles.content, 
        close: modalStyles.close,
        body: {
          padding: 0,
        }
      }}
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
