import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SpellbooksProvider } from '../context/SpellbooksContext';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';
import SpellbooksPage from '../pages/SpellbooksPage';
import SpellbookDetailPage from '../pages/SpellbookDetailPage';
import '@testing-library/jest-dom';

// Mock necessary hooks and components
vi.mock('../hooks/useSpells', () => ({
  useSpells: () => ({
    data: [
      {
        spellName: 'Test Spell',
        spellClass: 'Wizard',
        school: 'Evocation',
        complexity: 'medium-complexity',
        flare: 'medium-flare',
        range: '30 feet',
        target: 'single-target',
        action: 'Standard',
        duration: 'Instant',
        keywords: 'fire, damage',
        check: 'Intelligence + Spellcraft',
        skill: 'Spellcraft',
        focus: 'Staff',
        spellType: 'Attack',
        description: 'A test spell that does damage',
        altDescription: null,
      },
      {
        spellName: 'Second Test Spell',
        spellClass: 'Sorcery',
        school: 'necromancy',
        complexity: 'high-complexity',
        flare: 'high-flare',
        range: '60 feet',
        target: 'burst',
        action: 'Standard',
        duration: 'sustain',
        keywords: 'dark, damage',
        check: 'Intelligence + Occultism',
        skill: 'Occultism',
        focus: 'Wand',
        spellType: 'Attack',
        description: 'Another test spell',
        altDescription: null,
      }
    ],
    isLoading: false,
    error: null
  })
}));

// Mock router implementation
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'mock-spellbook-id' }),
    useNavigate: () => vi.fn()
  };
});

// Mock context
vi.mock('../context/ThemeContext', () => ({
  useTheme: () => ({
    colors: {
      accent: '#4c6ef5',
      background: '#ffffff',
      text: '#333333',
    }
  })
}));

const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <MantineProvider defaultColorScheme="light">
        <Notifications />
        <ModalsProvider>
          <SpellbooksProvider>
            {children}
          </SpellbooksProvider>
        </ModalsProvider>
      </MantineProvider>
    </BrowserRouter>
  );
};

const customRender = (ui, options) => 
  render(ui, { wrapper: AllTheProviders, ...options });

describe('Spellbook Management Integration Test', () => {
  // Clean up localStorage before each test
  beforeEach(() => {
    window.localStorage.clear();
    Object.defineProperty(window, 'crypto', {
      value: {
        randomUUID: () => 'mock-spellbook-id'
      }
    });
  });
  it('should complete the full spellbook lifecycle: create, add spell, remove spell, delete', async () => {
    // Step 1: Render the SpellbooksPage and create a new spellbook
    const { unmount } = customRender(<SpellbooksPage />);
    
    // Verify initially no spellbooks
    expect(screen.getByText('You don\'t have any spellbooks yet')).toBeInTheDocument();
    
    // Open the New Spellbook modal
    fireEvent.click(screen.getByRole('button', { name: /new spellbook/i }));
    
    // Fill in the form
    await waitFor(() => {
      expect(screen.getByText('Create New Spellbook')).toBeInTheDocument();
    });
    
    fireEvent.change(screen.getByPlaceholderText('My Wizard\'s Spellbook'), { 
      target: { value: 'Test Mage Spellbook' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('Gandalf the Grey'), { 
      target: { value: 'Merlin the Wise' } 
    });
    
    fireEvent.change(screen.getByPlaceholderText('A brief description of this spellbook...'), { 
      target: { value: 'A collection of powerful test spells' } 
    });
    
    // Submit the form - use getAllByRole to handle multiple buttons with the same name
    // and select the first one, which is likely the submit button
    const createButtons = screen.getAllByRole('button', { name: /create spellbook/i });
    fireEvent.click(createButtons[0]);
    
    // Verify spellbook was created
    await waitFor(() => {
      expect(screen.getByText('Test Mage Spellbook')).toBeInTheDocument();
      expect(screen.getByText('Character: Merlin the Wise')).toBeInTheDocument();
      expect(screen.getByText('A collection of powerful test spells')).toBeInTheDocument();
    });
    
    unmount();
    
    // Step 2: Render the SpellbookDetailPage and add a spell
    const { unmount: unmountDetail } = customRender(<SpellbookDetailPage />);
    
    // Verify spellbook details
    await waitFor(() => {
      expect(screen.getByText('Test Mage Spellbook')).toBeInTheDocument();
      expect(screen.getByText('Character: Merlin the Wise')).toBeInTheDocument();
      expect(screen.getByText('A collection of powerful test spells')).toBeInTheDocument();
      expect(screen.getByText('This spellbook is empty')).toBeInTheDocument();
    });
    
    // Switch to Add Spells tab
    fireEvent.click(screen.getByRole('tab', { name: /add spells/i }));
    
    // Wait for spells to load
    await waitFor(() => {
      expect(screen.getByText('Test Spell')).toBeInTheDocument();
    });
    
    // Add a spell to the spellbook
    const addButton = screen.getAllByRole('button').find(
      button => button.querySelector('svg') && 
      button.closest('[data-testid]')?.getAttribute('data-testid')?.includes('add-to-spellbook')
    );
    
    fireEvent.click(addButton);
    
    // Switch back to Spellbook Contents tab
    fireEvent.click(screen.getByRole('tab', { name: /spellbook contents/i }));
    
    // Verify spell was added
    await waitFor(() => {
      expect(screen.queryByText('This spellbook is empty')).not.toBeInTheDocument();
      expect(screen.getByText('Test Spell')).toBeInTheDocument();
    });
    
    // Step 3: Remove the spell
    const removeButton = screen.getAllByRole('button').find(
      button => button.querySelector('svg') && 
      button.closest('[data-testid]')?.getAttribute('data-testid')?.includes('remove-from-spellbook')
    );
    
    fireEvent.click(removeButton);
    
    // Confirm removal in modal
    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to remove/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /remove/i }));
    
    // Verify spell was removed
    await waitFor(() => {
      expect(screen.getByText('This spellbook is empty')).toBeInTheDocument();
      expect(screen.queryByText('Test Spell')).not.toBeInTheDocument();
    });
    
    unmountDetail();
    
    // Step 4: Go back to SpellbooksPage and delete the spellbook
    const { unmount: unmountList } = customRender(<SpellbooksPage />);
    
    // Verify spellbook exists
    await waitFor(() => {
      expect(screen.getByText('Test Mage Spellbook')).toBeInTheDocument();
    });
    
    // Delete the spellbook
    const deleteButton = screen.getAllByRole('button').find(
      button => button.querySelector('svg') && 
      button.closest('[data-testid]')?.getAttribute('data-testid')?.includes('delete-spellbook')
    );
    
    fireEvent.click(deleteButton);
    
    // Confirm deletion in modal
    await waitFor(() => {
      expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    // Verify spellbook was deleted
    await waitFor(() => {
      expect(screen.getByText('You don\'t have any spellbooks yet')).toBeInTheDocument();
      expect(screen.queryByText('Test Mage Spellbook')).not.toBeInTheDocument();
    });
    
    unmountList();
  });
});
