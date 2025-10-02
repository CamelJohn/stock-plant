import { join } from 'node:path';
import { mkdir, access } from 'node:fs/promises';
import { generate_template } from '../../../../generators/generate-template.js';
import { replace_file_contents } from '../../../init/spa/utils/replace-file-content.js';

function to_kebab_case(str: string): string {
  return str.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
}

function to_pascal_case(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

const [project_path, app_type, ...feature_name_parts] = process.argv.slice(2);

async function generate_feature(
  project_path: string | undefined,
  app_type: string | undefined,
  raw_feature_name?: string[]
) {
  if (!project_path) {
    console.error('Error: project_path is required');
    process.exit(1);
  }

  if (!app_type) {
    console.error('Error: app_type is required (passed from generate script)');
    process.exit(1);
  }
  if (!raw_feature_name || !raw_feature_name.length) {
    console.error('Error: <feature_name> is required');
    process.exit(1);
  }

  const project_root = join(process.cwd(), project_path);
  const src_path = join(project_root, 'src');

  // Check if we're in a valid project
  try {
    await access(src_path);
  } catch {
    console.error(`Error: Invalid project path: ${project_path}`);
    console.error('Make sure the path points to a valid project folder');
    process.exit(1);
  }

  const feature_name = raw_feature_name.join(' ');
  const kebab_case_name = to_kebab_case(feature_name);
  const pascal_case_name = to_pascal_case(feature_name);
  const feature_dir = join(project_root, 'src', 'pages', kebab_case_name);

  console.info(`Feature: ${feature_name}`);
  console.info(`Directory: src/pages/${kebab_case_name}\n`);

  // Create feature directory
  await mkdir(feature_dir, { recursive: true });

  // Generate page component
  await generate_template({
    app_type,
    template_name: 'page/page.tsx',
    output_path: join(feature_dir, `${kebab_case_name}.page.tsx`),
    replacements: {
      FEATURE_NAME: pascal_case_name,
      KEBAB_CASE_NAME: kebab_case_name,
    },
  });

  // Generate CSS module
  await generate_template({
    app_type,
    template_name: 'page/page.module.css',
    output_path: join(feature_dir, `${kebab_case_name}.module.css`),
    replacements: {},
  });

  // Add route to routes file
  const routes_file = join(project_root, 'src', 'routes', 'index.tsx');
  const import_statement = `import { ${pascal_case_name}Page } from '../pages/${kebab_case_name}/${kebab_case_name}.page';`;
  const route_entry = `, {\n        path: '${kebab_case_name}',\n        Component: ${pascal_case_name}Page\n    }`;

  await replace_file_contents({
    file_path: routes_file,
    replacements: [
      {
        // Add import at the top after existing imports
        search: /(import.*from.*;\n)(\nconst routes)/,
        replace: `$1${import_statement}\n$2`,
      },
      {
        // Add route to children array before closing bracket
        search: /(}\s*)(])/,
        replace: `$1${route_entry}$2`,
      },
    ],
  });

  // Add NavLink to MainLayout
  const main_layout_file = join(project_root, 'src', 'layouts', 'main-layout.tsx');
  const nav_link = `\n            <NavLink to="/${kebab_case_name}">${pascal_case_name}</ NavLink>`;

  await replace_file_contents({
    file_path: main_layout_file,
    replacements: [
      {
        // Add NavLink after existing nav links
        search: /(<NavLink to="\/.*?<\/ NavLink>)/,
        replace: `$1${nav_link}`,
      },
    ],
  });

  console.info(`\n✅ Feature generated, route and nav link added!`);
}

generate_feature(project_path, app_type, feature_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
