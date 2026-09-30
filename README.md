# Rainbow Rattles — Baby Toys Store

A React + Vite recreation of the "Baby toys store website template (Community)" Figma homepage.

## Run it

```bash
npm install
npm run dev
```

## Backend and database

The backend uses Express and MongoDB. Put your Atlas URI in `MONGODB_URI` in
`server/.env`, and set a private JWT secret and admin login credentials there.
Do not commit `.env` or share its secrets. Start the API with `npm run server`
and the storefront with `npm run dev`. Visit `/admin` on the Vite site to add,
edit, and delete database products. For deployment, set `VITE_API_URL` to the
backend origin when building the frontend.

### Deploy from GitHub with Render

The root `render.yaml` defines a Node web service for the API and a static
site for the Vite frontend. Push this repository to GitHub, then in Render
choose **New → Blueprint** and connect the repository. Render prompts for
`MONGODB_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, and generates `JWT_SECRET`.
The blueprint configures the API CORS origin for
`https://kid-toy-store.onrender.com`. If you change the static-site name or
attach a custom domain, update `FRONTEND_ORIGIN` on the API service to the
exact frontend origin. The API URL is wired into the frontend build.

Set up MongoDB Atlas and allow the deployed API host to connect before using
the site. Render's local filesystem is not durable for uploaded product images;
use object storage or configure a persistent disk before relying on uploads.

Products are in MongoDB; customer passwords are bcrypt-hashed; customer account
details and authenticated orders are also stored in MongoDB. Admin can provide
an image URL/path or upload a JPG, PNG, or WebP image up to 5 MB. Local uploads
are served from `server/uploads/`; for deployment, configure durable object
storage or a persistent volume and set `API_PUBLIC_URL`. The API provides
`GET /api/products`, admin product CRUD, `/api/auth/register` and `/api/auth/login`,
`GET/PATCH /api/account`, and `GET/POST /api/orders`. `/api/health` reports the
database connection state. Checkout requires a signed-in account and products
that exist in the database. Payment card fields are not stored or processed by
this backend; connect a payment provider before accepting real payments.

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
