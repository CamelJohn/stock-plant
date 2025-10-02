import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);

const is_down = args.includes('down');
const remaining_args = args.filter((arg) => arg !== 'down' && arg !== '--');

const [app_type, ...project_name] = remaining_args;

const VALID_APP_TYPES = ['spa', 'ssr', 'backend'];

if (!app_type || !VALID_APP_TYPES.includes(app_type)) {
  console.error(`Error: Invalid or missing app type.`);
  console.error(`Usage: npm run init [down] <type> <project_name>`);
  console.error(`Valid types: ${VALID_APP_TYPES.join(', ')}`);
  process.exit(1);
}

if (!is_down && !project_name.length) {
  console.error('Error: <project_name> is required');
  process.exit(1);
}

const script_name = is_down ? `down.ts` : 'up.ts';
const init_script = join(__dirname, app_type, script_name);

const action = is_down ? 'Tearing down' : 'Initializing';
console.info(`${action} ${app_type} project...\n`);

const child = spawn('tsx', [init_script, ...project_name], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
