# Agent Guidelines for prompt-gallery

This document provides coding standards and workflows for AI agents working in this repository.

## Project Overview

Prompty is an AI Image Prompt Gallery built with TanStack Start, React 19, TypeScript, TailwindCSS, and TanStack Query/Router. The app displays AI-generated images with structured metadata and enables JSON export for workflows.

## Build, Lint & Test Commands

### Development

```bash
bun --bun run dev          # Start dev server on port 3000
bun install                # Install dependencies
```

### Building

```bash
bun --bun run build        # Production build
bun --bun run preview      # Preview production build
```

### Testing

```bash
bun --bun run test         # Run all tests with Vitest
vitest run src/path/to/test.ts  # Run specific test file
vitest --watch             # Run tests in watch mode
```

### Linting & Formatting

```bash
bun --bun run lint         # Run ESLint
bun --bun run format       # Run Prettier
bun --bun run check        # Format + lint check
```

### Adding Shadcn Components

```bash
pnpm dlx shadcn@latest add [component-name]
```

## Code Style Guidelines

### Import Organization

Group imports: external libraries → TanStack packages → local files. Use named imports and `@/` path alias.

```typescript
import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'

import Header from '@/components/Header'
import { cn } from '@/lib/utils'
```

### TypeScript

Strict mode enabled. Use explicit types for function parameters and return values. Type inference acceptable for local variables.

**TSConfig settings:** strict, noUnusedLocals, noUnusedParameters, noFallthroughCasesInSwitch.

### Formatting (Prettier)

No semicolons, single quotes, trailing commas everywhere.

### Naming Conventions

- Components: PascalCase (`Header.tsx`, `ImageCard`)
- Route files: kebab-case (`gallery.tsx`, `image-details.tsx`)
- Variables/Functions: camelCase (`submitForm`, `isLoading`)
- Types/Interfaces: PascalCase (`ImageMetadata`, `GalleryItem`)
- Constants: UPPER_SNAKE_CASE

### React Components

Structure: route definition (if applicable) → types → component function → export.

```typescript
export const Route = createFileRoute('/gallery')({
  component: GalleryPage,
})

type Props = {
  id: number
}

function GalleryPage({ id }: Props) {
  // component logic
}
```

### TanStack Router

Routes in `src/routes/`, use `createFileRoute()` for type safety. Layout in `src/routes/__root.tsx`. Route tree auto-generated in `src/routeTree.gen.ts` (do not edit manually).

### TanStack Query

```typescript
const { data } = useQuery({
  queryKey: ['images', { page }],
  queryFn: getImages,
})

const { mutate } = useMutation({
  mutationFn: uploadImage,
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['images'] }),
})
```

### Error Handling

Use async/await with try-catch. Handle loading/error states in UI. Return meaningful error messages.

### Styling (TailwindCSS)

Use `cn()` helper for conditional classes. Follow mobile-first responsive design.

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  condition && 'conditional-classes',
)} />
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

## Important Notes

- Uses **Bun** as package manager and runtime
- Server functions and API routes are type-safe across client/server boundary
- Devtools enabled in development
- ES modules (`"type": "module"`)
- Demo files in `demo/` can be deleted safely
