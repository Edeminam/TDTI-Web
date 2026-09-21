# TechRise DTI website

Static site (plain HTML/CSS/JS), hosted on Firebase Hosting (project `techriseweb`).

## Layout
- `public/` — everything that gets deployed (pages, `style.css`, `script.js`, `img/`, `robots.txt`, `sitemap.xml`, `404.html`).
- `img/` — original full-size source images. **Not deployed.** Export to WebP (max ~1400px wide) into `public/img/` before use.
- `firebase.json` — hosting config (clean URLs, security + cache headers).

## Local preview
`firebase emulators:start --only hosting` (clean URLs work), or `python3 -m http.server -d public` (use `/scholarships.html` etc.).

## Deploy
`firebase deploy --only hosting`

## Contact form (EmailJS)
Set the service ID, template ID and public key in `EMAILJS_CONFIG` at the top of the contact-form section of `public/script.js`.
Template variables: `from_name`, `from_email`, `interest`, `message`. Restrict allowed domains in the EmailJS dashboard.

## Notes
- After editing `style.css` / `script.js`, bump the `?v=` query string in each HTML file so returning visitors get the new version.
- The CSP in `firebase.json` only allows self-hosted scripts, Google Fonts, YouTube embeds and EmailJS. Update it if you add another third-party service.
- Canonical/OG/sitemap URLs use `https://techrisedti.org`.
