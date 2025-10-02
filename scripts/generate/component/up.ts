import { join } from 'node:path';
import { mkdir, access } from 'node:fs/promises';
import { generate_template } from '../../../generators/generate-template.js';

function to_kebab_case(str: string): string {
  return str.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
}

function to_pascal_case(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

const args = process.argv.slice(2);
const [project_path, app_type, ...component_name_parts] = args;

// Component category mapping
const COMPONENT_CATEGORIES: Record<string, string> = {
  button: 'form',
  input: 'form',
  textarea: 'form',
  select: 'form',
  checkbox: 'form',
  radio: 'form',
  toggle: 'form',
  card: 'layout',
  modal: 'layout',
  drawer: 'layout',
  tabs: 'layout',
  accordion: 'layout',
  grid: 'layout',
  stack: 'layout',
  alert: 'feedback',
  toast: 'feedback',
  spinner: 'feedback',
  progressbar: 'feedback',
  skeleton: 'feedback',
  table: 'data-display',
  list: 'data-display',
  badge: 'data-display',
  avatar: 'data-display',
  tooltip: 'data-display',
  breadcrumb: 'navigation',
  pagination: 'navigation',
  dropdown: 'navigation',
};

async function generate_single_component(
  project_root: string,
  app_type: string,
  component_name: string
) {
  const kebab_case_name = to_kebab_case(component_name);
  const pascal_case_name = to_pascal_case(component_name);

  // Determine category
  const category = COMPONENT_CATEGORIES[kebab_case_name.toLowerCase()];

  if (!category) {
    console.error(`Error: Unknown component "${component_name}"`);
    console.error(`Available components: ${Object.keys(COMPONENT_CATEGORIES).join(', ')}`);
    process.exit(1);
  }

  const component_dir = join(project_root, 'src', 'components', kebab_case_name);
  const template_base = `ui-components/${category}/${kebab_case_name}`;

  console.info(`Component: ${component_name}`);
  console.info(`Category: ${category}`);
  console.info(`Directory: src/components/${kebab_case_name}\n`);

  // Create component directory
  await mkdir(component_dir, { recursive: true });

  // Generate component files
  const files = [
    {
      template: `${template_base}/{{KEBAB_CASE_NAME}}.types.ts`,
      output: `${kebab_case_name}.types.ts`,
    },
    { template: `${template_base}/{{KEBAB_CASE_NAME}}.tsx`, output: `${kebab_case_name}.tsx` },
    {
      template: `${template_base}/{{KEBAB_CASE_NAME}}.module.css`,
      output: `${kebab_case_name}.module.css`,
    },
    { template: `${template_base}/index.ts`, output: 'index.ts' },
  ];

  for (const { template, output } of files) {
    const template_name = template.replace(/\{\{KEBAB_CASE_NAME\}\}/g, kebab_case_name);

    await generate_template({
      app_type: '', // Use ui-components directly, not app-specific
      template_name,
      output_path: join(component_dir, output),
      replacements: {
        PASCAL_CASE_NAME: pascal_case_name,
        KEBAB_CASE_NAME: kebab_case_name,
      },
    });
  }

  console.info(`✅ Component "${component_name}" generated!`);

  return { pascal_case_name, kebab_case_name };
}

async function generate_components(
  project_path: string | undefined,
  app_type: string | undefined,
  raw_component_names?: string[]
) {
  if (!project_path) {
    console.error('Error: project_path is required');
    process.exit(1);
  }

  if (!app_type) {
    console.error('Error: app_type is required (passed from generate script)');
    process.exit(1);
  }

  if (!raw_component_names || !raw_component_names.length) {
    console.error('Error: <component_name> is required');
    console.error('Example: npm run generate:spa:component ./my-app Button');
    console.error('Bulk: npm run generate:spa:component ./my-app Button,Input,Card');
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

  // Parse component names - support comma-separated or space-separated
  const component_names_string = raw_component_names.join(' ');
  const component_names = component_names_string
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  console.info(`Generating ${component_names.length} component(s)...\n`);

  // Generate each component
  for (const component_name of component_names) {
    await generate_single_component(project_root, app_type, component_name);
  }

  console.info(`\n✅ All components generated successfully!`);
}

generate_components(project_path, app_type, component_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
