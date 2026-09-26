import { cpSync, existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist/client');
const routes = ['', 'contact', 'experience', 'music-production', 'profile', 'projects', 'ko', 'ko/contact', 'ko/experience', 'ko/music-production', 'ko/profile', 'ko/projects'];
function collectProjectRoutes(dir, prefix = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relative = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) collectProjectRoutes(join(root, relative), relative);
    else {
      const match = relative.match(/^(ko\/)?projects\/(.+)\.html$/);
      if (match) routes.push(`${match[1] ?? ''}projects/${match[2]}`);
    }
  }
}
collectProjectRoutes(root);

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
