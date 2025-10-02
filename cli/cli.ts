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
      // Handle both: generate:component and generate:spa:feature
      const isComponent = parts[1] === 'component';

      if (isComponent) {
        // generate:component ./app Button -> [./app, spa, component, Button]
        const project_path = userArgs[0]!;
        const names = userArgs.slice(1);
        return [project_path, 'spa', 'component', ...names];
      } else {
        // generate:spa:feature ./app dashboard -> [./app, spa, feature, dashboard]
        const app_type = parts[1]!;
        const feature_type = parts[2]!;
        const project_path = userArgs[0]!;
        const names = userArgs.slice(1);
        return [project_path, app_type, feature_type, ...names];
      }
    },
    validate: (parts) => {
      const isComponent = parts[1] === 'component';
      if (isComponent) {
        return {
          valid: parts.length === 2,
          error: 'Invalid command format. Expected: generate:component',
        };
      }
      return {
        valid: !!parts[1] && !!parts[2],
        error: 'Invalid command format. Expected: generate:<app_type>:<feature_type>',
      };
    },
  },
  ungenerate: {
    script: '../scripts/generate/index.ts',
    buildArgs: (parts, userArgs) => {
      // Handle both: ungenerate:component and ungenerate:spa:feature
      const isComponent = parts[1] === 'component';

      if (isComponent) {
        // ungenerate:component ./app Button -> [./app, spa, component, Button, down]
        const project_path = userArgs[0]!;
        const names = userArgs.slice(1);
        return [project_path, 'spa', 'component', ...names, 'down'];
      } else {
        // ungenerate:spa:feature ./app dashboard -> [./app, spa, feature, dashboard, down]
        const app_type = parts[1]!;
        const feature_type = parts[2]!;
        const project_path = userArgs[0]!;
        const names = userArgs.slice(1);
        return [project_path, app_type, feature_type, ...names, 'down'];
      }
    },
    validate: (parts) => {
      const isComponent = parts[1] === 'component';
      if (isComponent) {
        return {
          valid: parts.length === 2,
          error: 'Invalid command format. Expected: ungenerate:component',
        };
      }
      return {
        valid: !!parts[1] && !!parts[2],
        error: 'Invalid command format. Expected: ungenerate:<app_type>:<feature_type>',
      };
    },
  },
  scaffold: {
    script: '../scripts/scaffold/auth/up.ts',
    buildArgs: (parts, userArgs) => {
      // scaffold:auth ./app [variant] -> [./app, variant]
      const scaffold_type = parts[1]!; // Safe after validation

      if (scaffold_type !== 'auth') {
        console.error(`Error: Unknown scaffold type "${scaffold_type}"`);
        console.error('Available scaffolds: auth');
        process.exit(1);
      }

      return userArgs; // Pass through as-is
    },
    validate: (parts) => ({
      valid: !!parts[1],
      error: 'Invalid command format. Expected: scaffold:<type>',
    }),
  },
  unscaffold: {
    script: '../scripts/scaffold/auth/down.ts',
    buildArgs: (parts, userArgs) => {
      // unscaffold:auth ./app -> [./app, auth]
      const scaffold_type = parts[1]!; // Safe after validation

      if (scaffold_type !== 'auth') {
        console.error(`Error: Unknown scaffold type "${scaffold_type}"`);
        console.error('Available scaffolds: auth');
        process.exit(1);
      }

      return userArgs; // Pass through as-is
    },
    validate: (parts) => ({
      valid: !!parts[1],
      error: 'Invalid command format. Expected: unscaffold:<type>',
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
