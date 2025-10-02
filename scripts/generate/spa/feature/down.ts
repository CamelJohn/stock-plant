import { join } from 'node:path';
import { rm, access, readFile, writeFile } from 'node:fs/promises';

function to_kebab_case(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

function to_pascal_case(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');
}

const [project_path, app_type, ...feature_name_parts] = process.argv.slice(2);

async function remove_single_feature(project_root: string, feature_name: string) {
  const kebab_case_name = to_kebab_case(feature_name);
  const feature_dir = join(project_root, 'src', 'pages', kebab_case_name);

  console.info(`Removing: ${feature_name} (src/pages/${kebab_case_name})`);

  await rm(feature_dir, { recursive: true, force: true });

  console.info(`✅ Feature "${feature_name}" removed!\n`);
}

async function remove_features(
  project_path: string | undefined,
  app_type: string | undefined,
  raw_feature_names?: string[]
) {
  if (!project_path) {
    console.error('Error: project_path is required');
    process.exit(1);
  }

  if (!app_type) {
    console.error('Error: app_type is required (passed from generate script)');
    process.exit(1);
  }

  if (!raw_feature_names || !raw_feature_names.length) {
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

  // Parse feature names - support comma-separated or space-separated
  const feature_names_string = raw_feature_names.join(' ');
  const feature_names = feature_names_string
    .split(',')
    .map(name => name.trim())
    .filter(name => name.length > 0);

  console.info(`Removing ${feature_names.length} feature(s)...\n`);

  // Remove each feature folder
  for (const feature_name of feature_names) {
    await remove_single_feature(project_root, feature_name);
  }

  // Clean up routes file
  const routes_file = join(project_root, 'src', 'routes', 'index.tsx');
  let routes_content = await readFile(routes_file, 'utf-8');

  for (const feature_name of feature_names) {
    const kebab_case_name = to_kebab_case(feature_name);
    const pascal_case_name = to_pascal_case(feature_name);

    // Remove import statement
    const import_regex = new RegExp(`import \\{ ${pascal_case_name}Page \\} from ['"]../pages/${kebab_case_name}/${kebab_case_name}\\.page['"];?\\n`, 'g');
    routes_content = routes_content.replace(import_regex, '');

    // Remove route entry
    const route_regex = new RegExp(`,?\\s*\\{\\s*path:\\s*['"]${kebab_case_name}['"],\\s*Component:\\s*${pascal_case_name}Page\\s*\\}`, 'g');
    routes_content = routes_content.replace(route_regex, '');
  }

  await writeFile(routes_file, routes_content);

  // Clean up MainLayout nav links
  const main_layout_file = join(project_root, 'src', 'layouts', 'main-layout.tsx');
  let layout_content = await readFile(main_layout_file, 'utf-8');

  for (const feature_name of feature_names) {
    const kebab_case_name = to_kebab_case(feature_name);
    const pascal_case_name = to_pascal_case(feature_name);

    // Remove NavLink
    const nav_link_regex = new RegExp(`\\s*<NavLink to=["']/${kebab_case_name}["']>${pascal_case_name}</ NavLink>`, 'g');
    layout_content = layout_content.replace(nav_link_regex, '');
  }

  await writeFile(main_layout_file, layout_content);

  console.info(`✅ Routes and navigation links cleaned up!`);
}

remove_features(project_path, app_type, feature_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
