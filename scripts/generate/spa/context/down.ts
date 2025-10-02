import { join } from 'node:path';
import { rm, access } from 'node:fs/promises';

function to_kebab_case(str: string): string {
  return str.replace(/\s+/g, '-').replace(/_/g, '-').toLowerCase();
}

const [project_path, app_type, ...context_name_parts] = process.argv.slice(2);

async function remove_single_context(project_root: string, context_name: string) {
  const kebab_case_name = to_kebab_case(context_name);
  const context_dir = join(project_root, 'src', 'context', kebab_case_name);

  console.info(`Removing: ${context_name} (src/context/${kebab_case_name})`);

  await rm(context_dir, { recursive: true, force: true });

  console.info(`✅ Context "${context_name}" removed!\n`);
}

async function remove_contexts(
  project_path: string | undefined,
  app_type: string | undefined,
  raw_context_names?: string[]
) {
  if (!project_path) {
    console.error('Error: project_path is required');
    process.exit(1);
  }

  if (!app_type) {
    console.error('Error: app_type is required (passed from generate script)');
    process.exit(1);
  }

  if (!raw_context_names || !raw_context_names.length) {
    console.error('Error: <context_name> is required');
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

  // Parse context names - support comma-separated or space-separated
  const context_names_string = raw_context_names.join(' ');
  const context_names = context_names_string
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  console.info(`Removing ${context_names.length} context(s)...\n`);

  // Remove each context
  for (const context_name of context_names) {
    await remove_single_context(project_root, context_name);
  }

  console.info(`✅ All contexts removed successfully!`);
}

remove_contexts(project_path, app_type, context_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
