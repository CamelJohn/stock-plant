# Claude Maintenance Instructions

This document contains instructions for Claude (or any AI assistant) to maintain this codebase effectively.

## Core Principles

1. **No Hardcoded Values**: Everything should be parameterized. App types, feature types, and paths should be passed as arguments, never hardcoded.

2. **No -- Flags**: npm intercepts `--` flags incorrectly. Use positional keyword arguments instead (e.g., `down` instead of `--down`, `wrap` instead of `--wrap`).

3. **CLI Routing**: Use `process.env.npm_lifecycle_event` to read the npm script name and parse it for routing (e.g., `generate:spa:feature` → app_type: spa, feature_type: feature). This keeps package.json DRY.

4. **Cross-Platform Compatibility**: Always use `path.join()` for paths. Never hardcode `/` or `\`. Use `path.sep` when converting template paths.

5. **Bulk by Default**: All generators should support both single and bulk operations. Single is just "bulk of 1". Parse comma-separated values.

6. **Documentation Sync**: When you modify code, ALWAYS update relevant README.md files. Documentation must stay in sync with implementation.

## Architecture Patterns

### CLI Routing with npm Script Names

Commands are routed based on the npm script name:

```
User runs: npm run generate:spa:feature ./app dashboard
         ↓
scripts/cli.ts (reads npm_lifecycle_event: "generate:spa:feature")
         ↓
Parses to: { action: 'generate', app_type: 'spa', feature_type: 'feature' }
         ↓
scripts/generate/index.ts (router with args: ./app spa feature dashboard)
         ↓
scripts/generate/spa/feature/up.ts (implementation)
```

**Key points:**
- `scripts/cli.ts` is the entry point for all commands
- Reads `process.env.npm_lifecycle_event` to get command name
- Parses command name (e.g., `init:spa`, `generate:spa:feature`, `ungenerate:spa:context`)
- Constructs arguments array and dispatches to appropriate script
- All package.json scripts point to the same `cli.ts` file

### Double-Dispatch Routing

- `index.ts` files are routers that dispatch to app-type and feature-type specific scripts
- Never hardcode app types or feature types in routers - use constants arrays
- Pass app_type as parameter to implementation scripts

### Template Organization

```
templates/
  ├── spa/
  │   ├── main.tsx.template          # Flat files for init
  │   ├── routes.tsx.template
  │   ├── page/                      # Nested for generators
  │   │   ├── page.tsx.template
  │   │   └── page.module.css.template
  │   └── context/
  │       ├── types.ts.template
  │       ├── context.tsx.template
  │       ├── provider.tsx.template
  │       └── use-context.ts.template
```

**Rule**: Init scripts use flat templates, generators use nested template folders.

### Template Placeholder Convention

Use uppercase snake case with double braces:

- `{{FEATURE_NAME}}` - PascalCase (components, types)
- `{{KEBAB_CASE_NAME}}` - kebab-case (files, folders, routes)
- `{{CAMEL_CASE_NAME}}` - camelCase (variables, hooks)
- `{{PROJECT_NAME}}` - Project name

### Naming Conversion Functions

Every generator script needs these three functions:

```typescript
function to_kebab_case(str: string): string {
  return str.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
}

