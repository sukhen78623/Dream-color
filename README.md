# Dream Color – Phase 1

Free, private color tools. Phase 1 contains the website foundation, the animated
brand identity, the Home page and the Color Palette Generator.

Plain HTML, CSS and JavaScript. No frameworks, no backend, no database, no
tracking. Everything runs in the visitor's browser.

---

## 1. Folder structure

```
dream-color/
├── index.html                      Home page
├── color-palette-generator/
│   └── index.html                  Palette generator + SEO landing page
├── shared/
│   ├── site.js                     Site settings: tool list, logo, "which page is live"
│   ├── header.js                   Shared header (inserted instantly, no loading delay)
│   └── footer.js                   Shared footer + automatic copyright year
├── assets/
│   ├── css/
│   │   ├── style.css               Layout and design
│   │   └── animations.css          The reusable colour-animation system
│   ├── js/
│   │   ├── color-utils.js          Colour maths + harmony rules (reused by future tools)
│   │   ├── palette-generator.js    Palette generator interface
│   │   └── home.js                 Home page preview strip
│   └── images/
│       ├── favicon.svg
│       └── og-image.png            Image shown when the site is shared
├── robots.txt
├── sitemap.xml
├── _headers                        Small security headers (Cloudflare reads this)
└── README.md
```

Changes from the suggested structure (all to keep things simple and reliable):

- `shared/header.html` and `shared/footer.html` are not used. Fetching HTML files
  at runtime causes a flash of empty header and can fail on static hosts, so the
  header and footer markup lives in `header.js` and `footer.js` and is inserted
  immediately.
- `shared/site.js` holds the one list of tools. Header and footer both read it.
- `color-utils.js` holds the colour maths so the Color Converter, Contrast Checker
  and Gradient Generator can reuse it later.

## 2. Test locally

Open a terminal in the `dream-color` folder and run:

```
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser. (Opening the files by
double-clicking will not work, because links start with `/`, which needs a server.)

Quick checklist:
- Logo letters in "Color" change colors slowly, in the header and the footer.
- Press **Generate palette** or the **space bar**; unlocked colors change.
- Lock a color, generate again; it stays.
- Try all five harmony modes.
- Tap **Edit** to choose a custom color; it locks automatically.
- Tap a HEX / RGB / HSL value to copy; try the three export buttons.
- Narrow the browser window; the menu button should appear.

## 3. Deploy on Cloudflare Pages from a phone

Cloudflare's "Direct Upload" accepts a **.zip file**, so you can do this entirely
from your phone browser.

1. Download `dream-color.zip` to your phone.
2. Open https://dash.cloudflare.com and log in.
3. Go to **Workers & Pages**.
4. Tap **Create application**, then **Get started** under *Drag and drop your files*
   (look for the **Pages** / **Upload your static files** option).
5. Enter a project name, for example `dream-color`, and continue.
6. Tap the upload area and choose `dream-color.zip` from your phone's files.
7. Tap **Deploy site**.
8. When it finishes, your site is live at `https://<project-name>.pages.dev`.
9. Open the link and test the Home page and the Color Palette Generator.

To update the site later: open the project, choose **Create new deployment**,
and upload a new zip.

To use your own domain: in the project, open **Custom domains** and follow the steps.

## 4. Before you go live (important for SEO)

The pages contain the placeholder `YOUR-DOMAIN.com`. When you know the final
address, replace it with the real one (for example `https://dreamcolor.com`) in:

- `index.html` (canonical, `og:url`, `og:image`, JSON-LD)
- `color-palette-generator/index.html` (canonical, `og:url`, `og:image`, JSON-LD)
- `robots.txt` (Sitemap line)
- `sitemap.xml` (two `<loc>` lines)

Then submit `sitemap.xml` in Google Search Console and use its data to guide
future keyword decisions.

## 5. Adding a future tool (after you approve it)

1. Create a folder such as `gradient-generator/index.html`. Copy the structure of
   the palette page (head, header placeholder, footer placeholder, scripts).
2. In `shared/site.js`, change that tool's `live: false` to `live: true`.
   Header and footer update on every page automatically.
3. Add the page to `sitemap.xml`.

Footer pages (About, Contact, Privacy Policy, Terms of Service) work the same
way: they stay hidden until you set `live: true` in `shared/site.js`.

## 6. The animation system (`assets/css/animations.css`)

- **Logo:** "Dream" stays still; each letter of "Color" glides through every hue
  on its own timing (18 s cycle). All hues use the same perceived lightness, so
  the logo stays readable.
- **Accent line:** thin moving gradient under the header.
- **Hero glow:** a soft, slowly rotating color haze (GPU-friendly).
- **Primary button:** slowly moving color ring.
- **Palette:** colors fade smoothly; text values rise in with a small stagger.
- **Reduced motion:** if a visitor has "reduce motion" turned on, all movement
  stops. The logo stays multicolor but still.
