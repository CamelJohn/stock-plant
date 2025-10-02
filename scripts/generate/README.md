# Generate Command

Generates code in existing projects (pages, components, layouts, etc).

## Usage

```bash
npm run generate <project_path> <app_type> <feature_type> <name>
npm run generate down <project_path> <app_type> <feature_type> <name>
```

## Parameters

- `project_path`: Path to the project (relative or absolute)
- `app_type`: Type of application (spa, ssr, backend)
- `feature_type`: Type of feature to generate (feature, component, page)
- `name`: Name(s) of the feature(s)

## Flags

- `down`: Remove/delete the generated feature

## Examples

```bash
# Generate a single feature
npm run generate ./my-app spa feature dashboard

# Generate multiple features (comma-separated)
npm run generate ./my-app spa feature dashboard,settings,profile

# Generate with multi-word name (converted to kebab-case)
npm run generate ./my-app spa feature user profile

# Remove a feature
npm run generate down ./my-app spa feature dashboard
```

## Supported Feature Types

### feature
Generates a full feature page with:
- Page component in `src/pages/<name>/`
- Module CSS file
- Route entry in `src/routes/index.tsx`
- Navigation link in MainLayout

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
