# TATTOOSPACE Mannheim

Premium bilingual landing page for the flexible professional tattoo workspace in Mannheim.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The static production output is written to `dist/`.

## Cloudflare Workers & Pages

- Framework preset: Vite
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: `/`
- Node version: `20`

## Content updates

Business details, contact links, rates, equipment, reviews and public image sources live in `src/data/business.ts`. English and German copy lives in `src/i18n/translations.ts`.
