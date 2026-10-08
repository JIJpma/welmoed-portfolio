# Welmoed IJpma — portfolio

Static portfolio site for Welmoed IJpma (content creator), hosted on GitHub Pages.

- `index.html`, `styles.css`, `script.js`: the whole site, no build step
- `assets/img`: photos as WebP (`name-800.webp` for thumbnails, `name.webp` for full size)
- `assets/video`: H.264 MP4s (with audio) plus a poster frame for each
- `assets/fonts`: self-hosted Instrument Serif and DM Sans

All images and videos come from the earlier Canva site.

## Run locally

```bash
python -m http.server 8123
```

Then open http://localhost:8123.

## Deploy

Pushing to `main` publishes the site through GitHub Pages (branch `main`, folder `/`).
