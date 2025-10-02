import { join } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { run_terminal_commands } from './utils/run-terminal-commands.util.js';
import { build_copy_template_command } from './utils/build-copy-template-command.util.js';
import { generate_template } from '../../../generators/generate-template.js';

const APP_TYPE = 'spa';

function build_project_name(raw_project_name: string[]): string {
  const joined_raw_project_name = raw_project_name.join(' ');

  console.info(`Got <project_name>: ${joined_raw_project_name}\n`);

  const sanitized_raw_project_name = sanitize_project_name(joined_raw_project_name);

  return sanitized_raw_project_name.toLowerCase();
}

function sanitize_project_name(raw_project_name: string): string {
  return raw_project_name.replaceAll(' ', '-').replaceAll('_', '-');
}

const [...project_name] = process.argv.slice(2);

async function init(raw_project_name: string[]) {
  if (!raw_project_name.length) {
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
      build_copy_template_command({
        app_type: APP_TYPE,
        file_name: ['vite.config.ts'],
        destination: [],
      }),
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

  // Generate dashboard page (protected)
  const dashboard_page_dir = join(project_root_path, 'src', 'pages', 'dashboard');
  await mkdir(dashboard_page_dir, { recursive: true });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/page.tsx',
    output_path: join(dashboard_page_dir, 'dashboard.page.tsx'),
    replacements: {
      FEATURE_NAME: 'Dashboard',
      KEBAB_CASE_NAME: 'dashboard',
    },
  });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/page.module.css',
    output_path: join(dashboard_page_dir, 'dashboard.module.css'),
    replacements: {},
  });

  // Generate Not Found page
  const not_found_page_dir = join(project_root_path, 'src', 'pages', 'not-found');
  await mkdir(not_found_page_dir, { recursive: true });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/not-found.page.tsx',
    output_path: join(not_found_page_dir, 'not-found.page.tsx'),
    replacements: {},
  });

  await generate_template({
    app_type: APP_TYPE,
    template_name: 'page/not-found.module.css',
    output_path: join(not_found_page_dir, 'not-found.module.css'),
    replacements: {},
  });

  // Add NavLinks to MainLayout
  const main_layout_file = join(project_root_path, 'src', 'layouts', 'main-layout.tsx');
  const { replace_file_contents } = await import('./utils/replace-file-content.js');

  await replace_file_contents({
    file_path: main_layout_file,
    replacements: [
      {
        search: /(<NavLink to="\/.*?<\/ NavLink>)/,
        replace: `$1\n            <NavLink to="/welcome">Welcome</ NavLink>\n            <NavLink to="/dashboard">Dashboard</ NavLink>`,
      },
    ],
  });

  // Generate auth scaffold (page variant)
  console.info('\nGenerating auth scaffold...\n');

  const src_path = join(project_root_path, 'src');
  const features_dir = join(src_path, 'features', 'auth');

  await mkdir(join(features_dir, 'context'), { recursive: true });
  await mkdir(join(features_dir, 'components'), { recursive: true });
  await mkdir(join(src_path, 'api'), { recursive: true });

  // Generate shared context files
  const context_files = ['auth.types.ts', 'auth.context.ts', 'auth.provider.tsx', 'use-auth.ts'];

  for (const file of context_files) {
    await generate_template({
      app_type: '',
      template_name: `scaffold/auth/shared/context/${file}`,
      output_path: join(features_dir, 'context', file),
      replacements: {},
    });
  }

  // Generate API file
  await generate_template({
    app_type: '',
    template_name: 'scaffold/auth/shared/api/auth.ts',
    output_path: join(src_path, 'api', 'auth.ts'),
    replacements: {},
  });

  // Generate shared components (forms)
  const form_files = ['login-form.tsx', 'signup-form.tsx', 'auth-form.module.css'];

  for (const file of form_files) {
    await generate_template({
      app_type: '',
      template_name: `scaffold/auth/shared/components/${file}`,
      output_path: join(features_dir, 'components', file),
      replacements: {},
    });
  }

  // Generate login/signup pages
  const login_dir = join(src_path, 'pages', 'login');
  const signup_dir = join(src_path, 'pages', 'signup');

  await mkdir(login_dir, { recursive: true });
  await mkdir(signup_dir, { recursive: true });

  await generate_template({
    app_type: '',
    template_name: 'scaffold/auth/page/pages/login.page.tsx',
    output_path: join(login_dir, 'login.page.tsx'),
    replacements: {},
  });

  await generate_template({
    app_type: '',
    template_name: 'scaffold/auth/page/pages/signup.page.tsx',
    output_path: join(signup_dir, 'signup.page.tsx'),
    replacements: {},
  });

  await generate_template({
    app_type: '',
    template_name: 'scaffold/auth/page/pages/auth-page.module.css',
    output_path: join(login_dir, 'auth-page.module.css'),
    replacements: {},
  });

  await generate_template({
    app_type: '',
    template_name: 'scaffold/auth/page/pages/auth-page.module.css',
    output_path: join(signup_dir, 'auth-page.module.css'),
    replacements: {},
  });

  // Generate protected route component
  await generate_template({
    app_type: '',
    template_name: 'scaffold/auth/page/components/protected-route.tsx',
    output_path: join(features_dir, 'components', 'protected-route.tsx'),
    replacements: {},
  });

  // Wrap app with AuthProvider in main.tsx
  const main_file = join(src_path, 'main.tsx');
  let main_content = await readFile(main_file, 'utf-8');

  // Add AuthProvider import
  const lines = main_content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i]?.startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex !== -1) {
    lines.splice(
      lastImportIndex + 1,
      0,
      `import { AuthProvider } from './features/auth/context/auth.provider';`
    );
    main_content = lines.join('\n');
  }

  // Wrap with AuthProvider
  main_content = main_content.replace(/(<StrictMode>\n)/, `$1    <AuthProvider>\n      `);

  main_content = main_content.replace(/(  <\/StrictMode>)/, `    </AuthProvider>\n$1`);

  await writeFile(main_file, main_content);

  console.info('✅ Auth scaffold generated!\n');

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
