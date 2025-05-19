import { useEffect, useState, useMemo } from 'react';
import { 
  TextInput, 
  MultiSelect, 
  Group, 
  Stack, 
  Button, 
  Accordion,
  Paper,
  useMantineColorScheme
} from '@mantine/core';
import { IconSearch, IconFilter, IconX, IconTags } from '@tabler/icons-react';
import { Spell } from '../../spells.zod';
import { useTheme } from '../context/ThemeContext';
import { useSpellTags } from '../hooks/useSpellTags';

interface SpellsFilterProps {
  readonly spells: Spell[];
  readonly onFilterChange: (filteredSpells: Spell[]) => void;
}

export function SpellsFilter({ spells, onFilterChange }: SpellsFilterProps) {
  const [searchText, setSearchText] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [complexityRange, setComplexityRange] = useState<[number, number]>([0, 10]);  const { colorScheme } = useMantineColorScheme();
  const { colors } = useTheme();
  const isDark = colorScheme === 'dark';
  const { data: spellTagsData, isLoading: isLoadingTags } = useSpellTags();

  // Extract unique values for filter dropdowns
  const uniqueClasses = [...new Set(spells.map(spell => spell.spellClass))].sort((a, b) => 
    a.localeCompare(b)
  );
  const uniqueSchools = [...new Set(spells.map(spell => spell.school))].sort((a, b) => 
    a.localeCompare(b)
  );

  // Transform to MultiSelect data format
  const classesData = uniqueClasses.map(c => ({ value: c, label: c }));
  const schoolsData = uniqueSchools.map(s => ({ value: s, label: s }));

  // Organize tags into categories - memoized to prevent recalculation on every render
  const tagCategories = useMemo(() => {
    if (!spellTagsData?.tags) return [];
    
    // Define categories based on tag patterns
    const categories = {
      'Spell Type': ['offensive', 'defensive', 'healing', 'control', 'utility', 'aoe', 'buff', 'debuff', 'summoning', 'transformation', 'movement'],
      'Elements': ['fire', 'water', 'air', 'earth', 'elemental', 'fire-damage', 'electrical-damage', 'acid-damage', 'etheric-damage', 'psychic-damage', 'disintegration-damage'],
      'Spell Class': ['animism', 'elementalism', 'eldritch', 'sorcery'],
      'Schools': ['necromancy', 'alchemy', 'telekinesis', 'hydromancy', 'aeromancy', 'pyromancy', 'geomancy', 'phytomancy', 'zoomancy', 'dreaming'],
      'Targets': ['self-target', 'single-target', 'burst', 'aura'],
      'Duration': ['instant', 'sustain', 'cycles', 'permanent'],
      'Complexity': ['low-complexity', 'medium-complexity', 'high-complexity'],
      'Flare': ['low-flare', 'medium-flare', 'high-flare'],
      'Effects': ['psychic-effect', 'morale-effect', 'pervasive', 'corpus-effect', 'sundering'],
      'Focus': ['spirit-focus', 'manipulate-focus', 'morphic-focus', 'ego-focus', 'formulae-focus', 'banish-focus'],
      'Conditions': ['suffocation', 'cowed', 'hallucinating', 'distracted', 'dazed', 'sprawled', 'immobilized'],
      'Subjects': ['animal', 'plant', 'spirit', 'missile', 'teleport', 'grapple', 'environmental', 'weather', 'sensory', 'wall', 'memory', 'combat-boost', 'reaction', 'lingering']
    };
    
    const categorizedData: { group: string; items: { value: string; label: string; description?: string }[] }[] = [];
    const categorizedTags = new Set<string>();
    
    // Sort tags into categories
    Object.entries(categories).forEach(([category, tagList]) => {
      const categoryTags = spellTagsData.tags
        .filter(tag => tagList.includes(tag.tag))
        .map(tag => ({
          value: tag.tag,
          label: `${tag.name} (${tag.matches?.length ?? 0})`,
          description: tag.description
        }));
      
      if (categoryTags.length > 0) {
        categorizedData.push({
          group: category,
          items: categoryTags
        });
        
        categoryTags.forEach(tag => categorizedTags.add(tag.value));
      }
    });
    
    // Add uncategorized tags
    const uncategorizedTags = spellTagsData.tags
      .filter(tag => !categorizedTags.has(tag.tag))
      .map(tag => ({
        value: tag.tag,
        label: `${tag.name} (${tag.matches?.length ?? 0})`,
        description: tag.description
      }));
    
    if (uncategorizedTags.length > 0) {
      categorizedData.push({
        group: 'Other',
        items: uncategorizedTags
      });
    }
    
    return categorizedData;
  }, [spellTagsData]);

  // Apply filters
  useEffect(() => {
    // Only run the filter if we have spells
    if (spells.length === 0) {
      onFilterChange([]);
      return;
    }
    
    const filtered = spells.filter(spell => {
      // Text search
      const textMatch = searchText === '' || 
        spell.spellName?.toLowerCase().includes(searchText.toLowerCase()) || 
        spell.description?.toLowerCase().includes(searchText.toLowerCase());
      
      // Class filter
      const classMatch = selectedClasses.length === 0 || 
        (spell.spellClass && selectedClasses.includes(spell.spellClass));
      
      // School filter
      const schoolMatch = selectedSchools.length === 0 || 
        (spell.school && selectedSchools.includes(spell.school));
      
      // Complexity filter
      const complexityValue = typeof spell.complexity === 'string' 
        ? parseInt(spell.complexity, 10) 
        : spell.complexity;
      const complexityMatch = !complexityValue || (
        !isNaN(complexityValue) && 
        complexityValue >= complexityRange[0] && 
        complexityValue <= complexityRange[1]
      );
      
      // Tag filter
      const tagMatch = selectedTags.length === 0 || 
        (spellTagsData?.tags.some(tag => 
          selectedTags.includes(tag.tag) && 
          tag.matches?.includes(spell.spellName)
        ) ?? false);
      
      return textMatch && classMatch && schoolMatch && complexityMatch && tagMatch;
    });
    
    onFilterChange(filtered);
  }, [searchText, selectedClasses, selectedSchools, complexityRange, selectedTags, spellTagsData]);  // Remove spells and onFilterChange from dependencies
  const resetFilters = () => {
    setSearchText('');
    setSelectedClasses([]);
    setSelectedSchools([]);
    setSelectedTags([]);
    setComplexityRange([0, 10]);
  };
  
  return (
    <Paper p="md" radius={colors.borderRadius} bg={isDark ? 'dark.6' : 'white'} withBorder>
      <Stack gap="md">
        <TextInput
          placeholder="Search spells by name or description"
          value={searchText}
          onChange={(e) => setSearchText(e.currentTarget.value)}
          leftSection={<IconSearch size={16} />}
          rightSection={
            searchText ? (
              <IconX 
                size={16} 
                style={{ cursor: 'pointer' }} 
                onClick={() => setSearchText('')}
              />
            ) : null
          }
          styles={{
            input: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
            }
          }}
        />
        
        <Accordion 
          variant={isDark ? "filled" : "default"}
          styles={{
            item: {
              borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-3)',
            },
            control: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
            },
            panel: {
              backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'white',
            }
          }}
        >
          <Accordion.Item value="advanced-filters">
            <Accordion.Control icon={<IconFilter size={16} />}>
              Advanced Filters
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap="md">
                <Group align="flex-start">
                  <MultiSelect
                    label="Spell Class"
                    placeholder="Filter by class"
                    data={classesData}
                    value={selectedClasses}
                    onChange={setSelectedClasses}
                    clearable
                    style={{ flex: 1 }}
                    styles={{
                      input: {
                        backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                        borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                      }
                    }}
                  />
                  
                  <MultiSelect
                    label="School"
                    placeholder="Filter by school"
                    data={schoolsData}
                    value={selectedSchools}
                    onChange={setSelectedSchools}
                    clearable
                    style={{ flex: 1 }}
                    styles={{
                      input: {
                        backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                        borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                      }
                    }}
                  />
                </Group>
                <MultiSelect
                  label="Tags"
                  placeholder="Filter by tags"
                  leftSection={<IconTags size={16} />}
                  data={tagCategories}
                  value={selectedTags}
                  onChange={setSelectedTags}
                  clearable
                  searchable
                  maxDropdownHeight={280}
                  disabled={isLoadingTags}
                  styles={{
                    input: {
                      backgroundColor: isDark ? 'var(--mantine-color-dark-5)' : 'white',
                      borderColor: isDark ? 'var(--mantine-color-dark-4)' : 'var(--mantine-color-gray-4)',
                    }
                  }}
                />
                
                <Group justify="flex-end">
                  <Button 
                    variant="outline" 
                    onClick={resetFilters}
                    color={isDark ? 'blue.4' : 'blue.6'}
                  >
                    Reset Filters
                  </Button>
                </Group>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Stack>
    </Paper>
  );
}
