import { join } from 'node:path';
import { mkdir, access } from 'node:fs/promises';
import { generate_template } from '../../../../generators/generate-template.js';

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

const [project_path, app_type, ...context_name_parts] = process.argv.slice(2);

async function generate_single_context(
  project_root: string,
  app_type: string,
  context_name: string
) {
  const kebab_case_name = to_kebab_case(context_name);
  const pascal_case_name = to_pascal_case(context_name);
  const camel_case_name = to_camel_case(context_name);
  const context_dir = join(project_root, 'src', 'context', kebab_case_name);

  console.info(`Context: ${context_name}`);
  console.info(`Directory: src/context/${kebab_case_name}\n`);

  // Create context directory
  await mkdir(context_dir, { recursive: true });

  // Generate types file
  await generate_template({
    app_type,
    template_name: 'context/types.ts',
    output_path: join(context_dir, `${kebab_case_name}.types.ts`),
    replacements: {
      PASCAL_CASE_NAME: pascal_case_name,
    },
  });

  // Generate context file
  await generate_template({
    app_type,
    template_name: 'context/context.tsx',
    output_path: join(context_dir, `${kebab_case_name}.context.tsx`),
    replacements: {
      PASCAL_CASE_NAME: pascal_case_name,
      KEBAB_CASE_NAME: kebab_case_name,
    },
  });

  // Generate provider file
  await generate_template({
    app_type,
    template_name: 'context/provider.tsx',
    output_path: join(context_dir, `${kebab_case_name}.provider.tsx`),
    replacements: {
      PASCAL_CASE_NAME: pascal_case_name,
      KEBAB_CASE_NAME: kebab_case_name,
    },
  });

  // Generate hook file
  await generate_template({
    app_type,
    template_name: 'context/use-context.ts',
    output_path: join(context_dir, `use-${kebab_case_name}.ts`),
    replacements: {
      PASCAL_CASE_NAME: pascal_case_name,
      KEBAB_CASE_NAME: kebab_case_name,
      CAMEL_CASE_NAME: camel_case_name,
    },
  });

  console.info(`✅ Context "${context_name}" generated!\n`);
}

async function generate_contexts(
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

  console.info(`Generating ${context_names.length} context(s)...\n`);

  // Generate each context
  for (const context_name of context_names) {
    await generate_single_context(project_root, app_type, context_name);
  }

  console.info(`\n✅ All contexts generated successfully!`);
}

generate_contexts(project_path, app_type, context_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
