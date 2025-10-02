# Generate SPA Feature

Generates a feature page in an SPA project with routing and navigation.

## What Gets Generated

For a feature named "dashboard":

```
src/pages/dashboard/
  ├── dashboard.page.tsx      # Page component
  └── dashboard.module.css    # Page styles
```

Plus automatic updates to:
- `src/routes/index.tsx` - Adds route and import
- `src/layouts/main-layout.tsx` - Adds navigation link

## File Contents

### dashboard.page.tsx
```tsx
import styles from './dashboard.module.css';

export function DashboardPage() {
  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>
      <p>Welcome to the Dashboard page!</p>
    </div>
  );
}

export const Component = DashboardPage;
```

### Routes Update
```tsx
import { DashboardPage } from '../pages/dashboard/dashboard.page';

// Adds to children array:
{
  path: 'dashboard',
  Component: DashboardPage
}
```

### Navigation Update
```tsx
<NavLink to="/dashboard">Dashboard</NavLink>
```

## Bulk Generation

Generate multiple features at once:

```bash
npm run generate ./my-app spa feature dashboard,settings,profile
```

This creates:
- `src/pages/dashboard/`
- `src/pages/settings/`
- `src/pages/profile/`

Each with routes and nav links.

## Multi-word Features

Spaces are converted to kebab-case:

```bash
npm run generate ./my-app spa feature user settings
```

Creates:
- Folder: `src/pages/user-settings/`
- Component: `UserSettingsPage`
- Route: `/user-settings`

## Removal

```bash
npm run generate down ./my-app spa feature dashboard
```

Removes the `src/pages/dashboard/` folder.

**Note:** Does not automatically remove routes or nav links - you must clean those up manually.

## Implementation Details

- Uses `generate_template()` with `templates/spa/page/` templates
- Uses `replace_file_contents()` to update routes and layout
- Regex patterns:
  - Import insertion: `/(import.*from.*;\n)(\nconst routes)/`
  - Route insertion: `/(}\s*)(])/`
  - NavLink insertion: `/(<NavLink to="\/.*?<\/ NavLink>)/`

## Cross-platform

- Uses `path.sep` for OS-agnostic paths
- Template paths use forward slashes, converted automatically
- Works on Windows, macOS, Linux
