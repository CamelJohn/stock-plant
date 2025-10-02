# Stock Plant

A CLI tool for scaffolding and generating code for web projects. Creates opinionated project structures with routing, navigation, and component generation.

## Quick Start

```bash
# Create a new SPA project (with auth included)
npm run init:spa my-app

# Test credentials: demo@example.com / password
# Navigate to /dashboard to see protected route in action

# Generate additional features
npm run generate:spa:feature ./my-app settings,profile

# Remove features
npm run ungenerate:spa:feature ./my-app settings

# Remove a project
npm run uninit:spa my-app
```

## Commands

### Init - Create Projects

```bash
npm run init:spa <project_name>
npm run uninit:spa <project_name>
```

Creates a complete project with folder structure, routing, auth, and base pages.

**What you get:**
- React + Vite + React Router setup
- **Authentication system** (login/signup pages with mock API)
- **Protected routes** (`/dashboard` requires auth)
- **Public routes** (`/` and `/welcome` are public)
- 404 error page
- Main layout with navigation

**Test credentials:** demo@example.com / password

**Available commands:**

- `init:spa` - Create SPA with auth included
- `uninit:spa` - Delete SPA project
- `init:ssr` - Coming soon
- `init:backend` - Coming soon

[Full init documentation →](./scripts/init/README.md)

### Generate - Add Features

```bash
npm run generate:spa:feature <project_path> <name>
npm run ungenerate:spa:feature <project_path> <name>

npm run generate:spa:context <project_path> <name> [wrap] [page_name]
npm run ungenerate:spa:context <project_path> <name>
```

Generates code within existing projects.

**Available commands:**

- `generate:spa:feature` - Full feature page with routing and navigation
- `generate:spa:context` - React Context with provider and hook
- More coming soon (component, page, etc.)

**Supports bulk generation:**

```bash
npm run generate:spa:feature ./my-app users,products,orders
npm run ungenerate:spa:feature ./my-app users,products
```

[Full generate documentation →](./scripts/generate/README.md)

### Scaffold - Complete Patterns

Build complete, interconnected features that span multiple layers (context + components + pages + API).

**Note:** `init:spa` now includes auth by default (page variant). Use scaffold commands to add auth to existing projects or switch variants.

```bash
npm run scaffold:auth <project_path> [variant]
npm run unscaffold:auth <project_path>
```

**Auth variants:**
- `modal` - Content-blocking modal auth (best for internal tools/dashboards)
- `page` - Traditional login/signup pages with redirects (best for SEO-friendly apps) **[default in init:spa]**
- `hybrid` - Both modal and page approaches

**Example:**
```bash
npm run scaffold:auth ./existing-app modal
npm run scaffold:auth ./existing-app page
npm run scaffold:auth ./existing-app hybrid
```

**What gets scaffolded:**
- Complete auth context with React Context API
- Login/signup forms with validation
- Auth API with mock implementation
- Protected route components
- Pages (for page/hybrid variants)
- Modal (for modal/hybrid variants)

[Full scaffold documentation →](./scripts/scaffold/auth/README.md)

### UI Components Library

Pre-built, accessible UI components available as opt-in templates.

```bash
npm run generate:component <project_path> <component_name>
npm run ungenerate:component <project_path> <component_name>
```

**Example:**
```bash
npm run generate:component ./my-app Button,Input,Card
```

[View component library roadmap →](./templates/ui-components/COMPONENTS.md)

## Project Structure

