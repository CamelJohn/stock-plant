import { spawn } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);

const is_down = args.includes('down');
const remaining_args = args.filter((arg) => arg !== 'down' && arg !== '--');

const [project_path, app_type, feature_type, ...feature_name] = remaining_args;

const VALID_APP_TYPES = ['spa', 'ssr', 'backend'];
const VALID_FEATURE_TYPES = ['feature', 'context', 'component', 'page'];

if (!project_path) {
  console.error(`Error: Missing project path.`);
  console.error(`Usage: npm run generate [down] <project_path> <app_type> <feature_type> <name>`);
  console.error(`Example: npm run generate ./my-app spa feature dashboard`);
  process.exit(1);
}

if (!app_type || !VALID_APP_TYPES.includes(app_type)) {
  console.error(`Error: Invalid or missing app type.`);
  console.error(`Usage: npm run generate [down] <project_path> <app_type> <feature_type> <name>`);
  console.error(`Valid app types: ${VALID_APP_TYPES.join(', ')}`);
  console.error(`Valid feature types: ${VALID_FEATURE_TYPES.join(', ')}`);
  process.exit(1);
}

if (!feature_type || !VALID_FEATURE_TYPES.includes(feature_type)) {
  console.error(`Error: Invalid or missing feature type.`);
  console.error(`Usage: npm run generate [down] <project_path> <app_type> <feature_type> <name>`);
  console.error(`Valid feature types: ${VALID_FEATURE_TYPES.join(', ')}`);
  process.exit(1);
}

if (!feature_name.length) {
  console.error('Error: <name> is required');
  process.exit(1);
}

const script_name = is_down ? 'down.ts' : 'up.ts';
const generate_script = join(__dirname, app_type, feature_type, script_name);

const action = is_down ? 'Removing' : 'Generating';
console.info(`${action} ${feature_type} in ${app_type} project...\n`);

const child = spawn('tsx', [generate_script, project_path, app_type, ...feature_name], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
