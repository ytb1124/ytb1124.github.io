# Taebin Yoo portfolio

This is a code-based recreation of the public Framer portfolio at https://taebin-yoo.framer.website.

## Edit content

Text, links, project metadata, and image paths live in the JSON files under `content/`. Replace a file in `public/images/` or use the private admin screen to change a photo. Layout and responsive behavior live in `app/components/` and `app/globals.css`.

Set `hidden: true` on a project in `content/projects.json` to exclude it from public listings and both language versions of its detail page while retaining its source content.

The editable CV source is `content/taebin-yoo-cv.docx`. After editing, export and visually check the PDF, then replace `public/reports/taebin-yoo-cv.pdf`.

The English single-page portfolio is available at `/simple`. Its layout lives in `app/simple/`; its copy reads the same content as the main site rather than maintaining a separate draft:

- Introduction, name, portrait, education, career highlights, contact, and CV: `content/site.json`.
- Project order: `site.json` section lists. Titles, card summaries, images, visibility, and resources: `content/projects.json`. Technical roles: `content/project-summaries.json` (`en.build`), as on the original project detail pages.
- Music production titles, summaries, first process paragraph, recording credit, photos, and media links: `content/music-production.json`.
- Writing titles and citations: `site.json` (`pageContent.en.experience`). Paper and article URLs: the original project's resources, classified by `kind: "paper"` or `kind: "article"`. Both writing lists use `app/data/writing.ts`.

Edit these shared fields, including through `/admin`, then save and deploy normally. The same GitHub Pages build regenerates the original pages and `/simple`; no separate sync, scheduled task, or second save is needed. Personal story sections are intentionally omitted from `/simple`. Page-specific navigation and section labels remain in the layout.

`npm run build` also runs `npm run validate:simple`, which compares the exported pages with the current source content and checks catalog order, shared copy, resources, music highlights, and CV links. This fails deployment if a copied sentence drifts from its source.

## Run locally

```bash
npm install
npm run dev
```

## Build for GitHub Pages

```bash
npm run build
```

The build writes the static site to `dist/client` and creates directory-style route copies for GitHub Pages. The included workflow deploys that directory whenever `main` is updated.

## Admin

The private editing screen is available at `/admin`. Public content is stored as JSON in `content/`, while the Cloudflare Worker in `admin-worker/` authenticates the administrator and commits approved edits and uploaded images to `main`. Worker credentials are stored only as Cloudflare secrets.
