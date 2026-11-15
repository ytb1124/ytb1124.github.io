import { createHash } from 'node:crypto';
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve, sep } from 'node:path';
import sharp from 'sharp';

const publicRoot = resolve('public');
const outputRoot = join(publicRoot, 'image-previews');
const sources = new Set([
  '/images/projects/tutti-demo-en.jpg',
  '/images/projects/tutti-demo-ko.jpg',
]);

function collectImagePaths(value) {
  if (typeof value === 'string') {
    if (/^\/(?!\/)[\w./-]+\.(jpe?g|png)$/i.test(value)) sources.add(value);
  } else if (value && typeof value === 'object') {
    for (const child of Object.values(value)) collectImagePaths(child);
  }
}

for (const name of await readdir('content')) {
  if (name.endsWith('.json')) collectImagePaths(JSON.parse(await readFile(join('content', name), 'utf8')));
}

const manifest = {};
const pending = [...sources].sort();
await rm(outputRoot, { recursive: true, force: true });

async function prepare(source) {
  const path = resolve(publicRoot, `.${source}`);
  if (!path.startsWith(publicRoot + sep) || path.startsWith(outputRoot + sep)) return;
  const input = await readFile(path).catch(error => {
    if (error.code === 'ENOENT') return null;
    throw error;
  });
  if (!input || input.length < 48 * 1024) return;

  const metadata = await sharp(input).metadata();
  if (!metadata.width || (metadata.pages ?? 1) > 1) return;
  const width = metadata.autoOrient.width;
  const isActivity = source.startsWith('/activities/');
  const candidates = isActivity ? [360, 720, 1080] : [360, 720, 1200, 1800];
  const outputWidths = [...new Set(candidates.map(candidate => Math.min(candidate, width)))];
  const png = metadata.format === 'png';
  const versions = [];

  for (const outputWidth of outputWidths) {
    const buffer = await sharp(input)
      .autoOrient()
      .resize({ width: outputWidth, kernel: 'lanczos3' })
      .webp({ quality: png ? 92 : 86, effort: 4, smartSubsample: true })
      .toBuffer();
    if (buffer.length >= input.length * 0.9) {
      if (versions.length && outputWidth === outputWidths.at(-1)) versions.push({ src: source, width });
      continue;
    }
    const digest = createHash('sha256').update(buffer).digest('hex').slice(0, 10);
    const preview = `/image-previews${source}.${outputWidth}.${digest}.webp`;
    const destination = join(publicRoot, preview);
    await mkdir(dirname(destination), { recursive: true });
    await writeFile(destination, buffer);
    versions.push({ src: preview, width: outputWidth });
  }

  if (versions.length) manifest[source] = versions;
}

await Promise.all(Array.from({ length: 4 }, async () => {
  while (pending.length) await prepare(pending.shift());
}));

const ordered = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
await writeFile('app/data/generated-image-previews.json', JSON.stringify(ordered) + '\n');
console.log(`Prepared responsive previews for ${Object.keys(manifest).length} images.`);
