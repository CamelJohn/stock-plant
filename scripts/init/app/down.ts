import { join } from 'node:path';
import { rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const [app_name, ...project_name_parts] = args;

async function uninit_app(app_name: string | undefined, project_name_parts: string[]) {
  if (!app_name) {
    console.error('Error: app_name is required');
    console.error('Usage: npm run uninit:app <app_name> <project_name>');
    process.exit(1);
  }

  if (!project_name_parts.length) {
    console.error('Error: project_name is required');
    console.error('Usage: npm run uninit:app <app_name> <project_name>');
    process.exit(1);
  }

  const project_name = project_name_parts.join(' ');
  const project_path = join(process.cwd(), project_name);

  console.info(`Removing ${app_name} app: ${project_name}\n`);

  try {
    await rm(project_path, { recursive: true, force: true });
    console.info(`✅ ${project_name} removed successfully\n`);
  } catch (error) {
    console.error(`Error removing project: ${(error as Error).message}`);
    process.exit(1);
  }
}

uninit_app(app_name, project_name_parts).catch((error: Error) => {
  console.error(error.message);
  process.exit(1);
});
