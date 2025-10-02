# Generate Command

Generates code in existing projects (pages, components, layouts, etc).

## Usage

```bash
npm run generate:spa:feature <project_path> <name>
npm run ungenerate:spa:feature <project_path> <name>

npm run generate:spa:context <project_path> <name> [wrap] [page_name]
npm run ungenerate:spa:context <project_path> <name>
```

## Parameters

- `project_path`: Path to the project (relative or absolute)
- `name`: Name(s) of the feature(s) - supports comma-separated for bulk operations
- `wrap`: (context only) Wrap app or page with provider
- `page_name`: (context only) Specific page to wrap (omit for root)

## Examples

```bash
# Generate a single feature
npm run generate:spa:feature ./my-app dashboard

# Generate multiple features (comma-separated)
npm run generate:spa:feature ./my-app dashboard,settings,profile

# Generate with multi-word name (converted to kebab-case)
npm run generate:spa:feature ./my-app "user profile"

# Generate context
npm run generate:spa:context ./my-app theme

# Generate context and wrap root
npm run generate:spa:context ./my-app theme wrap

# Generate context and wrap specific page
npm run generate:spa:context ./my-app auth wrap dashboard

# Remove a single feature
npm run ungenerate:spa:feature ./my-app dashboard

# Remove multiple features
npm run ungenerate:spa:feature ./my-app dashboard,settings,profile
```

## Supported Feature Types

### feature
Generates a full feature page with:
- Page component in `src/pages/<name>/`
- Module CSS file
- Route entry in `src/routes/index.tsx`
- Navigation link in MainLayout

### context
Generates React Context with:
- Types file with interfaces
- Context creation
- Provider component
- Custom hook with error handling

## How It Works

1. Validates project path exists
2. Parses feature names (supports comma-separated bulk generation)
3. For each feature:
   - Creates folder structure
   - Generates files from templates
   - Updates routes file
   - Adds navigation link
4. Naming conventions:
   - Input: "user profile" or "user-profile"
   - Folder: `src/pages/user-profile/`
   - Component: `UserProfilePage`
   - File: `user-profile.page.tsx`
   - Route: `/user-profile`

## Templates Used

- Feature pages: `templates/spa/page/page.tsx.template`
- Feature styles: `templates/spa/page/page.module.css.template`

## Implementation

- Entry point: `scripts/generate/index.ts`
- Feature generator: `scripts/generate/spa/feature/up.ts`
- Feature remover: `scripts/generate/spa/feature/down.ts`

## Template Placeholders

- `{{FEATURE_NAME}}`: PascalCase name (e.g., "UserProfile")
- `{{KEBAB_CASE_NAME}}`: kebab-case name (e.g., "user-profile")
