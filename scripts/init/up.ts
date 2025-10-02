import { join } from 'node:path';
import { run_terminal_commands } from './utils/run-terminal-commands.util.js';
import { build_copy_template_command } from './utils/build-copy-template-command.util.js';
import { generate_template } from '../../generators/generate-template.js';

function build_project_name(raw_project_name: string[]) {
  const joined_raw_project_name = raw_project_name.join(' ');

  console.info(`Got <project_name>: ${joined_raw_project_name}\n`);

  const sanitized_raw_project_name = sanitize_project_name(joined_raw_project_name);

  return sanitized_raw_project_name.toLowerCase();
}

function sanitize_project_name(raw_project_name: string): string {
  return raw_project_name.replaceAll(' ', '-').replaceAll('_', '-');
}

const [...project_name] = process.argv.slice(2);

async function init(raw_project_name?: string[]) {
  if (!raw_project_name) {
    throw new Error('<project_name> is required');
  }

  const project_name = build_project_name(raw_project_name);
  const current_working_directory = process.cwd();
  const project_root_path = join(current_working_directory, project_name);

  await run_terminal_commands({
    commands: [`npm create vite@latest ${project_name} -- --template react-ts`],
    action_name: 'create vite app',
    cwd: current_working_directory,
  });

  await run_terminal_commands({
    commands: ['npm install react-router'],
    action_name: 'install dependencies',
    cwd: project_root_path,
  });

  await run_terminal_commands({
    commands: ['rm src/App*'],
    action_name: 'cleanup unused boilerplate',
    cwd: project_root_path,
  });

  await run_terminal_commands({
    commands: [
      'mkdir -p src/pages src/context src/api src/components src/layouts src/routes',
      build_copy_template_command({ file_name: ['vite.config.ts'], destination: [] }),
    ],
    action_name: 'scaffold project folders',
    cwd: project_root_path,
  });

  const templates = [
    ['main.tsx', ''],
    ['index.css', ''],
    ['main-layout.module.css', 'layouts'],
    ['index.tsx', 'routes'],
    ['welcome.tsx', 'pages'],
  ];

  const commands = templates.map(([file_name, destination]) =>
    build_copy_template_command({
      file_name: file_name ? [file_name] : [],
      destination: destination ? [destination] : [],
    })
  );

  await run_terminal_commands({
    commands: commands,
    action_name: 'replace root main.tsx',
    cwd: join(project_root_path, 'src'),
  });

  await generate_template({
    template_name: 'main-layout.tsx',
    output_path: join(project_root_path, 'src', 'layouts', 'main-layout.tsx'),
    replacements: { PROJECT_NAME: project_name },
  });

  await run_terminal_commands({
    commands: ['npm run dev'],
    action_name: 'start up',
    cwd: project_root_path,
  });

  console.info('Project initialized ✅');
}

init(project_name).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
