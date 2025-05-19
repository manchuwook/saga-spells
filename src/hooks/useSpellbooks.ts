import { useContext } from 'react';
import { SpellbooksContext } from '../context/SpellbooksContext';

export function useSpellbooks() {
  const context = useContext(SpellbooksContext);
  
  if (context === undefined) {
    throw new Error('useSpellbooks must be used within a SpellbooksProvider');
  }
  
  return context;
}
