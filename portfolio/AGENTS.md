## Next.js 16 App Router

- **Framework**: Next.js 16.2.12 with App Router (not Pages Router)
- **Type**: TypeScript strict mode with React 19

## Dev Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
```

## Entry Points

- `src/app/page.tsx` - Home page
- `src/app/layout.tsx` - Root layout
- `src/app/globals.css` - Global styles

## Key Notes

- No tests configured
- Uses Tailwind CSS 4 with PostCSS
- TypeScript path alias: `@/*` → `./src/*`
- Auto-generated types in `.next/types/`
- Always read `node_modules/next/dist/docs/` for Next.js 16 specifics