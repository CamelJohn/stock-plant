# Generate SPA Component

Generates pre-built UI components from the component library.

## What Gets Generated

For a component named "button":

```
src/components/button/
  ├── button.types.ts       # TypeScript interfaces
  ├── button.tsx            # Component implementation
  ├── button.module.css     # Component styles
  └── index.ts              # Re-exports
```

## Available Components

### Form Components
- `Button` - Primary, secondary, danger, ghost variants with loading state
- `Input` - Text input with label, error, helper text

### Layout Components
- `Card` - Container with header, body, footer
- `Modal` - Overlay dialog with portal, escape/backdrop close

### Feedback Components
- `Alert` - Success, error, warning, info messages
- `Spinner` - Loading indicator with sizes and variants

### Data Display Components
- `Tooltip` - Hover information with positioning
- `Table` - Data table with striped/bordered variants

[View full component library →](../../../../templates/ui-components/COMPONENTS.md)

## Usage

```bash
# Generate single component
npm run generate:spa:component ./my-app Button

# Generate multiple components (bulk)
npm run generate:spa:component ./my-app Button,Input,Card

# Case insensitive
npm run generate:spa:component ./my-app button,CARD,Modal
```

## Component Usage

After generation, import and use:

```tsx
import { Button } from './components/button';

function MyPage() {
  return (
    <Button variant="primary" size="md" onClick={handleClick}>
      Click me
    </Button>
  );
}
```

## Removal

```bash
# Remove single component
npm run ungenerate:spa:component ./my-app Button

# Remove multiple components
npm run ungenerate:spa:component ./my-app Button,Input,Card
```

## Implementation

- Entry point: `scripts/generate/spa/component/up.ts`
- Templates: `templates/ui-components/{category}/{component}/`
- Component removal: `scripts/generate/spa/component/down.ts`

## Notes

- Components are framework-agnostic templates
- All components support ref forwarding
- TypeScript types are fully exported
- CSS Modules for scoped styling
- Accessible (ARIA attributes where needed)
