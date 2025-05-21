import { createContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { Spell } from '../models/spells.zod';

export interface Spellbook {
  id: string;
  name: string;
  character: string;
  description: string;
  spells: Spell[];
  createdAt: Date;
  updatedAt: Date;
}

interface SpellbooksContextType {
  spellbooks: Spellbook[];
  addSpellbook: (spellbook: Omit<Spellbook, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateSpellbook: (id: string, spellbook: Partial<Omit<Spellbook, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteSpellbook: (id: string) => void;
  getSpellbook: (id: string) => Spellbook | undefined;
  addSpellToSpellbook: (spellbookId: string, spell: Spell) => void;
  removeSpellFromSpellbook: (spellbookId: string, spellName: string) => void;
}

export const SpellbooksContext = createContext<SpellbooksContextType>({
  spellbooks: [],
  addSpellbook: () => {},
  updateSpellbook: () => {},
  deleteSpellbook: () => {},
  getSpellbook: () => undefined,
  addSpellToSpellbook: () => {},
  removeSpellFromSpellbook: () => {},
});

export function SpellbooksProvider({ children }: { children: ReactNode }) {
  const [spellbooks, setSpellbooks] = useLocalStorage<Spellbook[]>({
    key: 'saga-spellbooks',
    defaultValue: [],
    serialize: (value) => JSON.stringify(value, (key, value) => {
      if (key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    }),
    deserialize: (value) => {
      const parsed = JSON.parse(value ?? '[]');
      return parsed.map((spellbook: any) => ({
        ...spellbook,
        // Sort spells alphabetically when loading from localStorage
        spells: [...(spellbook.spells ?? [])].sort((a, b) => 
          a.spellName.localeCompare(b.spellName)
        ),
        createdAt: new Date(spellbook.createdAt),
        updatedAt: new Date(spellbook.updatedAt),
      }));
    },
  });

  const addSpellbook = (spellbook: Omit<Spellbook, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newSpellbook: Spellbook = {
      ...spellbook,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    
    setSpellbooks([...spellbooks, newSpellbook]);
  };

  const updateSpellbook = (id: string, updatedFields: Partial<Omit<Spellbook, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setSpellbooks(
      spellbooks.map((spellbook) => 
        spellbook.id === id 
          ? { 
              ...spellbook, 
              ...updatedFields, 
              updatedAt: new Date() 
            } 
          : spellbook
      )
    );
  };

  const deleteSpellbook = (id: string) => {
    setSpellbooks(spellbooks.filter((spellbook) => spellbook.id !== id));
  };

  const getSpellbook = (id: string) => {
    return spellbooks.find((spellbook) => spellbook.id === id);
  };
  const addSpellToSpellbook = (spellbookId: string, spell: Spell) => {
    setSpellbooks(
      spellbooks.map((spellbook) => {
        if (spellbook.id === spellbookId) {
          // Check if spell already exists in the spellbook
          const spellExists = spellbook.spells.some(
            (existingSpell) => existingSpell.spellName === spell.spellName
          );
          
          if (spellExists) {
            return spellbook; // Don't add duplicate spells
          }
          
          // Add spell and sort alphabetically by spell name
          const updatedSpells = [...spellbook.spells, spell].sort((a, b) => 
            a.spellName.localeCompare(b.spellName)
          );
          
          return {
            ...spellbook,
            spells: updatedSpells,
            updatedAt: new Date(),
          };
        }
        return spellbook;
      })
    );
  };
  const removeSpellFromSpellbook = (spellbookId: string, spellName: string) => {
    setSpellbooks(
      spellbooks.map((spellbook) => {
        if (spellbook.id === spellbookId) {
          // Filter out the spell to remove and keep the alphabetical order
          const updatedSpells = spellbook.spells
            .filter((spell) => spell.spellName !== spellName)
            .sort((a, b) => a.spellName.localeCompare(b.spellName));
            
          return {
            ...spellbook,
            spells: updatedSpells,
            updatedAt: new Date(),
          };
        }
        return spellbook;
      })
    );
  };
  // Use useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    spellbooks,
    addSpellbook,
    updateSpellbook,
    deleteSpellbook,
    getSpellbook,
    addSpellToSpellbook,
    removeSpellFromSpellbook,
  }), [spellbooks]);

  return (
    <SpellbooksContext.Provider value={contextValue}>
      {children}
    </SpellbooksContext.Provider>
  );
}
