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
   - `src/features/` - Feature modules (auth, etc.)
   - `src/layouts/` - Layout components
   - `src/routes/` - React Router configuration
5. Generates base files:
   - `vite.config.ts` - Custom Vite config
   - `src/main.tsx` - Entry point with router wrapped in AuthProvider
   - `src/index.css` - Global styles
   - `src/layouts/main-layout.tsx` - Main layout with navigation
   - `src/layouts/main-layout.module.css` - Layout styles
6. Generates pages:
   - **Home page** (public, no auth required) at `src/pages/home/`
   - **Welcome page** (public, no auth required) at `src/pages/welcome/`
   - **Dashboard page** (protected, auth required) at `src/pages/dashboard/`
   - **Login page** at `src/pages/login/`
   - **Signup page** at `src/pages/signup/`
   - **404 Not Found page** at `src/pages/not-found/`
7. **Generates auth scaffold** (page variant):
   - Auth context with React Context API at `src/features/auth/context/`
   - Login/signup forms at `src/features/auth/components/`
   - Protected route component at `src/features/auth/components/protected-route.tsx`
   - Mock auth API at `src/api/auth.ts`
8. Sets up routes in `src/routes/index.tsx` with protected dashboard route
9. Adds navigation links to MainLayout (Home, Welcome, Dashboard)
10. Starts dev server

**Auth credentials for testing:**
- Email: `demo@example.com`
- Password: `password`

## Templates Used

- `templates/spa/*.template` - Base templates for init
- `templates/spa/page/page.tsx.template` - Page component template
- `templates/spa/page/page.module.css.template` - Page styles template
- `templates/spa/page/not-found.page.tsx.template` - 404 page template
- `templates/scaffold/auth/shared/` - Auth context and forms
- `templates/scaffold/auth/page/` - Auth page templates

## Implementation

- Entry point: `scripts/init/index.ts`
- SPA implementation: `scripts/init/spa/up.ts`
- Teardown: `scripts/init/spa/down.ts`
