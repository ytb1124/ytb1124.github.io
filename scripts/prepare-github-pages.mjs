import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist/client');
const routes = ['', 'contact', 'experience', 'profile', 'projects', 'ko', 'ko/contact', 'ko/experience', 'ko/profile', 'ko/projects'];

for (const route of routes) {
  if (!route) continue;
  const source = join(root, route ? `${route}.html` : 'index.html');
  if (!existsSync(source)) continue;
  const targetDir = join(root, route);
  mkdirSync(targetDir, { recursive: true });
  cpSync(source, join(targetDir, 'index.html'));
  const rsc = join(root, route ? `${route}.rsc` : 'index.rsc');
  if (existsSync(rsc)) cpSync(rsc, join(targetDir, 'index.rsc'));
}
