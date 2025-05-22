import { Text, Grid, Badge, Group, Stack, useMantineColorScheme } from '@mantine/core';
import { Spell } from '../models/spells.zod';
import { useStyles } from '../hooks/useStyles';
import { SafeModal } from './common/SafeModal';

interface SpellDetailsModalProps {
  spell: Spell | null;
  opened: boolean;
  onClose: () => void;
}

export function SpellDetailsModal({ spell, opened, onClose }: SpellDetailsModalProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const { textStyles } = useStyles();

  // Using textStyles directly from StyleService - font scale is already integrated
  const renderSpellDetails = (spell: Spell) => {
    return (
        <Stack gap="md">
          <Group>
            <Badge color="blue" size="lg">{spell.spellClass}</Badge>
            <Badge color="teal" size="lg">{spell.school}</Badge>
            <Badge color="violet" size="lg">{spell.spellType}</Badge>
          </Group>

          <Grid>
            <Grid.Col span={6}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Complexity:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.complexity}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Flare:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.flare}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Range:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.range}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Target:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.target}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Action:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.action}</Text>
            </Grid.Col>
            <Grid.Col span={6}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Duration:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.duration}</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Keywords:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.keywords || "None"}</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Check:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.check}</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={700} style={textStyles} c={isDark ? 'gray.3' : 'dark.9'}>Skill:</Text>
              <Text style={textStyles} c={isDark ? 'white' : 'dark.8'}>{spell.skill}</Text>
            </Grid.Col>
            <Grid.Col span={12}>
              <Text fw={700} c={isDark ? 'gray.3' : 'dark.9'}>Focus:</Text>
              <Text c={isDark ? 'white' : 'dark.8'}>{spell.focus}</Text>
            </Grid.Col>
          </Grid>

          <Stack gap="xs">
            <Text fw={700} c={isDark ? 'gray.3' : 'dark.9'}>Description:</Text>
            <Text style={{ whiteSpace: 'pre-wrap' }} c={isDark ? 'white' : 'dark.8'}>{spell.description}</Text>
          </Stack>          {spell.altDescription && spell.altDescription !== "-" && spell.altDescription !== "null" && (
            <Stack gap="xs">
              <Text fw={700} c={isDark ? 'gray.3' : 'dark.9'}>Alternative Description:</Text>
              <Text style={{ whiteSpace: 'pre-wrap' }} c={isDark ? 'white' : 'dark.8'}>{spell.altDescription}</Text>
            </Stack>
          )}
        </Stack>
    );
  };

  return (
    <SafeModal
      data={spell}
      opened={opened}
      onClose={onClose}
      title={(spell) => <Text c={isDark ? 'white' : 'dark.9'} fw={700} size="xl">{spell.spellName}</Text>}
      size="lg"
    >
      {renderSpellDetails}
    </SafeModal>
  );
}
