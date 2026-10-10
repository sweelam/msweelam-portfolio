# msweelam.dev

Personal website for **Mohamed Sweelam** — Engineering Lead at Orki (AI & multi-agent systems), author, and mentor.

Deployed via GitHub Pages at [msweelam.dev](https://msweelam.dev).

---

## Site structure

```
/                   → Homepage (index.html)
/mentorship/        → Full mentorship program details
/news/              → News & announcements
/data/news.json     → News data file (edit here to add announcements)
/css/styles.css     → All styles (shared across pages)
/js/main.js         → Shared utilities (theme, nav, ⌘K palette, reveal, carousel)
/js/testimonials.js → Testimonial data + wall renderer (homepage & mentorship)
/js/news.js         → News page rendering
/js/mentorship.js   → Mentorship page data & carousels
/img/               → Images (logo-mark*.png = transparent MS monogram)
/favicon.svg        → SVG favicon (MS initials)
```

---

## How to add a news entry

Open `data/news.json` and prepend a new object to the array:

```json
{
  "date": "2025-06-01",
  "title": "Your announcement title",
  "body": "One or two paragraphs describing the announcement. Use \\n to separate paragraphs.",
  "link": "https://example.com",
  "linkText": "Read more"
}
```

- `link` and `linkText` are optional — omit them (or set to `null`) if there's no external link.
- Entries are automatically sorted newest-first on the `/news/` page.
- No build step needed — just save the file and push.

---

## How to add your headshot

1. Add your photo as `img/headshot.jpg` (recommended: 600×600 px, square crop).
2. In `index.html`, find the `<!-- TODO: add headshot -->` comment inside `.hero-photo` and replace the div with:

```html
<img src="img/headshot.jpg" alt="Mohamed Sweelam" class="hero-photo-img">
```

3. The `.hero-photo` placeholder div can then be converted to a regular container, or remove the `border: 1px dashed` style.

---

## SEO checklist

- [ ] Replace `img/og-image.svg` with a real `1200×630 PNG` for proper social sharing
- [ ] Confirm LinkedIn URL in `index.html` (marked with `TODO` comment)
- [ ] Set up Hashnode custom navbar link: Settings → Navbar → add `← msweelam.dev` pointing to `https://msweelam.dev`

---

## Unused image assets (safe to delete after review)

The following images are no longer referenced in any page:

- `img/mentoship-home-page.png`
- `img/mentoship-home-page-bkp.jpg`
- `img/registration-is-open.png`
- `img/warda-feedback.png`
- `img/mahmoud-photo.png` (`.jpg` version is used instead)
- `img/me-2.jpeg` (no longer referenced — keep if needed elsewhere)

---

## Local development

No build step required — open `index.html` directly, or serve with any static file server:

```bash
npx serve .
# or
python3 -m http.server 8080
```

> Note: The `/news/` page fetches `/data/news.json` via `fetch()`. This requires a local server (not `file://`).
