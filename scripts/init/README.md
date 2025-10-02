# Init Command

Creates a new project from templates.

## Usage

```bash
npm run init:spa <project_name>
npm run uninit:spa <project_name>
```

## Parameters

- `project_name`: Name of the project (spaces allowed, will be converted to kebab-case)

## Examples

```bash
# Create a new SPA project
npm run init:spa my-app

# Create with spaces in name
npm run init:spa "My Awesome App"

# Delete a project
npm run uninit:spa my-app
```

## What it does (SPA)

1. Creates Vite React-TS project
2. Installs react-router dependency
3. Removes default Vite boilerplate (App.css, App.tsx)
4. Creates folder structure:
   - `src/pages/` - Page components
   - `src/context/` - React context
   - `src/api/` - API calls
   - `src/components/` - Reusable components
   - `src/layouts/` - Layout components
   - `src/routes/` - React Router configuration
5. Generates base files:
   - `vite.config.ts` - Custom Vite config
   - `src/main.tsx` - Entry point with router
   - `src/index.css` - Global styles
   - `src/layouts/main-layout.tsx` - Main layout with navigation
   - `src/layouts/main-layout.module.css` - Layout styles
6. Generates Home page at `src/pages/home/`
7. Generates Welcome page at `src/pages/welcome/`
8. Sets up routes in `src/routes/index.tsx`
9. Adds navigation links to MainLayout
10. Starts dev server

## Templates Used

- `templates/spa/*.template` - Base templates for init
- `templates/spa/page/page.tsx.template` - Page component template
- `templates/spa/page/page.module.css.template` - Page styles template

## Implementation

- Entry point: `scripts/init/index.ts`
- SPA implementation: `scripts/init/spa/up.ts`
- Teardown: `scripts/init/spa/down.ts`
