import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// Check the exported pages against the editable source on every deployment.
// This catches stale copies even after a later edit to shared content.
const root = join(process.cwd(), 'dist/client');
const readJson = name => JSON.parse(readFileSync(`content/${name}.json`, 'utf8'));
const site = readJson('site');
const projects = readJson('projects');
const summaries = readJson('project-summaries');
const production = readJson('music-production');
const experience = site.pageContent.en.experience;
const normalize = text => String(text).replace(/\s+/g, ' ').trim();
const decode = text => text.replace(/&(amp|lt|gt|quot|apos|#x[\da-f]+|#\d+);/gi, (_, entity) => {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
  if (entity[0] !== '#') return named[entity.toLowerCase()];
  return String.fromCodePoint(entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1)));
});
function readPage(route) {
  const html = readFileSync(join(root, route ? `${route}.html` : 'index.html'), 'utf8');
  const visible = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<!--[\s\S]*?-->/g, '');
  return {
    html,
    text: normalize(decode(visible.replace(/<[^>]*>/g, ' '))),
    links: [...visible.matchAll(/\bhref="([^"]+)"/g)].map(match => decode(match[1])),
    projectSlugs: [...visible.matchAll(/<article class="simple-project" id="([^"]+)"/g)].map(match => match[1]),
  };
}
const simple = readPage('simple');
let checks = 0;
function copied(text, originalRoute) {
  if (!text) return;
  assert.ok(simple.text.includes(normalize(text)), `/simple is missing shared copy: ${text}`);
  if (originalRoute !== undefined) assert.ok(readPage(originalRoute).text.includes(normalize(text)), `Original /${originalRoute} is missing shared copy: ${text}`);
  checks++;
}

copied(site.name, '');
copied(site.home.intro, '');
copied(site.pageContent.en.contact.location, 'contact');
copied(site.pageContent.en.contact.intro, 'contact');
copied(site.contact.email, 'contact');
for (const field of ['school', 'degree', 'period', 'gpa']) copied(experience[field], 'experience');
for (const [, role, organization] of experience.highlights) {
  copied(role, 'experience');
  copied(organization, 'experience');
}
const publicBySlug = new Map(projects.filter(project => !project.hidden).map(project => [project.slug, project]));
const catalog = [...new Set(site.sections.flatMap(section => section.projectSlugs))].map(slug => publicBySlug.get(slug)).filter(Boolean);
assert.deepEqual(simple.projectSlugs, catalog.map(project => project.slug), 'Catalog order, additions, removals, and hidden projects must match the main catalog');
for (const project of catalog) {
  copied(project.title, 'projects');
  copied(project.summary?.en ?? project.description, 'projects');
  copied(summaries[project.slug]?.en?.build, `projects/${project.slug}`);
  if (project.plannedSubmission) copied(project.plannedSubmission.description.en, `projects/${project.slug}`);
  for (const resource of project.resources ?? []) assert.ok(simple.links.includes(resource.href), `Missing project resource: ${resource.href}`);
}
const ir = catalog.find(project => project.slug === 'corrective-impulse-response');
if (ir) for (const field of ['paperTitle', 'paperCitation', 'writingAward', 'magazineTitle', 'magazineCitation']) copied(experience[field].replace(/\s*↗$/, ''), 'experience');
copied(site.pageContent.en.music.intro, 'music-production');
for (const project of production.selectedProjects.projects) {
  copied(project.title, 'music-production');
  copied(project.question.en, 'music-production');
  copied(project.body.en[0], 'music-production');
  assert.ok(simple.links.includes(project.videoUrl), `Missing production video: ${project.id}`);
}
copied(production.studio.albumTitle, 'music-production');
copied(production.studio.note.en, 'music-production');
assert.ok(simple.links.includes(site.socials.cv), 'CV link must use the original CV');
assert.ok(simple.links.includes(production.studio.playlistUrl), 'Album link must match');
assert.ok(simple.links.includes(production.mixing.playlistUrl), 'Mixing playlist must match');
for (const href of simple.links.filter(link => link.startsWith('/'))) {
  const path = new URL(href, 'https://taebin.link').pathname.slice(1);
  assert.ok(existsSync(join(root, path)) || existsSync(join(root, `${path}.html`)), `Missing exported link: ${href}`);
}
assert.equal(readFileSync(join(root, 'simple/index.html'), 'utf8'), simple.html, 'Directory route must match /simple');
console.log(`Content sync verified: ${checks} shared text checks, ${catalog.length} projects, production highlights, resources, and CV.`);
