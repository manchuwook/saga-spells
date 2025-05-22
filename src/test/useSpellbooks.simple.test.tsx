import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSpellbooks } from '../hooks/useSpellbooks';
import { SpellbooksProvider } from '../context/SpellbooksContext';
import { ReactNode } from 'react';

describe('useSpellbooks Hook - Simple Coverage', () => {

  it('should provide the spellbooks context when used within provider', () => {
    // Setup wrapper with context provider
    const wrapper = ({ children }: { children: ReactNode }) => (
      <SpellbooksProvider>{children}</SpellbooksProvider>
    );
    
    // Render hook with provider
    const { result } = renderHook(() => useSpellbooks(), { wrapper });
    
    // Verify the hook returns the context
    expect(result.current).toBeDefined();
    expect(result.current.spellbooks).toBeDefined();
    expect(result.current.addSpellbook).toBeDefined();
    expect(result.current.updateSpellbook).toBeDefined();
    expect(result.current.deleteSpellbook).toBeDefined();
    expect(result.current.getSpellbook).toBeDefined();
    expect(result.current.addSpellToSpellbook).toBeDefined();
    expect(result.current.removeSpellFromSpellbook).toBeDefined();
  });
});
