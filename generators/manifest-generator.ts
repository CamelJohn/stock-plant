import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface Manifest {
  name: string;
  description?: string;
  [key: string]: any;
}

export async function read_manifest(manifest_path: string): Promise<Manifest> {
  const full_path = join(__dirname, '..', 'templates', manifest_path);
  const content = await readFile(full_path, 'utf-8');
  return JSON.parse(content) as Manifest;
}

export function apply_replacements(
  text: string,
  replacements: Record<string, string>
): string {
  let result = text;
  for (const [key, value] of Object.entries(replacements)) {
    const pattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(pattern, value);
  }
  return result;
}

export interface ScaffoldManifest extends Manifest {
  variants: {
    default: string;
    available: string[];
  };
  shared: {
    directories: string[];
    files: Record<string, string[]>;
  };
  variants_config: Record<string, any>;
  test_credentials?: {
    email: string;
    password: string;
  };
}

export async function read_scaffold_manifest(
  scaffold_type: string
): Promise<ScaffoldManifest> {
  return (await read_manifest(
    `scaffold/${scaffold_type}/manifest.json`
  )) as ScaffoldManifest;
}

export interface InitManifest extends Manifest {
  base: {
    type: string;
    command: string;
  };
  dependencies: {
    install: string[];
    cleanup: string[];
  };
  structure: {
    directories: string[];
  };
  templates: Record<string, any[]>;
  pages: Array<{
    name: string;
    protected: boolean;
    navigation: boolean;
    type?: string;
    route?: string;
  }>;
  scaffolds: Array<{
    type: string;
    variant: string;
    required: boolean;
  }>;
  post_setup?: {
    command: string;
  };
}

export async function read_init_manifest(app_type: string): Promise<InitManifest> {
  return (await read_manifest(`${app_type}/manifest.json`)) as InitManifest;
}

export interface AppManifest extends Manifest {
  base: string;
  scaffolds: Array<{
    type: string;
    variant?: string;
  }>;
  features: string[];
  components: string[];
  pages: Array<{
    name: string;
    protected: boolean;
    type?: string;
  }>;
  routes: Array<{
    path: string;
    page: string;
    protected: boolean;
  }>;
  navigation: string[];
}

export async function read_app_manifest(app_name: string): Promise<AppManifest> {
  return (await read_manifest(`apps/${app_name}/manifest.json`)) as AppManifest;
}
