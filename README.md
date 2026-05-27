# Honda Rearview Camera Recall Checker

An English static tool page targeting:

`nhtsa honda rearview camera recall`

## Files

- `index.html` - SEO-ready single page
- `styles.css` - responsive UI
- `app.js` - NHTSA recall API checker
- `robots.txt` - crawler rule
- `sitemap.xml` - sitemap placeholder
- `privacy.html` - basic privacy policy
- `server.js` - local preview server

## Before Deployment

Current production URL:

`https://honda-rearview-camera-recall-checker.pages.dev/`

If you move to a custom domain later, update:

- `index.html`
- `robots.txt`
- `sitemap.xml`

with your real domain.

Also replace the contact paragraph in `privacy.html`.

## Local Preview

```bash
npm run preview
```

Then open:

```text
http://127.0.0.1:5174
```

## Deploy Options

Cloudflare Pages:

1. Create a new Pages project.
2. Upload this folder or connect a Git repository.
3. Build command: leave empty.
4. Output directory: `/`.
5. Add your custom domain.

Netlify:

1. Drag this folder into Netlify Drop.
2. Add a custom domain after deploy.

Vercel:

1. Import this folder as a static project.
2. Build command: leave empty.
3. Output directory: leave default or set to `.`.

## Google Search Console

After the domain is live:

1. Add the domain property in Google Search Console.
2. Verify DNS ownership.
3. Submit `https://your-domain.com/sitemap.xml`.
4. Use URL Inspection on the homepage.
5. Click Request Indexing.

## Monetization

Leave ads off until Google Search Console shows impressions or clicks. Then add one ad unit in the `ad-slot` area first.
