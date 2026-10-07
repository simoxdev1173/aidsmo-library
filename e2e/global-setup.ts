import { execFileSync } from 'node:child_process';
import path from 'node:path';

export default function globalSetup() {
  if (!process.env.E2E_DATABASE_URL) return;

  execFileSync(
    process.execPath,
    [path.join(process.cwd(), 'node_modules', 'tsx', 'dist', 'cli.mjs'), path.join(process.cwd(), 'e2e', 'seed.ts')],
    { cwd: process.cwd(), env: process.env, stdio: 'inherit' },
  );
}
