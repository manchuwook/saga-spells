# Saga Spells Theme System

The Saga Spells app uses a centralized theme system built on top of Mantine's theming capabilities. This document explains how to use the theme system effectively in your components.

## Overview

The theme system consists of the following key parts:

1. **Mantine Theme**: The base theme defined in `src/theme/mantineTheme.ts`.
2. **StyleService**: A singleton service that manages theme styles (`src/services/StyleService.ts`).
3. **ThemeContext**: React context that manages user theme preferences.
4. **useStyles Hook**: A custom hook that provides easy access to the theme (`src/hooks/useStyles.ts`).

## Using the Theme in Components

### Basic Usage

```tsx
import { Button, Text, Card } from '@mantine/core';
import { useStyles } from '../hooks/useStyles';

function MyComponent() {
  const { isDark, textStyles, buttonStyles, cardStyles } = useStyles();
  
  return (
    <Card {...cardStyles}>
      <Text {...textStyles('heading')}>My Component</Text>
      <Button {...buttonStyles('primary')}>Click Me</Button>
    </Card>
  );
}
```

### Available Style Helpers

The `useStyles` hook provides several helpers:

- `isDark`: Boolean indicating dark mode
- `theme`: The current Mantine theme object with customizations
- `styleService`: Direct access to the StyleService
- `modalStyles`: Styles for modals
- `cardStyles`: Styles for cards
- `shellStyles`: Styles for app shell/layout
- `textStyles(purpose)`: Styles for text (heading/body/label)
- `inputStyles`: Styles for form inputs
- `buttonStyles(variant)`: Styles for buttons (primary/secondary/outline)
- `getNavLinkColor(isActive)`: Color for navigation links
- `getNotificationStyles(color)`: Styles for notifications

### Modal Example

```tsx
import { modals } from '@mantine/modals';
import { IconCheck } from '@tabler/icons-react';
import { useStyles } from '../hooks/useStyles';

function showConfirmation() {
  const { styleService } = useStyles();
  const modalStyles = styleService.getModalStyles();
  
  modals.openConfirmModal({
    title: 'Confirm Action',
    children: 'Are you sure you want to proceed?',
    styles: {
      header: modalStyles.header,
      content: modalStyles.content,
      body: modalStyles.body,
      close: modalStyles.close
    },
    overlayProps: modalStyles.overlayProps,
    // ... other modal props
  });
}
```

### Notification Example

```tsx
import { notifications } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons-react';
import { useStyles } from '../hooks/useStyles';

function showSuccess() {
  const { styleService } = useStyles();
  const notifStyles = styleService.getNotificationStyles('green');
  
  notifications.show({
    title: 'Success',
    message: 'Operation completed successfully',
    color: notifStyles.color,
    icon: <IconCheck size={16} />,
    autoClose: notifStyles.autoClose,
    withBorder: notifStyles.withBorder,
    style: notifStyles.style
  });
}
```

## Customizing the Theme

Users can customize the theme through the ThemeCustomizer component. The StyleService automatically updates all styles when the theme changes.

## Extending the Theme

To add new style helpers to the StyleService:

1. Add a new method to the `StyleService` class
2. Expose it through the `useStyles` hook

Example:

```tsx
// In StyleService.ts
public getTableStyles() {
  return {
    striped: this.isDark,
    highlightOnHover: true,
    borderColor: this.isDark ? 'dark.4' : 'gray.3'
  };
}

// In useStyles.ts
return {
  // ...existing properties
  tableStyles: styleService.getTableStyles(),
};
```
