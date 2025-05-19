import { Modal, TextInput, Textarea, Button, Group, useMantineColorScheme, Text, Paper, Stack, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { notifications } from '@mantine/notifications';

interface NewSpellbookModalProps {
  opened: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  character: string;
  description: string;
}

export function NewSpellbookModal({ opened, onClose }: NewSpellbookModalProps) {
  const { addSpellbook } = useSpellbooks();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      character: '',
      description: '',
    },
    validate: {
      name: (value) => (!value ? 'Spellbook name is required' : null),
      character: (value) => (!value ? 'Character name is required' : null),
    },
  });

  const handleSubmit = (values: FormValues) => {
    addSpellbook({
      name: values.name,
      character: values.character,
      description: values.description,
      spells: [],
    });
    
    notifications.show({
      title: 'Spellbook Created',
      message: `${values.name} has been created for ${values.character}`,
      color: 'green',
    });
    
    form.reset();
    onClose();
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };
  return (
    <Modal 
      opened={opened} 
      onClose={handleClose} 
      title={<Title order={2} c={isDark ? 'white' : 'dark.9'}>Create New Spellbook</Title>}
      size="md"
      overlayProps={{
        backgroundOpacity: 0.65,
        blur: 4,
        color: isDark ? 'black' : '#e6d9c2',
      }}
    >
      <Paper p="md" withBorder={false} bg={isDark ? 'dark.6' : 'gray.0'}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="md">
            <TextInput
              label={<Text fw={600} size="sm" c={isDark ? 'gray.2' : 'dark.9'}>Spellbook Name</Text>}
              placeholder="My Wizard's Spellbook"
              {...form.getInputProps('name')}
              styles={{
                input: {
                  backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                  borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                }
              }}
            />
            
            <TextInput
              label={<Text fw={600} size="sm" c={isDark ? 'gray.2' : 'dark.9'}>Character Name</Text>}
              placeholder="Gandalf the Grey"
              {...form.getInputProps('character')}
              styles={{
                input: {
                  backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                  borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                }
              }}
            />
            
            <Textarea
              label={<Text fw={600} size="sm" c={isDark ? 'gray.2' : 'dark.9'}>Description (Optional)</Text>}
              placeholder="A brief description of this spellbook..."
              {...form.getInputProps('description')}
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
                Create Spellbook
              </Button>
            </Group>
          </Stack>
        </form>
      </Paper>
    </Modal>
  );
}
