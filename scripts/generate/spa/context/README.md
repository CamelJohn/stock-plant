# Generate SPA Context

Generates React Context with types, provider, and custom hook.

## What Gets Generated

For a context named "theme":

```
src/context/theme/
  ├── theme.types.ts       # TypeScript interfaces
  ├── theme.context.tsx    # Context creation
  ├── theme.provider.tsx   # Provider component
  └── use-theme.ts         # Custom hook
```

## File Contents

### theme.types.ts
```typescript
export interface IThemeState {
  // Add your state properties here
}

export interface IThemeActions {
  // Add your action methods here
}

export type ThemeContextValue = IThemeState & IThemeActions;
```

### theme.context.tsx
```typescript
import { createContext } from 'react';
import type { ThemeContextValue } from './theme.types';

export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
```

### theme.provider.tsx
```typescript
import { type ReactNode } from 'react';
import { ThemeContext } from './theme.context';
import type { ThemeContextValue } from './theme.types';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Add your state and logic here

  const value: ThemeContextValue = {
    // Add your context value here
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### use-theme.ts
```typescript
import { useContext } from 'react';
import { ThemeContext } from './theme.context';

export function useTheme() {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
}
```

## Usage

```bash
# Generate single context
npm run generate ./my-app spa context theme

# Generate multiple contexts
npm run generate ./my-app spa context theme,user,settings
```

## Removal

```bash
# Remove single context
npm run generate down ./my-app spa context theme

# Remove multiple contexts
npm run generate down ./my-app spa context theme,user,settings
```

## Implementation

- Generates 4 files per context
- No automatic wiring (you wire up providers manually)
- Type-safe with TypeScript
- Follows React best practices with error boundaries
