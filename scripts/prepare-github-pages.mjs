import { cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = join(process.cwd(), 'dist/client');
const routes = ['', 'admin', 'contact', 'experience', 'music-production', 'profile', 'projects', 'publications', 'simple', 'ko', 'ko/contact', 'ko/experience', 'ko/music-production', 'ko/profile', 'ko/projects', 'ko/publications'];
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

const renamedProjects = {
  'audio-to-midi-system': 'passaggio',
  'listening-tool-ci': 'sound-manna',
};

for (const prefix of ['projects', 'ko/projects']) {
  const lang = prefix === 'projects' ? 'en' : 'ko';
  const label = lang === 'en' ? 'Open the project' : '프로젝트 열기';
  for (const [oldSlug, newSlug] of Object.entries(renamedProjects)) {
    const legacyRoute = join(root, prefix, oldSlug);
    const destination = `/${prefix}/${newSlug}/`;
    if (!existsSync(join(root, prefix, newSlug, 'index.html'))) {
      throw new Error(`Missing project redirect destination: ${destination}`);
    }

    const html = `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="canonical" href="https://taebin.link${destination}">
  <script>location.replace(${JSON.stringify(destination)} + location.search + location.hash);</script>
  <meta http-equiv="refresh" content="0; url=${destination}">
  <title>${label}</title>
</head>
<body><a href="${destination}">${label}</a></body>
</html>
`;
    mkdirSync(legacyRoute, { recursive: true });
    writeFileSync(join(legacyRoute, 'index.html'), html);
    writeFileSync(`${legacyRoute}.html`, html);
  }
}
