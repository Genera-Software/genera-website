# Genera Website

Marketing website for Genera Software, built with Next.js and TypeScript.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4

## Prerequisites

- Node.js 20+ (recommended)
- npm

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` in the project root.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

The `app/api/book-demo/route.ts` endpoint sends demo requests through Postmark.

Required:

- `POSTMARK_API_KEY`

Optional (defaults shown):

- `POSTMARK_FROM_EMAIL` (default: `info@generasoftware.com`)
- `POSTMARK_TO_EMAIL` (default: `info@generasoftware.com`)
- `POSTMARK_MESSAGE_STREAM` (default: `outbound`)

## Scripts

- `npm run dev` - Run local dev server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Next.js lint checks
- `npm run typecheck` - Run TypeScript type checks

## Project Structure

- `app/` - App Router pages, layouts, and API routes
- `components/` - Shared UI components
- `lib/` - Shared constants and utilities
- `public/` - Static assets and images
- `legacy/` - Previous static HTML assets/pages

## Notes

- Registration and login links point to `app.generasoftware.com` via `lib/urls.ts`.
- The website includes pages such as home, features, FAQs, contact, blog, and story.
