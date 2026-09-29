# Rainbow Rattles — Baby Toys Store

A React + Vite recreation of the "Baby toys store website template (Community)" Figma homepage.

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## About the images

This environment could not get edit access to the Figma file, so the real
image/icon exports could not be pulled automatically. Every photo, product
shot, icon, and illustration in this build is a labeled SVG placeholder
(pastel color blocks with a text caption) that sits in the exact position,
size and aspect ratio the design uses.

To finish the pixel-perfect match:

1. In Figma, select each image/icon layer → **Export** (use the same format
   Figma shows, usually PNG/SVG).
2. Drop the exported file into `src/assets/images/` or `src/assets/icons/`
   with a matching name.
3. Update the one `import` line that points at it (in `src/data/products.js`,
   or directly in `Hero.jsx` / `Header.jsx` / `Footer.jsx` / `PromoBanners.jsx`
   / `Features.jsx`).

If you can give Claude edit/viewer access to the Figma file (or export and
upload the assets directly), the placeholders can be swapped for the real
files and any spacing/color values fine-tuned against the actual node data.

## Structure

```
src/
├── assets/          placeholder images & icons
├── components/      one folder per component (Header, Hero, ProductCard, ...)
├── data/            product/category/testimonial/gallery content
├── pages/Home.jsx   assembles the homepage
├── App.jsx
├── main.jsx
└── index.css        design tokens (colors, type, spacing) + base styles
```

## Design tokens

Colors, fonts, radii and shadows are defined as CSS custom properties at the
top of `src/index.css` — update them there to retune the palette/typography
globally. Fonts used: **Baloo 2** (headings) + **Nunito** (body), loaded from
Google Fonts in `index.html` — swap these if the Figma file specifies
different families once you have access to it.

## Responsive breakpoints implemented

Desktop (1024px+), tablet (768–1024px), and mobile (down to 360px), matching
the ranges called out in the brief. Each component's CSS file has its own
`@media` rules near the bottom.

## Not yet built

This covers the homepage only (the parts visible in the provided screenshot:
top bar, header/nav, hero, categories, two product grids, promo banners,
testimonials, gallery, features strip, newsletter, footer). The original brief
mentions additional pages (Shop, Pages, Blog, Contact) and further responsive
breakpoint detail beyond what the screenshot showed — happy to build those out
next.