function to_pascal_case(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

function to_camel_case(str: string): string {
  const pascal = to_pascal_case(str);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
```

## File Modification Patterns

### Adding Code (imports, routes, etc.)

Use `replace_file_contents` with regex:

```typescript
await replace_file_contents({
  file_path: routes_file,
  replacements: [
    {
      // Insert after last import
      search: /(import .* from .*;\n)(?!.*import)/s,
      replace: `$1${import_statement}\n`,
    },
    {
      // Insert before closing array bracket
      search: /(\];)/,
      replace: `  ${route_entry},\n$1`,
    },
  ],
});
```

### Removing Code (cleanup in down.ts)

Use regex to match and remove entire lines:

```typescript
// Remove import
const import_regex = new RegExp(
  `import \\{ ${pascal_case_name}Page \\} from ['"]../pages/${kebab_case_name}/${kebab_case_name}\\.page['"];?\\n`,
  'g'
);
content = content.replace(import_regex, '');

// Remove route entry
const route_regex = new RegExp(
  `\\s*\\{\\s*path:\\s*['"]/${kebab_case_name}['"],\\s*lazy:\\s*\\(\\)\\s*=>\\s*import\\(['"]../pages/${kebab_case_name}/${kebab_case_name}\\.page['"]\\),?\\s*\\},?\\n`,
  'g'
);
content = content.replace(route_regex, '');
```

## Common Operations

### Adding a New App Type (e.g., SSR)

1. Create `scripts/init/ssr/up.ts` and `down.ts`
2. Create `templates/ssr/` folder with templates
3. Update `VALID_APP_TYPES` in `scripts/init/index.ts`:
   ```typescript
   const VALID_APP_TYPES = ['spa', 'ssr', 'backend'];
   ```
4. Add npm scripts to `package.json`:
   ```json
   "init:ssr": "tsx ./scripts/cli.ts",
   "uninit:ssr": "tsx ./scripts/cli.ts"
   ```
   Note: The `cli.ts` parses the script name automatically
5. Update main README.md with new commands
6. Create `scripts/init/ssr/README.md`

### Adding a New Feature Type to SPA

1. Create `scripts/generate/spa/<type>/up.ts` and `down.ts`
2. Create `templates/spa/<type>/` with template files
3. Update `VALID_FEATURE_TYPES` in `scripts/generate/index.ts`:
   ```typescript
   const VALID_FEATURE_TYPES = ['feature', 'context', 'component', 'page'];
   ```
4. Add npm scripts to `package.json`:
   ```json
   "generate:spa:<type>": "tsx ./scripts/cli.ts",
   "ungenerate:spa:<type>": "tsx ./scripts/cli.ts"
   ```
   Note: The `cli.ts` parses the script name automatically
5. Update `scripts/generate/README.md`
6. Create `scripts/generate/spa/<type>/README.md`

### Implementing a Generator (up.ts)

Every generator should follow this pattern:

```typescript
// 1. Argument parsing with bulk support
const [project_path, app_type, ...name_parts] = process.argv.slice(2);
const names_string = name_parts.join(' ');
const names = names_string
  .split(',')
  .map((name) => name.trim())
  .filter((name) => name.length > 0);

// 2. Single item generator function
async function generate_single_item(
  project_root: string,
  app_type: string,
  item_name: string
) {
  const kebab_case_name = to_kebab_case(item_name);
  const pascal_case_name = to_pascal_case(item_name);

  // Create directories
  await mkdir(item_dir, { recursive: true });

  // Generate files from templates
  await generate_template({
    app_type,
    template_name: 'folder/file.tsx',
    output_path: join(item_dir, `${kebab_case_name}.tsx`),
    replacements: {
      PASCAL_CASE_NAME: pascal_case_name,
      KEBAB_CASE_NAME: kebab_case_name,
    },
  });

  // Update existing files (routes, layouts, etc.)
  await replace_file_contents({...});

  return { pascal_case_name, kebab_case_name };
}

// 3. Main function with validation and loop
async function generate_items(...) {
  // Validate arguments
  if (!project_path || !app_type || !names.length) {
    console.error('Error: missing required arguments');
    process.exit(1);
  }

  // Validate project
  try {
    await access(join(project_root, 'src'));
  } catch {
    console.error('Error: Invalid project path');
    process.exit(1);
  }

  // Generate each item
  for (const name of names) {
    await generate_single_item(project_root, app_type, name);
  }
}
```

### Implementing Teardown (down.ts)

Mirror the up.ts structure but with removal logic:

```typescript
async function remove_single_item(...) {
  // 1. Delete directories
  await rm(item_dir, { recursive: true, force: true });

  // 2. Clean up imports, routes, etc. with regex
  let file_content = await readFile(target_file, 'utf-8');
  file_content = file_content.replace(import_regex, '');
  file_content = file_content.replace(route_regex, '');
  await writeFile(target_file, file_content);
}

async function remove_items(...) {
  // Same validation as up.ts

  // Remove each item
  for (const name of names) {
    await remove_single_item(project_root, name);
  }
}
```

## Template Creation

### Template File Naming

- Use `.template` extension
- Use the actual filename structure: `page.tsx.template`, not `component.template`
- Organize in folders by feature type under `templates/<app_type>/`

### Template Content

```typescript
// Good - uses placeholders
import styles from './{{KEBAB_CASE_NAME}}.module.css';

export function {{FEATURE_NAME}}Page() {
  return <div>{{FEATURE_NAME}}</div>;
}

// Bad - hardcoded values
export function MyPage() {
  return <div>My Page</div>;
}
```

## Error Handling

### Path Validation

Always validate paths before operations:

```typescript
const src_path = join(project_root, 'src');
try {
  await access(src_path);
} catch {
  console.error(`Error: Invalid project path: ${project_path}`);
  process.exit(1);
}
```

### ES Module Compatibility

Use this pattern for `__dirname`:

```typescript
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## Testing Changes

After modifying code, mentally test these scenarios:

1. **Single operation**: `npm run generate ./app spa feature dashboard`
2. **Bulk operation**: `npm run generate ./app spa feature users,products,orders`
3. **Down operation**: `npm run ungenerate ./app spa feature dashboard`
4. **Invalid input**: Missing arguments, invalid paths
5. **Cross-platform**: Would this work on Windows? (check paths)

## Documentation Updates

When you change code, update these files:

### Code Change → Documentation Mapping

| Change Type                 | Update These Docs                                                       |
| --------------------------- | ----------------------------------------------------------------------- |
| Add app type                | Main README, scripts/init/README.md, create new app-specific README     |
| Add feature type            | Main README, scripts/generate/README.md, create feature-specific README |
| Change CLI syntax           | All relevant READMEs                                                    |
| Add template placeholders   | Feature-specific README                                                 |
| Change package.json scripts | Main README                                                             |
| Modify file structure       | Main README, feature README                                             |

### Documentation Style

- Use code blocks with bash syntax highlighting
- Show both single and bulk examples
- Include "What Gets Generated" sections
- Show actual generated code snippets
- List all file paths created
- Explain the "why" not just the "how"

## Antipatterns to Avoid

❌ **Hardcoded app type in generators**

```typescript
const APP_TYPE = 'spa'; // NO!
```

✅ **Pass as parameter**

```typescript
const [project_path, app_type, ...rest] = process.argv.slice(2);
```

❌ **Using -- flags**

```typescript
if (args.includes('--down')) // NO!
```

✅ **Positional keywords**

```typescript
if (args.includes('down')) // YES!
```

❌ **Hardcoded path separators**

```typescript
const template = `templates/spa/page.tsx.template`; // NO!
```

✅ **Cross-platform paths**

```typescript
const template = join('templates', 'spa', 'page.tsx.template'); // YES!
```

❌ **Forgetting bulk support**

```typescript
const feature_name = args[3]; // Single only - NO!
```

✅ **Parse comma-separated**

```typescript
const names = names_string.split(',').map((n) => n.trim()); // YES!
```

❌ **Incomplete teardown**

```typescript
// Only delete folder, forget to clean routes - NO!
await rm(feature_dir, { recursive: true });
```

✅ **Full cleanup**

```typescript
await rm(feature_dir, { recursive: true });
// Also remove imports, routes, nav links
```

## Self-Maintenance

This CLAUDE.md file should be updated whenever:

1. New architectural patterns are established
2. New conventions are adopted
3. Common mistakes are identified
4. New app types or feature types are added
5. Build/deployment processes change
6. Testing strategies evolve

When updating this file, follow the same principle: keep it concise, actionable, and focused on patterns rather than specific implementations.
