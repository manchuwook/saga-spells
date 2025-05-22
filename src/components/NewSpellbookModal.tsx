import { Text, useMantineColorScheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { notifications } from '@mantine/notifications';
import { useStyles } from '../hooks/useStyles';
import { SpellbookForm, SpellbookFormValues } from './common/SpellbookForm';
import { Modal } from '@mantine/core';

interface NewSpellbookModalProps {
  opened: boolean;
  onClose: () => void;
}

export function NewSpellbookModal({ opened, onClose }: NewSpellbookModalProps) {
  const { addSpellbook } = useSpellbooks();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { modalStyles } = useStyles();
  
  const form = useForm<SpellbookFormValues>({
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

  const handleSubmit = () => {
    const values = form.values;
    
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
      title={<Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">Create New Spellbook</Text>}
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
      <SpellbookForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Create Spellbook"
        usePaper
      />
    </Modal>
  );
}
