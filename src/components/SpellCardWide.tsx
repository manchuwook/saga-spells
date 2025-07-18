import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
} from '@mantine/core';
import { IconEye, IconPlus, IconX } from '@tabler/icons-react';
import { Spell } from '../models/spells.zod';

interface SpellCardWideProps {
  spell: Spell;
  onViewDetails: (spell: Spell) => void;
  onAddToSpellbook?: (spell: Spell) => void;
  onRemoveFromSpellbook?: (spellName: string) => void;
  showRemoveButton?: boolean;
}

// Helper components to reduce cognitive complexity
const SpellHeader = ({
  spell,
  isDark,
  onViewDetails,
  handleAddToSpellbook,
  handleRemoveFromSpellbook,
  showRemoveButton,
  onAddToSpellbook,
}: {
  spell: Spell;
  isDark: boolean;
  onViewDetails: (spell: Spell) => void;
  handleAddToSpellbook: () => void;
  handleRemoveFromSpellbook: () => void;
  showRemoveButton?: boolean;
  onAddToSpellbook?: (spell: Spell) => void;
}) => (
  <Group justify="space-between" align="flex-start">
    <Text fw={600} size="lg" c={isDark ? 'gray.1' : 'dark.8'} style={{ flex: 1 }}>
      {spell.spellName}
    </Text>
    <Group gap={4}>
      <Tooltip label="View Details">
        <ActionIcon
          variant="subtle"
          color={isDark ? 'blue.4' : 'blue.6'}
          onClick={() => onViewDetails(spell)}
          size="sm"
        >
          <IconEye size={16} />
        </ActionIcon>
      </Tooltip>
      {showRemoveButton ? (
        <Tooltip label="Remove from Spellbook">
          <ActionIcon
            variant="subtle"
            color={isDark ? 'red.4' : 'red.6'}
            onClick={handleRemoveFromSpellbook}
            size="sm"
          >
            <IconX size={16} />
          </ActionIcon>
        </Tooltip>
      ) : (
        onAddToSpellbook && (
          <Tooltip label="Add to Spellbook">
            <ActionIcon
              variant="subtle"
              color={isDark ? 'green.4' : 'green.6'}
              onClick={handleAddToSpellbook}
              size="sm"
            >
              {' '}
              <IconPlus size={16} />
            </ActionIcon>
          </Tooltip>
        )
      )}
    </Group>
  </Group>
);

const SpellBadges = ({ spell, isDark }: { spell: Spell; isDark: boolean }) => (
  <Group gap="xs">
    <Badge color={isDark ? 'blue.4' : 'blue.6'} size="sm">
      {spell.spellClass}
    </Badge>
    <Badge color={isDark ? 'purple.4' : 'purple.6'} size="sm">
      {spell.school}
    </Badge>
  </Group>
);

const SpellInfoItem = ({
  label,
  value,
  isDark,
}: {
  label: string;
  value: string;
  isDark: boolean;
}) => (
  <Text size="sm" c={isDark ? 'gray.3' : 'dark.6'}>
    <Text span fw={500}>
      {label}:
    </Text>{' '}
    {value}
  </Text>
);

const SpellDetails = ({ spell, isDark }: { spell: Spell; isDark: boolean }) => (
  <>
    <Group gap="md" wrap="wrap">
      <SpellInfoItem label="Complexity" value={spell.complexity.toString()} isDark={isDark} />
      <SpellInfoItem label="Flare" value={spell.flare.toString()} isDark={isDark} />
      <SpellInfoItem label="Range" value={spell.range} isDark={isDark} />
    </Group>

    <Group gap="md" wrap="wrap">
      <SpellInfoItem label="Action" value={spell.action} isDark={isDark} />
      <SpellInfoItem label="Duration" value={spell.duration} isDark={isDark} />
    </Group>
  </>
);

const ActionButton = ({
  showRemoveButton,
  isDark,
  handleRemoveFromSpellbook,
  handleAddToSpellbook,
  onAddToSpellbook,
}: {
  showRemoveButton?: boolean;
  isDark: boolean;
  handleRemoveFromSpellbook: () => void;
  handleAddToSpellbook: () => void;
  onAddToSpellbook?: (spell: Spell) => void;
}) => (
  <Group justify="stretch" mt="xs">
    {showRemoveButton ? (
      <Button
        variant="light"
        color={isDark ? 'red.4' : 'red.6'}
        onClick={handleRemoveFromSpellbook}
        size="xs"
        fullWidth
      >
        Remove from Spellbook
      </Button>
    ) : (
      onAddToSpellbook && (
        <Button
          variant="light"
          color={isDark ? 'blue.4' : 'blue.6'}
          onClick={handleAddToSpellbook}
          size="xs"
          fullWidth
        >
          Add to Spellbook
        </Button>
      )
    )}
  </Group>
);

export function SpellCardWide({
  spell,
  onViewDetails,
  onAddToSpellbook,
  onRemoveFromSpellbook,
  showRemoveButton = false,
}: Readonly<SpellCardWideProps>) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const handleAddToSpellbook = () => {
    if (onAddToSpellbook) {
      onAddToSpellbook(spell);
    }
  };

  const handleRemoveFromSpellbook = () => {
    if (onRemoveFromSpellbook) {
      onRemoveFromSpellbook(spell.spellName);
    }
  };

  return (
    <Card
      withBorder
      shadow="sm"
      padding="md"
      radius="md"
      bg={isDark ? 'dark.6' : 'white'}
      style={{
        borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Stack gap="xs" style={{ flex: 1 }}>
        {/* Header with spell name and action buttons */}
        <SpellHeader
          spell={spell}
          isDark={isDark}
          onViewDetails={onViewDetails}
          handleAddToSpellbook={handleAddToSpellbook}
          handleRemoveFromSpellbook={handleRemoveFromSpellbook}
          showRemoveButton={showRemoveButton}
          onAddToSpellbook={onAddToSpellbook}
        />
        {/* Spell class and school */}
        <SpellBadges spell={spell} isDark={isDark} />
        {/* Spell details */}
        <SpellDetails spell={spell} isDark={isDark} />
        {/* Description preview */}
        {spell.description && (
          <Text
            size="sm"
            c={isDark ? 'gray.4' : 'dark.5'}
            lineClamp={3}
            style={{ marginTop: 'auto' }}
          >
            {spell.description}
          </Text>
        )}{' '}
        {/* Keywords */}
        {spell.keywords && (
          <Text size="xs" c={isDark ? 'gray.5' : 'gray.6'} fs="italic">
            Keywords: {spell.keywords}
          </Text>
        )}
        {/* Action button at bottom */}
        <ActionButton
          showRemoveButton={showRemoveButton}
          isDark={isDark}
          handleRemoveFromSpellbook={handleRemoveFromSpellbook}
          handleAddToSpellbook={handleAddToSpellbook}
          onAddToSpellbook={onAddToSpellbook}
        />
      </Stack>
    </Card>
  );
}
