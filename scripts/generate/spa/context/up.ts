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

const args = process.argv.slice(2);

// Check for wrap argument (last arg after context names)
// Format: <project> <app_type> <context_name> [wrap] [page_name]
const [project_path, app_type, ...rest] = args;

let context_name_parts: string[];
let wrap_page: string | null = null;

// Check if 'wrap' is in the args
const wrap_index = rest.indexOf('wrap');
if (wrap_index !== -1) {
  // Everything before 'wrap' is context names
  context_name_parts = rest.slice(0, wrap_index);
  // Everything after 'wrap' is the page name (or empty for root)
  const page_parts = rest.slice(wrap_index + 1);
  wrap_page = page_parts.length > 0 ? page_parts.join(' ') : '';
} else {
  context_name_parts = rest;
}

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

  console.info(`✅ Context "${context_name}" generated!`);

  return { pascal_case_name, kebab_case_name };
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
  const generated_contexts = [];
  for (const context_name of context_names) {
    const result = await generate_single_context(project_root, app_type, context_name);
    generated_contexts.push(result);
  }

  // Handle wrapping if --wrap flag is provided
  if (wrap_page !== null) {
    console.info(`\nWrapping with provider(s)...\n`);
    const { readFile, writeFile } = await import('node:fs/promises');

    let target_file: string;
    if (wrap_page === '') {
      // Wrap root (main.tsx)
      target_file = join(project_root, 'src', 'main.tsx');
      console.info(`Wrapping root (src/main.tsx)`);
    } else {
      // Wrap specific page
      const page_kebab = to_kebab_case(wrap_page);
      target_file = join(project_root, 'src', 'pages', page_kebab, `${page_kebab}.page.tsx`);
      console.info(`Wrapping page: ${wrap_page} (src/pages/${page_kebab}/${page_kebab}.page.tsx)`);
    }

    let file_content = await readFile(target_file, 'utf-8');

    // Add imports at the top
    for (const { pascal_case_name, kebab_case_name } of generated_contexts) {
      const import_path =
        wrap_page === ''
          ? `./context/${kebab_case_name}/${kebab_case_name}.provider`
          : `../../context/${kebab_case_name}/${kebab_case_name}.provider`;

      const import_statement = `import { ${pascal_case_name}Provider } from '${import_path}';\n`;

      // Add import after last import statement
      const last_import_match = file_content.match(/(import .* from .*;\n)(?!.*import)/s);
      if (last_import_match) {
        file_content = file_content.replace(
          last_import_match[0],
          last_import_match[0] + import_statement
        );
      }
    }

    // Wrap the component/root with providers
    if (wrap_page === '') {
      // For main.tsx, wrap the <App /> or router
      for (const { pascal_case_name } of generated_contexts.reverse()) {
        file_content = file_content.replace(
          /(<RouterProvider[^>]*>)/,
          `<${pascal_case_name}Provider>\n      $1`
        );
        file_content = file_content.replace(
          /(<\/RouterProvider>)/,
          `$1\n    </${pascal_case_name}Provider>`
        );
      }
    } else {
      // For pages, wrap the return statement
      for (const { pascal_case_name } of generated_contexts.reverse()) {
        file_content = file_content.replace(
          /(return \(\s*<)/,
          `return (\n    <${pascal_case_name}Provider>\n      <`
        );
        file_content = file_content.replace(
          /(<\/div>\s*\);)/,
          `<\/div>\n    </${pascal_case_name}Provider>\n  );`
        );
      }
    }

    await writeFile(target_file, file_content);
    console.info(`✅ Wrapped successfully!\n`);
  }

  console.info(`\n✅ All contexts generated successfully!`);
}

generate_contexts(project_path, app_type, context_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
