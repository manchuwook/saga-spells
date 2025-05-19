import { Modal, TextInput, Textarea, Button, Group, useMantineColorScheme, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spellbook } from '../context/SpellbooksContext';
import { notifications } from '@mantine/notifications';

interface EditSpellbookModalProps {
  spellbook: Spellbook | null;
  opened: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  character: string;
  description: string;
}

export function EditSpellbookModal({ spellbook, opened, onClose }: EditSpellbookModalProps) {
  const { updateSpellbook } = useSpellbooks();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const form = useForm<FormValues>({
    initialValues: {
      name: spellbook?.name || '',
      character: spellbook?.character || '',
      description: spellbook?.description || '',
    },
    validate: {
      name: (value) => (!value ? 'Spellbook name is required' : null),
      character: (value) => (!value ? 'Character name is required' : null),
    },
  });

  // Update form values when spellbook changes
  if (spellbook && opened) {
    if (form.values.name !== spellbook.name ||
        form.values.character !== spellbook.character ||
        form.values.description !== spellbook.description) {
      form.setValues({
        name: spellbook.name,
        character: spellbook.character,
        description: spellbook.description,
      });
    }
  }

  const handleSubmit = (values: FormValues) => {
    if (!spellbook) {
      return;
    }
      updateSpellbook(spellbook.id, {
      name: values.name,
      character: values.character,
      description: values.description,
    });
    
    notifications.show({
      title: 'Spellbook Updated',
      message: `${values.name} has been updated`,
      color: 'blue',
    });
    
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  if (!spellbook) {
    return null;
  }

  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Text fw={700} c={isDark ? 'gray.1' : 'dark.8'}>Edit Spellbook</Text>}
      overlayProps={{
        backgroundOpacity: 0.65,
        blur: 3,
        color: isDark ? 'dark.8' : '#e6d9c2',
      }}
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label={<Text c={isDark ? 'gray.2' : 'dark.8'}>Spellbook Name</Text>}
          placeholder="My Wizard's Spellbook"
          {...form.getInputProps('name')}
          mb="md"
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />
        
        <TextInput
          label={<Text c={isDark ? 'gray.2' : 'dark.8'}>Character Name</Text>}
          placeholder="Gandalf the Grey"
          {...form.getInputProps('character')}
          mb="md"
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />
        
        <Textarea
          label={<Text c={isDark ? 'gray.2' : 'dark.8'}>Description (Optional)</Text>}
          placeholder="A brief description of this spellbook..."
          {...form.getInputProps('description')}
          mb="md"
          autosize
          minRows={3}
          maxRows={5}
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />
        
        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={handleClose} color={isDark ? 'gray.4' : 'gray.6'}>
            Cancel
          </Button>
          <Button type="submit" color={isDark ? 'blue.4' : 'blue.6'}>
            Save Changes
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
