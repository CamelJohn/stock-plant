import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';

const meta_url = fileURLToPath(import.meta.url);
const template_dir_name = dirname(meta_url);
const templates_base_path = join(template_dir_name, '..', 'templates');

interface IGenerateTemplateArgs {
  app_type: string;
  template_name: string;
  output_path: string;
  replacements?: Record<string, string>;
}

export async function generate_template({
  app_type,
  template_name,
  output_path,
  replacements = {},
}: IGenerateTemplateArgs) {
  const template_path = join(templates_base_path, app_type, `${template_name}.template`);
  const template = await readFile(template_path, 'utf-8');

  let content = template;

  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }

  await writeFile(output_path, content);
}
