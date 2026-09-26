# Taebin Yoo portfolio

This is a code-based recreation of the public Framer portfolio at https://taebin-yoo.framer.website.

## Edit content

Text, links, project metadata, and image paths live in the JSON files under `content/`. Replace a file in `public/images/` or use the private admin screen to change a photo. Layout and responsive behavior live in `app/components/` and `app/globals.css`.

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
