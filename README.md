# Stock Plant

A CLI tool for scaffolding and generating code for web projects. Creates opinionated project structures with routing, navigation, and component generation.

## Quick Start

```bash
# Create a new SPA project
npm run init spa my-app

# Generate features
npm run generate ./my-app spa feature dashboard,settings,profile

# Remove a project
npm run init down spa my-app
```

## Commands

### Init - Create Projects

```bash
npm run init <app_type> <project_name>
```

Creates a complete project with folder structure, routing, and base pages.

**Supported app types:**
- `spa` - Single Page Application (React + Vite + React Router)
- `ssr` - Server-Side Rendered (coming soon)
- `backend` - Backend API (coming soon)

[Full init documentation →](./scripts/init/README.md)

### Generate - Add Features

```bash
npm run generate <project_path> <app_type> <feature_type> <name>
```

Generates code within existing projects.

**Supported feature types:**
- `feature` - Full feature page with routing and navigation
- `component` - Reusable component (coming soon)
- `page` - Simple page (coming soon)

**Supports bulk generation:**
```bash
npm run generate ./my-app spa feature users,products,orders
```

[Full generate documentation →](./scripts/generate/README.md)

## Project Structure

```
stock-plant/
├── scripts/
│   ├── init/               # Project initialization
│   │   ├── index.ts        # Router for app types
│   │   ├── spa/            # SPA-specific init
│   │   │   ├── up.ts       # Create project
│   │   │   ├── down.ts     # Delete project
│   │   │   └── utils/      # Shared utilities
│   │   └── README.md
│   └── generate/           # Code generation
│       ├── index.ts        # Router for generators
│       ├── spa/            # SPA-specific generators
│       │   └── feature/    # Feature generator
│       │       ├── up.ts   # Create feature
│       │       ├── down.ts # Delete feature
│       │       └── README.md
│       └── README.md
├── generators/
│   └── generate-template.ts  # Generic template engine
├── templates/
│   └── spa/                # SPA templates
│       ├── *.template      # Init templates (flat)
│       └── page/           # Feature templates
│           ├── page.tsx.template
│           └── page.module.css.template
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

| Input | Folder | Component | File | Route |
|-------|--------|-----------|------|-------|
| "dashboard" | `dashboard/` | `DashboardPage` | `dashboard.page.tsx` | `/dashboard` |
| "user settings" | `user-settings/` | `UserSettingsPage` | `user-settings.page.tsx` | `/user-settings` |

### Generated SPA Structure

```
my-app/
├── src/
│   ├── api/              # API calls
│   ├── components/       # Reusable components
│   ├── context/          # React context
│   ├── layouts/          # Layout components
│   │   ├── main-layout.tsx
│   │   └── main-layout.module.css
│   ├── pages/            # Page components
│   │   ├── home/
│   │   │   ├── home.page.tsx
│   │   │   └── home.module.css
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
✅ Automatic routing setup
✅ Navigation links generation
✅ Module CSS scoping
✅ Bulk feature generation
✅ Customizable templates

## Development

### Adding New App Types

1. Create `scripts/init/<type>/up.ts` and `down.ts`
2. Create `templates/<type>/` folder
3. Update `VALID_APP_TYPES` in `scripts/init/index.ts`

### Adding New Feature Types

1. Create `scripts/generate/spa/<type>/up.ts` and `down.ts`
2. Create templates in `templates/spa/<type>/`
3. Update `VALID_FEATURE_TYPES` in `scripts/generate/index.ts`

## Technologies

- **Runtime:** Node.js with tsx
- **Language:** TypeScript
- **SPA Stack:** React 19 + Vite + React Router 7
- **Styling:** CSS Modules

## License

ISC
