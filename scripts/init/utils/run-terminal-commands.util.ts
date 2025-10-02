import { exec } from 'node:child_process';
import { promisify } from 'node:util';

interface IRunTerminalCommandArgs {
  commands: string[];
  action_name: string;
  cwd: string;
}

const exec_async = promisify(exec);

export async function run_terminal_commands({
  commands,
  action_name,
  cwd,
}: IRunTerminalCommandArgs) {
  console.info(`Started ${action_name}...\n`);

  for (const command of commands) {
    try {
      console.info(`- Running command "${command}"\n`);
      const { stderr } = await exec_async(command, { cwd });
      if (stderr) console.error(stderr);
    } catch (error: any) {
      console.error(`Failed to ${action_name}:`, error.message);
      throw error;
    }
  }

  console.info(`${action_name} was successfull\n`);
}
