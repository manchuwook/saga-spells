import { Modal, Text, Title, Grid, Badge, Group, Stack, Paper, useMantineColorScheme } from '@mantine/core';
import { Spell } from '../models/spells.zod';
import { useTheme } from '../context/ThemeContext';
import '../styles/modal.css';

interface SpellDetailsModalProps {
  spell: Spell | null;
  opened: boolean;
  onClose: () => void;
}

export function SpellDetailsModal({ spell, opened, onClose }: SpellDetailsModalProps) {
  const { colors } = useTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  
  if (!spell) {
    return null;
  }
  
  // Apply theme settings
  const textStyles = {
    fontSize: `${colors.fontScale}rem`
  };

  return (    <div style={{ 
      position: 'relative', 
      zIndex: 1000, 
      '--modal-bg-color': isDark ? '#1A1B1E' : 'white',
      '--modal-text-color': isDark ? 'white' : 'black',
    } as React.CSSProperties}>
      <Modal 
        opened={opened} 
        onClose={onClose} 
        title={<Title order={2} c={isDark ? 'white' : 'dark.9'} fw={700}>{spell.spellName}</Title>}
        size="lg"
        overlayProps={{
          backgroundOpacity: 0.65,
          blur: 4,
          color: isDark ? 'black' : '#e6d9c2',
        }}
        className="spell-details-modal"
        data-dark={isDark ? "true" : "false"}
        styles={{
          header: { 
            backgroundColor: 'var(--modal-bg-color)',
            color: 'var(--modal-text-color)',
            borderBottom: isDark ? '1px solid #2C2E33' : 'inherit',
          },
          content: { 
            backgroundColor: 'var(--modal-bg-color)',
          },
          close: {
            color: 'var(--modal-text-color)',
          },
          body: {
            padding: 0,
          },
        }}
    >
      <Paper 
        p="md" 
        withBorder={false} 
        bg={isDark ? '#1A1B1E' : 'white'}
        style={{ backgroundColor: isDark ? '#1A1B1E' : 'white' }}
        data-dark={isDark ? "true" : "false"}
        className={isDark ? 'dark-modal-paper' : ''}>
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
          </Stack>

          {spell.altDescription && spell.altDescription !== "-" && spell.altDescription !== "null" && (
            <Stack gap="xs">
              <Text fw={700} c={isDark ? 'gray.3' : 'dark.9'}>Alternative Description:</Text>
              <Text style={{ whiteSpace: 'pre-wrap' }} c={isDark ? 'white' : 'dark.8'}>{spell.altDescription}</Text>
            </Stack>
          )}
        </Stack>
      </Paper>    </Modal>
    </div>
  );
}
