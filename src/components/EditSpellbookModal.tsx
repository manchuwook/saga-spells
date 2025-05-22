import { Text, useMantineColorScheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { Spellbook } from '../context/SpellbooksContext';
import { notifications } from '@mantine/notifications';
import { SafeModal } from './common/SafeModal';
import { useEffect } from 'react';
import { SpellbookForm, SpellbookFormValues } from './common/SpellbookForm';

interface EditSpellbookModalProps {
  spellbook: Spellbook | null;
  opened: boolean;
  onClose: () => void;
}

export function EditSpellbookModal({ spellbook, opened, onClose }: EditSpellbookModalProps) {
  const { updateSpellbook } = useSpellbooks();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
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

  // Update form values when spellbook changes
  useEffect(() => {
    if (spellbook && opened) {
      form.setValues({
        name: spellbook.name,
        character: spellbook.character,
        description: spellbook.description,
      });
    }
  }, [spellbook, opened, form]);

  const handleClose = () => {
    form.reset();
    onClose();
  };

  const renderModalContent = (spellbook: Spellbook) => {
    const handleSubmit = () => {
      const values = form.values;
      
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

    return (
      <SpellbookForm
        form={form}
        onSubmit={handleSubmit}
        onCancel={handleClose}
        submitLabel="Save Changes"
      />
    );
  };

  return (
    <SafeModal
      data={spellbook}
      opened={opened}
      onClose={handleClose}
      title={() => <Text fw={700} c={isDark ? 'gray.1' : 'dark.8'}>Edit Spellbook</Text>}
    >
      {renderModalContent}
    </SafeModal>
  );
}
