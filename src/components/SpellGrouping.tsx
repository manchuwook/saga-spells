import { Group, Select, Text, useMantineColorScheme } from '@mantine/core';
import { IconFilter } from '@tabler/icons-react';

export type GroupingOption = 'none' | 'class' | 'school' | 'action';

interface SpellGroupingProps {
  readonly value: GroupingOption;
  readonly onChange: (value: GroupingOption) => void;
}

export function SpellGrouping({ value, onChange }: SpellGroupingProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const groupingOptions = [
    { value: 'none', label: 'No Grouping' },
    { value: 'class', label: 'Group by Class' },
    { value: 'school', label: 'Group by School' },
    { value: 'action', label: 'Group by Action' },
  ];

  return (
    <Group gap="xs" align="center">
      <IconFilter size={16} color={isDark ? '#909296' : '#495057'} />
      <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.7'}>
        Group by:
      </Text>
      <Select
        data={groupingOptions}
        value={value}
        onChange={(val) => onChange((val as GroupingOption) || 'none')}
        size="sm"
        w={150}
        styles={{
          input: {
            backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            color: isDark ? 'white' : 'dark',
          },
          dropdown: {
            backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
          },
        }}
      />
    </Group>
  );
}