```
stock-plant/
├── cli/
│   └── cli.ts              # CLI router (reads npm script name)
├── scripts/
│   ├── init/               # Project initialization
│   │   ├── index.ts        # Router for app types
│   │   ├── spa/            # SPA-specific init
│   │   │   ├── up.ts       # Create project
│   │   │   ├── down.ts     # Delete project
│   │   │   └── utils/      # Shared utilities
│   │   └── README.md
│   ├── generate/           # Code generation
│   │   ├── index.ts        # Router for generators
│   │   ├── spa/            # SPA-specific generators
│   │   │   └── feature/    # Feature generator
│   │   │       ├── up.ts   # Create feature
│   │   │       ├── down.ts # Delete feature
│   │   │       └── README.md
│   │   └── README.md
│   └── scaffold/           # Complete patterns (auth, etc.)
│       └── auth/           # Auth scaffold
│           ├── up.ts       # Generate auth
│           ├── down.ts     # Remove auth
│           └── README.md
├── generators/
│   └── generate-template.ts  # Generic template engine
├── templates/
│   ├── spa/                # SPA templates
│   │   ├── *.template      # Init templates (flat)
│   │   ├── page/           # Feature templates
│   │   │   ├── page.tsx.template
│   │   │   └── page.module.css.template
│   │   └── context/        # Context templates
│   ├── scaffold/           # Scaffold templates
│   │   └── auth/           # Auth templates
│   │       ├── shared/     # Shared across all variants
│   │       ├── modal/      # Modal-specific
│   │       ├── page/       # Page-specific
│   │       └── hybrid/     # Hybrid-specific
│   └── ui-components/      # UI component library
│       ├── COMPONENTS.md   # Component roadmap
│       └── button/         # Component templates (future)
└── package.json
```

## How It Works

### Templates

Templates use placeholder syntax:

- `{{FEATURE_NAME}}` - PascalCase name
- `{{KEBAB_CASE_NAME}}` - kebab-case name
- `{{PROJECT_NAME}}` - Project name

### Naming Conventions

Input names are automatically converted:

| Input           | Folder           | Component          | File                     | Route            |
| --------------- | ---------------- | ------------------ | ------------------------ | ---------------- |
| "dashboard"     | `dashboard/`     | `DashboardPage`    | `dashboard.page.tsx`     | `/dashboard`     |
| "user settings" | `user-settings/` | `UserSettingsPage` | `user-settings.page.tsx` | `/user-settings` |

### Generated SPA Structure

```
my-app/
├── src/
│   ├── api/              # API calls
│   ├── components/       # Reusable components
│   ├── context/          # React context
│   ├── features/         # Feature modules (scaffolds)
│   │   └── auth/         # Auth feature (from scaffold)
│   │       ├── context/
│   │       └── components/
│   ├── layouts/          # Layout components
│   │   ├── main-layout.tsx
│   │   └── main-layout.module.css
│   ├── pages/            # Page components
│   │   ├── home/
│   │   │   ├── home.page.tsx
│   │   │   └── home.module.css
│   │   ├── not-found/
│   │   │   ├── not-found.page.tsx
│   │   │   └── not-found.module.css
│   │   └── welcome/
│   │       ├── welcome.page.tsx
│   │       └── welcome.module.css
│   ├── routes/           # React Router config
│   │   └── index.tsx
│   ├── main.tsx          # App entry
│   └── index.css         # Global styles
├── vite.config.ts
└── package.json
```

## Features

✅ Cross-platform (Windows, macOS, Linux)
✅ Type-safe with TypeScript
✅ **Authentication included by default** with login/signup pages
✅ **Protected routes** with automatic redirects
✅ Automatic routing setup
✅ Navigation links generation
✅ Module CSS scoping
✅ Bulk feature generation
✅ Complete auth scaffolding (3 variants: modal, page, hybrid)
✅ 404 error pages
✅ Customizable templates

## Development

### Adding New App Types

1. Create `scripts/init/<type>/up.ts` and `down.ts`
2. Create `templates/<type>/` folder
3. Update `VALID_APP_TYPES` in `scripts/init/index.ts`
4. Add npm scripts: `init:<type>` and `uninit:<type>` in `package.json`

### Adding New Feature Types

1. Create `scripts/generate/spa/<type>/up.ts` and `down.ts`
2. Create templates in `templates/spa/<type>/`
3. Update `VALID_FEATURE_TYPES` in `scripts/generate/index.ts`
4. Add npm scripts: `generate:spa:<type>` and `ungenerate:spa:<type>` in `package.json`

### Adding New Scaffold Types

1. Create `scripts/scaffold/<type>/up.ts` and `down.ts`
2. Create templates in `templates/scaffold/<type>/`
3. Update `COMMAND_MAP` in `cli/cli.ts`
4. Add npm scripts: `scaffold:<type>` and `unscaffold:<type>` in `package.json`

## Technologies

- **Runtime:** Node.js with tsx
- **Language:** TypeScript
- **SPA Stack:** React 19 + Vite + React Router 7
- **Styling:** CSS Modules

## License

ISC
