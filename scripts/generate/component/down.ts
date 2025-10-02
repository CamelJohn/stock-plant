import { join } from 'node:path';
import { rm, access } from 'node:fs/promises';

function to_kebab_case(str: string): string {
  return str.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
}

const args = process.argv.slice(2);
const [project_path, app_type, ...component_name_parts] = args;

async function remove_single_component(project_root: string, component_name: string) {
  const kebab_case_name = to_kebab_case(component_name);
  const component_dir = join(project_root, 'src', 'components', kebab_case_name);

  console.info(`Removing component: ${component_name}`);
  console.info(`Directory: src/components/${kebab_case_name}\n`);

  // Delete component directory
  try {
    await rm(component_dir, { recursive: true, force: true });
    console.info(`✅ Component "${component_name}" removed!`);
  } catch (error) {
    console.error(`Error removing component "${component_name}":`, error);
  }
}

async function remove_components(
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
    console.error('Example: npm run ungenerate:spa:component ./my-app Button');
    console.error('Bulk: npm run ungenerate:spa:component ./my-app Button,Input,Card');
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

  console.info(`Removing ${component_names.length} component(s)...\n`);

  // Remove each component
  for (const component_name of component_names) {
    await remove_single_component(project_root, component_name);
  }

  console.info(`\n✅ All components removed successfully!`);
}

remove_components(project_path, app_type, component_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
