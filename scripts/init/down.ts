import { run_terminal_commands } from './utils/run-terminal-commands.util.js';

const [project] = process.argv.slice(2);

async function cleanup(project?: string) {
  if (!project) throw new Error('<project_name> is required');

  await run_terminal_commands({
    action_name: 'cleanup vite app',
    commands: [`rm -rf ${project}`],
    cwd: process.cwd(),
  });
}

cleanup(project).catch((error) => {
  console.error(error.message);
  process.exit(1);
});
