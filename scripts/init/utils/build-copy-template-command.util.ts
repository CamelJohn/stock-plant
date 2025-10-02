import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const meta_url = fileURLToPath(import.meta.url);
const template_dir_name = dirname(meta_url);
const templates_directory_path = ['..', '..', '..', 'templates'];

const templates_path = join(template_dir_name, ...templates_directory_path);

export interface IBuildCopyTemplateCommandArgs {
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
  file_name,
  destination,
}: IBuildCopyTemplateCommandArgs) {
  const source_path = `${join(templates_path, ...file_name)}.template`;
  const destination_path = handle_destination(file_name, destination);

  return `cp -r "${source_path}" "${destination_path}"`;
}
