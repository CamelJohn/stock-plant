import { join } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { run_terminal_commands } from './utils/run-terminal-commands.util.js';
import { build_copy_template_command } from './utils/build-copy-template-command.util.js';
import { generate_template } from '../../../generators/generate-template.js';

const APP_TYPE = 'spa';

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
      build_copy_template_command({ app_type: APP_TYPE, file_name: ['vite.config.ts'], destination: [] }),
    ],
    action_name: 'scaffold project folders',
    cwd: project_root_path,
  });

  const templates = [
    ['main.tsx', ''],
    ['index.css', ''],
    ['main-layout.module.css', 'layouts'],
    ['index.tsx', 'routes'],
  ];

  const commands = templates.map(([file_name, destination]) =>
    build_copy_template_command({
      app_type: APP_TYPE,
      file_name: file_name ? [file_name] : [],
      destination: destination ? [destination] : [],
    })
  );

  await run_terminal_commands({
    commands: commands,
    action_name: 'copy base templates',
    cwd: join(project_root_path, 'src'),
  });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'main-layout.tsx',
    output_path: join(project_root_path, 'src', 'layouts', 'main-layout.tsx'),
    replacements: { PROJECT_NAME: project_name },
  });

  // Generate home page (index)
  const home_page_dir = join(project_root_path, 'src', 'pages', 'home');
  await mkdir(home_page_dir, { recursive: true });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/page.tsx',
    output_path: join(home_page_dir, 'home.page.tsx'),
    replacements: {
      FEATURE_NAME: 'Home',
      KEBAB_CASE_NAME: 'home',
    },
  });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/page.module.css',
    output_path: join(home_page_dir, 'home.module.css'),
    replacements: {},
  });

  // Generate welcome page using same flow as feature generation
  const welcome_page_dir = join(project_root_path, 'src', 'pages', 'welcome');
  await mkdir(welcome_page_dir, { recursive: true });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/page.tsx',
    output_path: join(welcome_page_dir, 'welcome.page.tsx'),
    replacements: {
      FEATURE_NAME: 'Welcome',
      KEBAB_CASE_NAME: 'welcome',
    },
  });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/page.module.css',
    output_path: join(welcome_page_dir, 'welcome.module.css'),
    replacements: {},
  });

  // Add NavLink for Welcome page to MainLayout
  const main_layout_file = join(project_root_path, 'src', 'layouts', 'main-layout.tsx');
  const { replace_file_contents } = await import('./utils/replace-file-content.js');

  await replace_file_contents({
    file_path: main_layout_file,
    replacements: [
      {
        search: /(<NavLink to="\/.*?<\/ NavLink>)/,
        replace: `$1\n            <NavLink to="/welcome">Welcome</ NavLink>`,
      },
    ],
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
