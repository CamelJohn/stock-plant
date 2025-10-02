import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const meta_url = fileURLToPath(import.meta.url);
const template_dir_name = dirname(meta_url);
const templates_base_path = join(template_dir_name, '..', '..', '..', '..', 'templates');

export interface IBuildCopyTemplateCommandArgs {
  app_type: string;
  file_name: string[];
  destination?: string[];
}

function handle_destination(file_name: string[], destination?: string[]) {
  if (!destination || destination.length === 0) {
    return join(...file_name);
  }

  return join(...destination, file_name.at(-1) ?? '');
}

export function build_copy_template_command({
  app_type,
  file_name,
  destination,
}: IBuildCopyTemplateCommandArgs) {
  const source_path = `${join(templates_base_path, app_type, ...file_name)}.template`;
  const destination_path = handle_destination(file_name, destination);

  return `cp -r "${source_path}" "${destination_path}"`;
}
