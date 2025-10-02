import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { copyFile, readdir, mkdir } from 'node:fs/promises';
import { read_app_manifest } from '../../../generators/manifest-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const [app_name, ...project_name_parts] = args;

async function init_app(app_name: string | undefined, project_name_parts: string[]) {
  if (!app_name) {
    console.error('Error: app_name is required');
    console.error('Usage: npm run init:app <app_name> <project_name>');
    console.error('Available apps: dashboard, ecommerce, cms, crm');
    process.exit(1);
  }

  if (!project_name_parts.length) {
    console.error('Error: project_name is required');
    console.error('Usage: npm run init:app <app_name> <project_name>');
    process.exit(1);
  }

  const project_name = project_name_parts.join(' ');

  console.info(`Initializing ${app_name} app: ${project_name}\n`);

  // Read the app manifest
  let manifest;
  try {
    manifest = await read_app_manifest(app_name);
  } catch (error) {
    console.error(`Error: App "${app_name}" not found`);
    console.error('Available apps: dashboard, ecommerce, cms, crm');
    process.exit(1);
  }

  console.info(`📦 ${manifest.description}\n`);

  // Step 1: Initialize base (spa, ssr, etc.)
  console.info(`Step 1/4: Initializing ${manifest.base} base...\n`);

  await run_command('npm', ['run', `init:${manifest.base}`, project_name]);

  console.info(`\n✅ Base ${manifest.base} initialized\n`);

  // Step 2: Generate additional pages from manifest
  console.info('Step 2/4: Generating additional pages...\n');

  const base_pages = ['home', 'welcome', 'dashboard', 'not-found', 'login', 'signup'];
  const additional_pages = manifest.pages
    .filter(page => !base_pages.includes(page.name))
    .map(page => page.name);

  if (additional_pages.length > 0) {
    console.info(`Creating pages: ${additional_pages.join(', ')}\n`);
    await run_command('npm', [
      'run',
      'generate:spa:feature',
      project_name,
      additional_pages.join(',')
    ]);

    // Copy app-specific page templates if they exist
    const templates_dir = join(__dirname, '../../../templates/apps', app_name, 'pages');
    for (const page_name of additional_pages) {
      try {
        const page_template_dir = join(templates_dir, page_name);
        const page_output_dir = join(process.cwd(), project_name, 'src', 'pages', page_name);

        const files = await readdir(page_template_dir);
        for (const file of files) {
          if (file.endsWith('.template')) {
            const source = join(page_template_dir, file);
            const dest = join(page_output_dir, file.replace('.template', ''));
            await copyFile(source, dest);
            console.info(`  Copied ${page_name}/${file.replace('.template', '')}`);
          }
        }
      } catch (error) {
        // Template doesn't exist, that's ok - generic page was already generated
      }
    }

    console.info('\n✅ Additional pages generated\n');
  } else {
    console.info('No additional pages needed\n');
  }

  // Step 3: Generate features (if any)
  if (manifest.features && manifest.features.length > 0) {
    console.info('Step 3/4: Generating features...\n');

    for (const feature of manifest.features) {
      if (typeof feature === 'object' && feature !== null && 'name' in feature) {
        const featureName = (feature as { name: string; description?: string }).name;
        const featureDesc = (feature as { name: string; description?: string }).description || '';
        console.info(`  - ${featureName}: ${featureDesc}`);
      }
    }
    console.info('\n⚠️  Feature generation coming soon...\n');
  } else {
    console.info('Step 3/4: No additional features\n');
  }

  // Step 4: Generate components (if any)
  if (manifest.components && manifest.components.length > 0) {
    console.info('Step 4/4: Generating components...\n');

    for (const component of manifest.components) {
      if (typeof component === 'object' && component !== null && 'name' in component) {
        const componentName = (component as { name: string; description?: string }).name;
        const componentDesc = (component as { name: string; description?: string }).description || '';
        console.info(`  - ${componentName}: ${componentDesc}`);
      }
    }
    console.info('\n⚠️  Component generation coming soon...\n');
  } else {
    console.info('Step 4/4: No additional components\n');
  }

  // Summary
  console.info('\n🎉 App initialized successfully!\n');
  console.info('What was generated:');
  console.info(`  - Base ${manifest.base} project with auth`);
  console.info(`  - ${manifest.pages.length} pages`);
  if (manifest.features) {
    console.info(`  - ${manifest.features.length} features (placeholders)`);
  }
  if (manifest.components) {
    console.info(`  - ${manifest.components.length} components (placeholders)`);
  }
  console.info('\nNext steps:');
  console.info(`  1. cd ${project_name}`);
  console.info('  2. npm run dev');
  console.info('\nTest credentials: demo@example.com / password\n');
}

function run_command(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('exit', (code: number | null) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code ?? 'unknown'}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

init_app(app_name, project_name_parts).catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
