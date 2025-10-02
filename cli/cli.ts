#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

interface IValidateReturn {
  valid: boolean;
  error?: string;
}

interface ICommandConfig {
  script: string;
  buildArgs: (parts: string[], userArgs: string[]) => string[];
  validate: (parts: string[]) => IValidateReturn;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const command = process.env.npm_lifecycle_event;
const args = process.argv.slice(2);

if (!command) {
  console.error('Error: Must be run via npm script');
  process.exit(1);
}

const parts = command.split(':');
const action = parts[0];

// Command routing configuration
const COMMAND_MAP: Record<string, ICommandConfig> = {
  init: {
    script: '../scripts/init/index.ts',
    buildArgs: (parts, userArgs) => {
      const app_type = parts[1]!; // Safe after validation
      return [app_type, ...userArgs];
    },
    validate: (parts) => ({
      valid: !!parts[1],
      error: 'Invalid command format. Expected: init:<app_type>',
    }),
  },
  uninit: {
    script: '../scripts/init/index.ts',
    buildArgs: (parts, userArgs) => {
      const app_type = parts[1]!; // Safe after validation
      return [app_type, 'down', ...userArgs];
    },
    validate: (parts) => ({
      valid: !!parts[1],
      error: 'Invalid command format. Expected: uninit:<app_type>',
    }),
  },
  generate: {
    script: '../scripts/generate/index.ts',
    buildArgs: (parts, userArgs) => {
      const app_type = parts[1]!; // Safe after validation
      const feature_type = parts[2]!; // Safe after validation
      // userArgs = [project_path, ...names]
      // Need: [project_path, app_type, feature_type, ...names]
      const project_path = userArgs[0]!;
      const names = userArgs.slice(1);
      return [project_path, app_type, feature_type, ...names];
    },
    validate: (parts) => ({
      valid: !!parts[1] && !!parts[2],
      error: 'Invalid command format. Expected: generate:<app_type>:<feature_type>',
    }),
  },
  ungenerate: {
    script: '../scripts/generate/index.ts',
    buildArgs: (parts, userArgs) => {
      const app_type = parts[1]!; // Safe after validation
      const feature_type = parts[2]!; // Safe after validation
      // userArgs = [project_path, ...names]
      // Need: [project_path, app_type, feature_type, ...names, 'down']
      const project_path = userArgs[0]!;
      const names = userArgs.slice(1);
      return [project_path, app_type, feature_type, ...names, 'down'];
    },
    validate: (parts) => ({
      valid: !!parts[1] && !!parts[2],
      error: 'Invalid command format. Expected: ungenerate:<app_type>:<feature_type>',
    }),
  },
};

const config = action ? COMMAND_MAP[action] : undefined;

if (!config) {
  console.error(`Error: Unknown command "${action}"`);
  console.error(`Available commands: ${Object.keys(COMMAND_MAP).join(', ')}`);
  process.exit(1);
}

const validation = config.validate(parts);
if (!validation.valid) {
  console.error(`Error: ${validation.error}`);
  process.exit(1);
}

const script_args = config.buildArgs(parts, args);
const script_path = join(__dirname, config.script);

spawn('tsx', [script_path, '--', ...script_args], { stdio: 'inherit' });
