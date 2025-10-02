# Stock Plant

A CLI tool for scaffolding and generating code for web projects. Creates opinionated project structures with routing, navigation, and component generation.

## Quick Start

```bash
# Create a new SPA project
npm run init:spa my-app

# Generate features
npm run generate:spa:feature ./my-app dashboard,settings,profile

# Remove features
npm run ungenerate:spa:feature ./my-app dashboard

# Remove a project
npm run uninit:spa my-app
```

## Commands

### Init - Create Projects

```bash
npm run init:spa <project_name>
npm run uninit:spa <project_name>
```

Creates a complete project with folder structure, routing, and base pages.

**Available commands:**

- `init:spa` - Create SPA (React + Vite + React Router)
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

### UI Components Library

Pre-built, accessible UI components available as opt-in templates.

[View component library roadmap →](./templates/ui-components/COMPONENTS.md)

## Project Structure

```
stock-plant/
├── scripts/
│   ├── cli.ts              # CLI router (reads npm script name)
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
│   ├── spa/                # SPA templates
│   │   ├── *.template      # Init templates (flat)
│   │   ├── page/           # Feature templates
│   │   │   ├── page.tsx.template
│   │   │   └── page.module.css.template
│   │   └── context/        # Context templates
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
4. Add npm scripts: `init:<type>` and `uninit:<type>` in `package.json`

### Adding New Feature Types

1. Create `scripts/generate/spa/<type>/up.ts` and `down.ts`
2. Create templates in `templates/spa/<type>/`
3. Update `VALID_FEATURE_TYPES` in `scripts/generate/index.ts`
4. Add npm scripts: `generate:spa:<type>` and `ungenerate:spa:<type>` in `package.json`

## Technologies

- **Runtime:** Node.js with tsx
- **Language:** TypeScript
- **SPA Stack:** React 19 + Vite + React Router 7
- **Styling:** CSS Modules

## License

ISC
