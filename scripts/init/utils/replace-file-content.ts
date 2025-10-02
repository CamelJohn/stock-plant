import { readFile, writeFile } from 'node:fs/promises';

interface IReplaceRecord {
  search: string | RegExp;
  replace: string;
}

interface IReplaceFileContentsArgs {
  file_path: string;
  replacements: IReplaceRecord[];
}

export async function replace_file_contents({ file_path, replacements }: IReplaceFileContentsArgs) {
  let original_content = await readFile(file_path, { encoding: 'utf-8' });

  for (const { search, replace } of replacements) {
    original_content = original_content.replace(search, replace);
  }

  await writeFile(file_path, original_content, { encoding: 'utf-8' });
}
