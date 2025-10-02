import { join } from 'node:path';
import { rm } from 'node:fs/promises';

function to_kebab_case(str: string): string {
  return str
    .replace(/\s+/g, '-')
    .replace(/_/g, '-')
    .toLowerCase();
}

const [...feature_name_parts] = process.argv.slice(2);

async function remove_feature(raw_feature_name?: string[]) {
  if (!raw_feature_name || !raw_feature_name.length) {
    console.error('Error: <feature_name> is required');
    process.exit(1);
  }

  const feature_name = raw_feature_name.join(' ');
  const kebab_case_name = to_kebab_case(feature_name);

  const current_working_directory = process.cwd();
  const feature_dir = join(current_working_directory, 'src', 'pages', kebab_case_name);

  console.info(`Removing feature: ${feature_name}`);
  console.info(`Directory: src/pages/${kebab_case_name}\n`);

  await rm(feature_dir, { recursive: true, force: true });

  console.info(`✅ Feature removed!\n`);
  console.info(`Don't forget to remove the route from src/routes/index.tsx\n`);
}

remove_feature(feature_name_parts).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
