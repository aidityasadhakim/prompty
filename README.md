# Prompty - AI Image Prompt Gallery

A modern gallery for browsing and managing AI-generated image prompts. Built with TanStack Start, React 19, and TypeScript.

## Features

- Browse AI-generated images with structured metadata
- Export prompts and metadata as JSON for workflow integration
- Responsive gallery with grid layouts
- Image detail views with full metadata

## Tech Stack

- **Framework**: TanStack Start (React 19)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Routing**: TanStack Router
- **Data Fetching**: TanStack Query
- **Runtime**: Bun

## Getting Started

```bash
bun install
bun --bun run dev
```

The dev server runs on http://localhost:3000

## Commands

```bash
bun --bun run dev          # Start dev server
bun --bun run build        # Production build
bun --bun run preview      # Preview production build
bun --bun run test         # Run tests with Vitest
bun --bun run lint         # Run ESLint
bun --bun run format       # Run Prettier
bun --bun run check        # Format + lint check
```

## Project Structure

```
src/
├── components/        # Reusable React components
├── data/             # Static data files
├── lib/              # Utility functions
├── routes/           # File-based routes (TanStack Router)
├── router.tsx        # Router configuration
├── routeTree.gen.ts  # Auto-generated
└── styles.css        # Global styles
```

## Adding Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

## Learn More

- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router](https://tanstack.com/router/latest)
- [TanStack Query](https://tanstack.com/query/latest)
- [TailwindCSS](https://tailwindcss.com/)
