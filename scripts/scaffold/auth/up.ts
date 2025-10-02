import { join } from 'node:path';
import { mkdir, access, readFile, writeFile } from 'node:fs/promises';
import { generate_template } from '../../../generators/generate-template.js';

const args = process.argv.slice(2).filter((arg) => arg !== '--');
const [project_path, variant = 'page'] = args;

const VALID_VARIANTS = ['modal', 'page', 'hybrid'];

async function scaffold_auth(
  project_path: string | undefined,
  variant: string
) {
  if (!project_path) {
    console.error('Error: project_path is required');
    console.error('Usage: npm run scaffold:auth <project_path> [variant]');
    console.error('Variants: modal, page, hybrid (default: page)');
    process.exit(1);
  }

  if (!VALID_VARIANTS.includes(variant)) {
    console.error(`Error: Invalid variant "${variant}"`);
    console.error(`Valid variants: ${VALID_VARIANTS.join(', ')}`);
    process.exit(1);
  }

  const project_root = join(process.cwd(), project_path);
  const src_path = join(project_root, 'src');

  // Validate project
  try {
    await access(src_path);
  } catch {
    console.error(`Error: Invalid project path: ${project_path}`);
    console.error('Make sure the path points to a valid project folder');
    process.exit(1);
  }

  console.info(`Scaffolding auth with "${variant}" variant...\n`);

  // Create directories
  const features_dir = join(src_path, 'features', 'auth');
  await mkdir(join(features_dir, 'context'), { recursive: true });
  await mkdir(join(features_dir, 'components'), { recursive: true });
  await mkdir(join(src_path, 'api'), { recursive: true });

  // Generate shared context files
  const context_files = [
    'auth.types.ts',
    'auth.context.ts',
    'auth.provider.tsx',
    'use-auth.ts',
  ];

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
  const form_files = [
    'login-form.tsx',
    'signup-form.tsx',
    'auth-form.module.css',
  ];

  for (const file of form_files) {
    await generate_template({
      app_type: '',
      template_name: `scaffold/auth/shared/components/${file}`,
      output_path: join(features_dir, 'components', file),
      replacements: {},
    });
  }

  // Read main.tsx once
  const main_file = join(src_path, 'main.tsx');
  let main_content = await readFile(main_file, 'utf-8');

  // Build imports array
  const imports_to_add: string[] = [
    `import { AuthProvider } from './features/auth/context/auth.provider';`,
  ];

  // Generate variant-specific files
  if (variant === 'modal' || variant === 'hybrid') {
    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/modal/components/auth-modal.tsx',
      output_path: join(features_dir, 'components', 'auth-modal.tsx'),
      replacements: {},
    });

    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/modal/components/auth-modal.module.css',
      output_path: join(features_dir, 'components', 'auth-modal.module.css'),
      replacements: {},
    });

    imports_to_add.push(`import { AuthModal } from './features/auth/components/auth-modal';`);
  }

  // Add all imports after the last existing import
  const imports_block = imports_to_add.join('\n');
  // Split by lines, find last import, insert after it
  const lines = main_content.split('\n');
  let lastImportIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) {
      lastImportIndex = i;
    }
  }

  if (lastImportIndex !== -1) {
    lines.splice(lastImportIndex + 1, 0, imports_block);
    main_content = lines.join('\n');
  }

  // Modify JSX structure
  if (variant === 'modal' || variant === 'hybrid') {
    // Wrap with AuthProvider and add AuthModal
    main_content = main_content.replace(
      /(<StrictMode>\n)/,
      `$1    <AuthProvider>\n      <AuthModal />\n      `
    );

    main_content = main_content.replace(
      /(  <\/StrictMode>)/,
      `    </AuthProvider>\n$1`
    );
  } else {
    // For page variant, just wrap with AuthProvider
    main_content = main_content.replace(
      /(<StrictMode>\n)/,
      `$1    <AuthProvider>\n      `
    );

    main_content = main_content.replace(
      /(  <\/StrictMode>)/,
      `    </AuthProvider>\n$1`
    );
  }

  if (variant === 'page' || variant === 'hybrid') {
    // Generate login/signup pages
    await mkdir(join(src_path, 'pages', 'login'), { recursive: true });
    await mkdir(join(src_path, 'pages', 'signup'), { recursive: true });

    // Generate login page
    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/page/pages/login.page.tsx',
      output_path: join(src_path, 'pages', 'login', 'login.page.tsx'),
      replacements: {},
    });

    // Generate signup page
    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/page/pages/signup.page.tsx',
      output_path: join(src_path, 'pages', 'signup', 'signup.page.tsx'),
      replacements: {},
    });

    // Generate shared auth page styles
    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/page/pages/auth-page.module.css',
      output_path: join(src_path, 'pages', 'login', 'auth-page.module.css'),
      replacements: {},
    });

    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/page/pages/auth-page.module.css',
      output_path: join(src_path, 'pages', 'signup', 'auth-page.module.css'),
      replacements: {},
    });

    // Generate protected route component
    await generate_template({
      app_type: '',
      template_name: 'scaffold/auth/page/components/protected-route.tsx',
      output_path: join(features_dir, 'components', 'protected-route.tsx'),
      replacements: {},
    });
  }

  // Write main.tsx once
  await writeFile(main_file, main_content);

  console.info(`\n✅ Auth scaffold generated successfully!`);
  console.info(`\nVariant: ${variant}`);
  console.info('\nGenerated files:');
  console.info('  - src/features/auth/context/');
  console.info('  - src/features/auth/components/');
  console.info('  - src/api/auth.ts');

  if (variant === 'page' || variant === 'hybrid') {
    console.info('  - src/pages/login/');
    console.info('  - src/pages/signup/');
  }

  console.info('\nNext steps:');
  console.info('  1. Update src/api/auth.ts with your actual API endpoints');
  console.info('  2. Customize the auth forms in src/features/auth/components/');

  if (variant === 'modal' || variant === 'hybrid') {
    console.info('  3. AuthModal will automatically show when user is not authenticated');
  }

  if (variant === 'page' || variant === 'hybrid') {
    console.info('  3. Add login/signup routes to your router configuration:');
    console.info('     { path: "/login", Component: LoginPage }');
    console.info('     { path: "/signup", Component: SignupPage }');
    console.info('  4. Wrap protected routes with <ProtectedRoute> component');
  }
}

scaffold_auth(project_path, variant).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
