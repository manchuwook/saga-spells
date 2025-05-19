import { Card, Text, Badge, Group, ActionIcon, Tooltip, Stack, Box, useMantineColorScheme } from '@mantine/core';
import { IconEye, IconBooks, IconX } from '@tabler/icons-react';
import { Spell } from '../models/spells.zod';
import { useTheme } from '../context/ThemeContext';

interface SpellCardProps {
    readonly spell: Spell;
    readonly onViewDetails: (spell: Spell) => void;
    readonly onAddToSpellbook?: (spell: Spell) => void;
    readonly onRemoveFromSpellbook?: (spellName: string) => void;
    readonly showRemoveButton?: boolean;
}

export function SpellCard({
    spell,
    onViewDetails,
    onAddToSpellbook,
    onRemoveFromSpellbook,
    showRemoveButton = false,
}: SpellCardProps) {
    const { colors } = useTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    // Generate card styles based on theme
    const cardStyles = {
        borderRadius: `${colors.borderRadius}px`,
        fontSize: `${colors.fontScale}rem`,
        border: `1px solid ${isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)'}`,
    };

    return (
        <Card
            withBorder
            shadow="sm"
            padding="md"
            radius="md"
            style={cardStyles}
            bg={isDark ? 'dark.6' : 'white'}
        >
            <Card.Section withBorder inheritPadding py="xs" bg={isDark ? 'dark.7' : colors.primaryColor}>
                <Group justify="space-between">
                    <Text fw={700} c="white">{spell.spellName}</Text>
                    <Group gap={5}>
                        <Tooltip label="View Details">
                            <ActionIcon
                                variant="subtle"
                                color={isDark ? 'blue.4' : 'blue.6'}
                                onClick={() => onViewDetails(spell)}
                            >
                                <IconEye size={16} />
                            </ActionIcon>
                        </Tooltip>

                        {onAddToSpellbook && (
                            <Tooltip label="Add to Spellbook">
                                <ActionIcon
                                    variant="subtle"
                                    color={isDark ? 'green.4' : 'green.6'}
                                    onClick={() => onAddToSpellbook(spell)}
                                >
                                    <IconBooks size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}

                        {showRemoveButton && onRemoveFromSpellbook && (
                            <Tooltip label="Remove from Spellbook">
                                <ActionIcon
                                    variant="subtle"
                                    color={isDark ? 'red.4' : 'red.6'}
                                    onClick={() => onRemoveFromSpellbook(spell.spellName)}
                                >
                                    <IconX size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </Group>
            </Card.Section>
            <Stack mt="md" gap="xs">
                <Group gap="xs">
                    <Badge color={isDark ? 'blue.4' : 'blue.6'} size="sm">{spell.spellClass}</Badge>
                    <Badge color={isDark ? 'teal.4' : 'teal.6'} size="sm">{spell.school}</Badge>
                </Group>

                <Box>
                    <Group gap="md">
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Complexity: {spell.complexity}</Text>
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Flare: {spell.flare}</Text>
                    </Group>

                    <Group>
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Range: {spell.range}</Text>
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Target: {spell.target}</Text>
                    </Group>

                    <Group>
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Action: {spell.action}</Text>
                        <Text size="sm" fw={500} c={isDark ? 'gray.3' : 'dark.8'}>Duration: {spell.duration}</Text>
                    </Group>

                    <div style={{ paddingTop: '0.5rem' }}>
                        <Text size="sm" fw={500} lineClamp={8} c={isDark ? 'gray.1' : 'dark.9'}>
                            {spell.description}
                        </Text>
                    </div>
                </Box>
            </Stack>
        </Card>
    );
}
