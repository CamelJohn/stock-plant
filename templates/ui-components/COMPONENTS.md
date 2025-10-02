# Component Library Roadmap

This document tracks the base components we plan to implement as opt-in templates for SPA projects.

## Status Legend
- ⬜ Not started
- 🚧 In progress
- ✅ Complete

## Form Components

- ✅ **Button** - Primary, secondary, danger, ghost variants with loading state
- ✅ **Input** - Text, email, password, number with label, error, helper text
- ⬜ **TextArea** - Multi-line text input
- ⬜ **Select** - Dropdown selection
- ⬜ **Checkbox** - Single checkbox with label
- ⬜ **Radio** - Radio button group
- ⬜ **Toggle** - Switch/toggle component

## Layout Components

- ✅ **Card** - Container with header, body, footer (composable sections)
- ✅ **Modal** - Overlay dialog with portal, escape/backdrop close, sizes
- ⬜ **Drawer** - Slide-in panel (left/right)
- ⬜ **Tabs** - Tab navigation
- ⬜ **Accordion** - Collapsible sections
- ⬜ **Grid** - Responsive grid layout
- ⬜ **Stack** - Vertical/horizontal stack (flexbox wrapper)

## Feedback Components

- ✅ **Alert** - Success, error, warning, info messages with icons and close
- ⬜ **Toast** - Notification popup
- ✅ **Spinner** - Loading indicator with sizes and variants
- ⬜ **ProgressBar** - Progress indicator
- ⬜ **Skeleton** - Loading placeholder

## Data Display

- ✅ **Table** - Basic data table with striped/bordered variants, composable
- ⬜ **List** - Ordered/unordered list with items
- ⬜ **Badge** - Small status indicator
- ⬜ **Avatar** - User profile image
- ✅ **Tooltip** - Hover information with positioning and delay

## Navigation

- ⬜ **Breadcrumb** - Navigation trail
- ⬜ **Pagination** - Page navigation
- ⬜ **Dropdown** - Menu dropdown

## Priority Order (MVP)

These components should be implemented first as they provide the most value:

1. **Button** - Most commonly used, teaches variant patterns
2. **Input** - Foundation for forms
3. **Card** - Foundation for layouts
4. **Modal** - Common UI pattern
5. **Alert** - User feedback
6. **Spinner** - Loading states
7. **Tooltip** - UI enhancement
8. **Table** - Data display

## Usage

Once implemented, components can be generated with:

```bash
# Generate single component
npm run generate:spa:component ./my-app Button

# Generate multiple components (bulk)
npm run generate:spa:component ./my-app Button,Input,Card

# Generate with variants (future feature)
npm run generate:spa:component ./my-app Button styled
npm run generate:spa:component ./my-app Button headless
```

## Component Structure

Each component will follow this structure:

```
src/components/
├── <component-name>/
│   ├── <component-name>.tsx         # Component implementation
│   ├── <component-name>.module.css  # Component styles
│   ├── <component-name>.types.ts    # TypeScript interfaces
│   └── index.ts                     # Re-exports for cleaner imports
```

## Template Location

Component templates are organized by category:

```
templates/ui-components/
├── form/                    # Form components
│   ├── button/
│   │   ├── button.tsx.template
│   │   ├── button.module.css.template
│   │   ├── button.types.ts.template
│   │   └── index.ts.template
│   └── input/
├── layout/                  # Layout components
│   ├── card/
│   └── modal/
├── feedback/                # Feedback components
│   ├── alert/
│   └── spinner/
├── data-display/            # Data display components
│   ├── tooltip/
│   └── table/
├── navigation/              # Navigation components
│   ├── breadcrumb/
│   ├── pagination/
│   └── dropdown/
└── COMPONENTS.md (this file)
```

## Notes

- All components should be **unstyled by default** with minimal CSS
- Components should be **accessible** (ARIA attributes where needed)
- Components should be **composable** (work well together)
- TypeScript types should be **exported** for consumer use
- Each component should support **ref forwarding** where applicable
