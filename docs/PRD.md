# Product Requirements Document (PRD)

## Prompty - AI Image Prompt Gallery

**Version:** 1.0
**Status:** Draft
**Last Updated:** February 7, 2026

---

## 1. Executive Summary

Prompty is a public-facing gallery application designed to store, display, and share AI-generated images along with their structured metadata. The platform enables users to browse high-quality AI-generated images, explore detailed prompt metadata, and export structured JSON data for use with their own image generation workflows. Unlike platforms that generate images directly, Prompty serves as a curated repository of inspiration and reference material for AI art creators.

The application is built on TanStack Start with React 19 and TypeScript, utilizing SQLite for structured data storage, Cloudflare R2 for image hosting, and Cloudflare Images for automatic image transformation and optimization. The initial release focuses on core browsing, search, and metadata export functionality with a lightweight admin interface for content management.

---

## 2. Problem Statement

AI image generation has become increasingly popular, but creators often struggle to discover high-quality reference images with complete, structured metadata. Existing solutions either generate images (requiring expensive GPU resources) or provide unstructured prompt sharing without detailed breakdowns of what makes an image successful.

Creators need:

- A curated collection of high-quality AI-generated images as inspiration
- Detailed, structured metadata explaining each image's characteristics
- The ability to export metadata in a format they can adapt for their own workflows
- A way to discover trending styles and techniques without browsing countless failed generations

---

## 3. Goals & Objectives

### 3.1 Primary Goals

The primary goal of Prompty is to create a comprehensive, publicly accessible gallery where users can discover AI-generated images and obtain structured metadata for their own creative work. This goal encompasses providing a seamless browsing experience, powerful search and filtering capabilities, and reliable data export functionality.

### 3.2 Secondary Objectives

Secondary objectives include building a community-driven platform where quality content rises through popularity metrics, establishing an admin workflow that enables efficient content addition without compromising security, and ensuring the platform scales gracefully as the collection grows.

### 3.3 Success Metrics

| Metric                 | Target (MVP)            | Target (Post-MVP)       |
| ---------------------- | ----------------------- | ----------------------- |
| Page Load Time         | < 3 seconds             | < 2 seconds             |
| Time to First Paint    | < 1.5 seconds           | < 1 second              |
| Gallery Grid Load      | < 2 seconds (100 items) | < 3 seconds (500 items) |
| Search Response Time   | < 500ms                 | < 300ms                 |
| Monthly Active Users   | 1,000                   | 10,000                  |
| Export Completion Rate | 95%                     | 99%                     |

---

## 4. User Personas

### 4.1 Casual Browser

The casual browser is an AI art enthusiast who visits the platform occasionally for inspiration. They spend 5-15 minutes per session browsing trending images and using basic search functionality. Their primary needs are quick access to interesting images and the ability to find specific styles or aesthetics without friction. This user represents approximately 60% of traffic.

### 4.2 Serious Creator

The serious creator is a dedicated AI artist who regularly references existing work to improve their own generations. They spend 30-60 minutes per session examining detailed metadata, exporting JSON files, and comparing different approaches to similar subjects. Their primary needs are comprehensive metadata access, advanced filtering options, and reliable data export. This user represents approximately 30% of traffic and drives the majority of export usage.

### 4.3 Content Contributor

The content contributor is an admin user responsible for adding new images and metadata to the platform. They require a streamlined upload workflow that minimizes manual data entry while maintaining quality standards. Their primary needs are efficient batch uploading, automatic metadata parsing if possible, and secure access that prevents unauthorized contributions. This user represents approximately 2% of users but is critical to platform growth.

### 4.4 Researcher

The researcher is examining AI art trends, metadata structures, or generation techniques. They may download large datasets or spend extended periods analyzing patterns across many images. Their primary needs are bulk access to data, consistent metadata formatting, and the ability to programmatically query the platform. This user represents approximately 8% of traffic.

---

## 5. Functional Requirements

### 5.1 Image Gallery

#### 5.1.1 Gallery Grid View

The main gallery displays images in a responsive grid layout that adapts to viewport size. The grid must show image thumbnails with consistent aspect ratios where possible, display basic metadata overlay on hover (aspect ratio, style, quality rating), and indicate trending status for highly-liked images through visual indicators. The initial implementation supports 100 images per page with pagination.

The grid must implement lazy loading for images below the fold to optimize initial page load. Each thumbnail should display a subtle loading placeholder while the image fetches from Cloudflare R2. On image click, the user navigates to the details page with the selected image as context.

**Implementation Requirements:**

- Responsive CSS grid with breakpoints at 640px, 768px, 1024px, 1280px, and 1536px
- Image aspect ratio preservation with `object-fit: cover` for thumbnails
- Hover state showing overlay with key metadata (ratio, primary style)
- Trending badge for images in top 10% by like count
- Intersection Observer for lazy loading implementation

#### 5.1.2 Image Card Component

Each image card contains the thumbnail, a like button with current count, and quick metadata display. The card must support hover states that reveal additional information without obscuring the image. Clicking anywhere on the card (excluding the like button) navigates to the details page.

**Component Specifications:**

- Thumbnail dimensions: 300x300px ideal, 400x400px maximum
- Like button positioned top-right with heart icon
- Metadata overlay appears on hover with 200ms transition
- Accessibility: keyboard navigation support, ARIA labels for screen readers

### 5.2 Search and Filtering

#### 5.2.1 Search Functionality

The search bar provides full-text search across image titles, style tags, and quality descriptors. Search results update in real-time as the user types with debouncing at 300ms to prevent excessive server requests. Results are sorted by relevance with trending images receiving slight ranking boost.

**Searchable Fields:**

- Style tags (e.g., "ultra photorealistic", "raw iphone selfie", "lo-fi indie")
- Quality indicators (e.g., "8k", "4k", "photorealistic")
- Camera and lens metadata
- Lighting type (e.g., "fairy light", "natural light", "studio")
- Character attributes (e.g., "East Asian", "eyeglasses", "wolf cut hair")

#### 5.2.2 Filter System

The filter panel allows users to narrow results by specific criteria. Initial filters include aspect ratio selection and style category browsing. Filters are additive (AND logic) within categories and flexible between categories (OR logic for selected values within a category).

**Filter Categories:**

Aspect Ratio Filter:

- 1:1 (Square)
- 3:2 (Landscape)
- 2:3 (Portrait)
- 9:16 (Vertical/Tall)
- 16:9 (Horizontal/Wide)
- Custom ratios added as needed

Style Filter (Initial Tags):

- Photorealistic
- Abstract
- Anime/Anime-style
- Digital Art
- Oil Painting
- Film Photography
- Macro Photography
- Portrait
- Landscape
- Fashion/Editorial
- Fantasy/Sci-Fi
- Nature/Wildlife

#### 5.2.3 Trending Feature

The trending section displays the most liked images from the past 7 days, updated hourly. A dedicated "/trending" route shows this curated view with a slightly different layout emphasizing popularity indicators.

**Trending Algorithm:**

```
Score = (Likes * 1.0) + (Views * 0.1) - (DaysSincePosted * DecayFactor)

DecayFactor = 0.5 for days 1-3
            = 1.0 for days 4-7
            = 2.0 for days 8+
```

This algorithm prioritizes recent content with strong engagement while allowing evergreen content to remain visible if engagement persists.

### 5.3 Image Details Page

#### 5.3.1 Layout and Content

The details page displays the full-size image with comprehensive metadata organized into collapsible sections. The layout follows a left-rail image + right-rail metadata structure on desktop, stacking vertically on mobile.

**Metadata Sections:**

Meta Section:

- Quality rating (e.g., "ultra photorealistic", "4K")
- Resolution (e.g., "8K", "4K", "1080p")
- Camera/lens information when available
- Aspect ratio
- Style descriptors

Character Lock Section (when applicable):

- Age range
- Ethnicity
- Hair details (color, style, length)
- Eye description
- Face details (shape, nose, lips, skin)
- Body type and build
- Distinguishing features (glasses, jewelry, scars, etc.)

Scene Section:

- Location type
- Setting details
- Time of day
- Lighting description
- Atmospheric qualities

Subject Section:

- Pose description
- Outfit details
- Product placement (if applicable)

#### 5.3.2 JSON Export

A prominent export button allows users to download the complete metadata as a JSON file. The exported JSON excludes the original prompt field (as users will create their own) and includes all structured metadata sections.

**Export Format:**

```json
{
  "meta": {
    "quality": "string",
    "resolution": "string",
    "camera": "string",
    "lens": "string",
    "aspect_ratio": "string",
    "style": ["string"]
  },
  "character_lock": { ... },
  "scene": { ... },
  "subject": { ... }
}
```

**Export Behavior:**

- Clicking export triggers browser download
- Filename format: `prompty-[image-id]-[timestamp].json`
- File encoding: UTF-8
- Indentation: 2 spaces for readability

#### 5.3.3 Like Functionality

Users can like images without authentication for the MVP. Like state is stored in localStorage to prevent immediate unlike on page refresh. Future authentication system will sync likes across devices.

**Like Button Behavior:**

- Click toggles like state
- Optimistic UI update (immediate visual feedback)
- API request in background
- Rollback on API failure
- Count displayed as localized number (e.g., "1.2k")

### 5.4 Admin Upload Interface

#### 5.4.1 Access Control

The admin interface is protected by a simple password check stored in environment variables. The password is transmitted securely over HTTPS and verified server-side. No user accounts or complex authentication is required for the MVP.

**Security Model:**

- Admin password stored in `.env` as `ADMIN_PASSWORD`
- Login form accepts password, sets HTTP-only session cookie on success
- Session expires after 24 hours
- All admin routes protected by server function middleware

#### 5.4.2 Upload Workflow

The admin upload page provides a multi-step form for adding new images and metadata.

**Step 1: Image Upload**

- Drag and drop zone for image files
- Supported formats: JPG, PNG, WebP
- Maximum file size: 10MB
- Client-side preview after upload
- Upload to Cloudflare R2 via server function
- Returns public R2 URL on success

**Step 2: Metadata Entry**

- Form fields corresponding to JSON structure
- Nested objects for complex sections (character_lock, scene, subject)
- Add/remove array items (e.g., style tags, distinguishing features)
- Live JSON preview panel
- Validation before submission

**Step 3: Review and Publish**

- Final preview of complete entry
- Edit capability for any field
- Publish button adds to database
- Redirect to gallery on success

#### 5.4.3 Bulk Upload (Future)

Future iteration will support CSV or JSON array import for batch content addition. This requires additional validation, progress tracking, and error handling.

---

## 6. Non-Functional Requirements

### 6.1 Performance

The application must maintain responsive performance under typical and peak load conditions. Initial page load should complete within 3 seconds on standard broadband connections. Gallery scrolling must remain smooth with no jank when loading new content. Search results should appear within 500ms of query submission.

Image delivery through Cloudflare R2 with Cloudflare Images transformations ensures fast loading with automatic format conversion (WebP/AVIF), responsive sizing, and CDN caching. The SQLite database supports indexes on frequently queried fields (aspect_ratio, style tags, created_at) to maintain query performance as the dataset grows.

### 6.2 Scalability

The architecture supports horizontal scaling at the TanStack Start server level if traffic demands it. Database write operations are lightweight enough to handle 100+ uploads per day without performance degradation. CDN caching of images reduces origin server load and improves global access times.

For the MVP, single-server deployment is acceptable with the understanding that load balancers and connection pooling would be added if usage exceeds initial projections.

### 6.3 Security

All data transmission uses HTTPS with TLS 1.3. User inputs are validated and sanitized server-side to prevent injection attacks. The admin interface uses secure session management with HTTP-only cookies. No sensitive credentials are ever exposed in client-side code.

Cloudflare R2 access uses pre-signed URLs for uploads, preventing direct bucket access. Database credentials are loaded from environment variables only, never committed to version control.

### 6.4 Accessibility

The application meets WCAG 2.1 AA standards for accessibility. All interactive elements are keyboard navigable with visible focus indicators. Images include appropriate alt text. Color contrast ratios meet minimum requirements for text readability.

Screen reader users can access all gallery content, filter options, and export functionality through proper semantic HTML and ARIA labels. Form inputs include associated labels and error messages.

### 6.5 Browser Support

| Browser            | Minimum Version | Support Level |
| ------------------ | --------------- | ------------- |
| Chrome             | 90              | Full          |
| Firefox            | 88              | Full          |
| Safari             | 14              | Full          |
| Edge               | 90              | Full          |
| iOS Safari         | 14              | Full          |
| Chrome for Android | 90              | Full          |

---

## 7. Technical Architecture

### 7.1 Technology Stack

**Frontend Framework:**

- React 19 with concurrent features
- TanStack Router for file-based routing
- TanStack Query for data fetching and caching
- TypeScript with strict mode enabled

**Styling:**

- TailwindCSS for utility-first styling
- Shadcn UI component library
- CSS variables for theming
- Responsive design with mobile-first approach

**Backend:**

- TanStack Start server functions (`createServerFn`)
- Node.js runtime environment
- SQLite database with better-sqlite3 driver

**Storage:**

- Cloudflare R2 for image storage
- SQLite for structured metadata
- Environment variables for secrets

**Build and Dev:**

- Bun runtime and package manager
- Vite as build tool
- ESLint and Prettier for code quality

### 7.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React 19 Application                                     │   │
│  │  ├─ TanStack Router (File-based routing)                  │   │
│  │  ├─ TanStack Query (Data fetching/caching)                │   │
│  │  └─ Shadcn UI Components                                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TanStack Start Server                        │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Server Functions (createServerFn)                        │   │
│  │  ├─ getImages()                                           │   │
│  │  ├─ getImageById()                                        │   │
│  │  ├─ getTrendingImages()                                   │   │
│  │  ├─ toggleLike()                                          │   │
│  │  ├─ uploadImage() (admin only)                            │   │
│  │  └─ adminLogin()                                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              │                                   │
│              ┌───────────────┴───────────────┐                   │
│              ▼                               ▼                   │
│  ┌─────────────────────┐       ┌─────────────────────────────┐   │
│  │   SQLite Database   │       │  Cloudflare R2 + Images     │   │
│  │   prompty.db        │       │  ├─ Original Images         │   │
│  │  ├─ images table    │       │  └─ Transformations (CDN)   │   │
│  │  ├─ metadata table  │       │      ├─ thumbnail (300x300)  │   │
│  │  ├─ likes table     │       │      ├─ mobile (640w)        │   │
│  │  └─ sessions table  │       │      └─ full (original)     │   │
│  └─────────────────────┘       └─────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 7.3 Database Schema

#### 7.3.1 Images Table

```sql
CREATE TABLE images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  r2_url TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL,
  style_tags TEXT NOT NULL, -- JSON array of strings
  quality TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### 7.3.2 Metadata Table

```sql
CREATE TABLE metadata (
  id INTEGER PRIMARY KEY,
  image_id INTEGER NOT NULL,
  meta_data TEXT NOT NULL, -- JSON object
  character_lock TEXT, -- JSON object, nullable
  scene TEXT, -- JSON object
  subject TEXT, -- JSON object
  FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
);
```

#### 7.3.3 Likes Table

```sql
CREATE TABLE likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id INTEGER NOT NULL,
  session_id TEXT NOT NULL, -- For anonymous likes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(image_id, session_id)
);
```

#### 7.3.4 Sessions Table

```sql
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  admin INTEGER DEFAULT 0,
  expires_at DATETIME NOT NULL
);
```

#### 7.3.5 Indexes

```sql
CREATE INDEX idx_images_aspect_ratio ON images(aspect_ratio);
CREATE INDEX idx_images_created_at ON images(created_at);
CREATE INDEX idx_likes_image_id ON likes(image_id);
CREATE INDEX idx_likes_session_id ON likes(session_id);
```

### 7.4 Cloudflare R2 + Images Integration

#### 7.4.1 Storage Structure

Images are stored in Cloudflare R2 as originals. Cloudflare Images transformations are used to generate optimized variants on-demand.

```
R2 Bucket: prompty/
└── images/
    └── [filename]  -- Original uploaded image
```

**Cloudflare Images Variants (defined in Cloudflare dashboard):**

| Variant   | Width    | Height   | Fit     | Format |
| --------- | -------- | -------- | ------- | ------ |
| thumbnail | 300      | 300      | cover   | auto   |
| mobile    | 640      | -        | width   | auto   |
| tablet    | 1024     | -        | width   | auto   |
| full      | original | original | contain | auto   |

#### 7.4.2 Image URL Generation

Image URLs are constructed using Cloudflare Images transformation syntax:

```
# Thumbnail (for gallery grid)
https://{R2_PUBLIC_URL}/images/[filename]?width=300&height=300&fit=cover

# Mobile responsive
https://{R2_PUBLIC_URL}/images/[filename]?width=640

# Full resolution (for details page)
https://{R2_PUBLIC_URL}/images/[filename]
```

The frontend uses Unpic or native `srcset` with Cloudflare transformation URLs for responsive images.

#### 7.4.3 Upload Flow

1. Client requests pre-signed upload URL from server via `uploadImage()` server function
2. Server generates R2 upload URL with 15-minute expiration
3. Client uploads image directly to R2
4. Client submits metadata with returned R2 URL
5. Server creates database entry referencing the image

#### 7.4.4 Image Optimization

Cloudflare Images provides automatic optimization without additional server-side processing:

- **Format conversion:** Automatically serves WebP/AVIF based on browser support
- **Responsive sizing:** Query parameters for width/height/fit
- **Cache headers:** CDN caching at edge locations
- **Free tier:** 5,000 unique transformations/month (sufficient for <500 images in gallery)

No thumbnails are stored or generated on the server. All variants are created on-demand by Cloudflare's CDN.

### 7.5 Server Function API

TanStack Start uses `createServerFn` for type-safe server functions. These are called directly from client components using TanStack Query, not via HTTP endpoints.

#### 7.5.1 getImages

```typescript
import { createServerFn } from '@tanstack/start/server'

export const getImages = createServerFn({
  method: 'GET',
})
  .validator(
    (input: {
      page?: number
      limit?: number
      aspectRatio?: string
      style?: string
      search?: string
    }) => {
      return {
        page: input.page || 1,
        limit: input.limit || 20,
        aspectRatio: input.aspectRatio,
        style: input.style,
        search: input.search,
      }
    },
  )
  .handler(async (ctx) => {
    // Query SQLite for images with filters
    // Returns: { data: Image[], pagination: {...} }
  })
```

**Usage on client:**

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { getImages } from '@/server/functions/images'

export const Route = createFileRoute('/')({
  component: GalleryPage,
})

function GalleryPage() {
  const { data } = useQuery({
    queryKey: ['images', { page: 1, limit: 20 }],
    queryFn: getImages,
  })
}
```

#### 7.5.2 getImageById

```typescript
export const getImageById = createServerFn({
  method: 'GET',
})
  .validator((input: { id: number }) => {
    if (!input.id || input.id <= 0) throw new Error('Invalid image ID')
    return { id: input.id }
  })
  .handler(async (ctx) => {
    // Query SQLite for single image with full metadata
    // Returns: { image: Image, metadata: Metadata, like_count: number }
  })
```

#### 7.5.3 getTrendingImages

```typescript
export const getTrendingImages = createServerFn({
  method: 'GET',
})
  .validator((input: { limit?: number }) => {
    return { limit: input.limit || 10 }
  })
  .handler(async (ctx) => {
    // Query SQLite ordered by likes with decay factor
    // Returns: { data: Image[] }
  })
```

#### 7.5.4 toggleLike

```typescript
export const toggleLike = createServerFn({
  method: 'POST',
})
  .validator((input: { imageId: number }) => {
    return { imageId: input.imageId }
  })
  .handler(async (ctx) => {
    // Get session ID from cookie
    // Add or remove like from likes table
    // Returns: { like_count: number, is_liked: boolean }
  })
```

#### 7.5.5 uploadImage (Admin Only)

```typescript
export const uploadImage = createServerFn({
  method: 'POST',
})
  .validator(
    (input: {
      filename: string
      metadata: MetadataInput
      adminPassword: string
    }) => {
      return input
    },
  )
  .handler(async (ctx) => {
    // Validate admin session
    // Get pre-signed R2 upload URL
    // Return upload URL to client
    // After client upload, create database record
  })

// Separate function for after R2 upload completes
export const confirmUpload = createServerFn({
  method: 'POST',
})
  .validator(
    (input: { filename: string; r2_url: string; metadata: MetadataInput }) => {
      return input
    },
  )
  .handler(async (ctx) => {
    // Insert image and metadata into SQLite
    // Returns: { id: number, success: true }
  })
```

#### 7.5.6 adminLogin

```typescript
export const adminLogin = createServerFn({
  method: 'POST',
})
  .validator((input: { password: string }) => {
    return { password: input.password }
  })
  .handler(async (ctx) => {
    // Verify password against ADMIN_PASSWORD env var
    // Create session in SQLite
    // Set HTTP-only cookie
    // Returns: { success: true, sessionId: string }
  })
```

---

## 8. Server Function Reference

### 8.1 Available Server Functions

All server functions are defined in `src/server/functions/` and exported for use in client components.

| Function            | Input                                              | Output                            | Auth Required           |
| ------------------- | -------------------------------------------------- | --------------------------------- | ----------------------- |
| `getImages`         | `{ page?, limit?, aspectRatio?, style?, search? }` | `{ data: Image[], pagination }`   | No                      |
| `getImageById`      | `{ id: number }`                                   | `{ image, metadata, like_count }` | No                      |
| `getTrendingImages` | `{ limit? }`                                       | `{ data: Image[] }`               | No                      |
| `toggleLike`        | `{ imageId: number }`                              | `{ like_count, is_liked }`        | No                      |
| `uploadImage`       | `{ filename, metadata, adminPassword }`            | `{ uploadUrl: string }`           | No (validates password) |
| `confirmUpload`     | `{ filename, r2_url, metadata }`                   | `{ id: number }`                  | No (uses session)       |
| `adminLogin`        | `{ password: string }`                             | `{ success, sessionId }`          | No                      |
| `adminLogout`       | `{}`                                               | `{ success: true }`               | Yes (session)           |

### 8.2 Response Formats

**getImages Response:**

```json
{
  "data": [
    {
      "id": 1,
      "r2_url": "https://...",
      "aspect_ratio": "9:16",
      "style_tags": ["photorealistic", "portrait"],
      "quality": "ultra",
      "like_count": 42,
      "created_at": "2026-02-07T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "hasMore": true
  }
}
```

**getImageById Response:**

```json
{
  "image": {
    "id": 1,
    "r2_url": "https://...",
    "aspect_ratio": "9:16"
  },
  "metadata": {
    "meta": { ... },
    "character_lock": { ... },
    "scene": { ... },
    "subject": { ... }
  },
  "like_count": 42,
  "is_liked": false
}
```

**Error Response:**

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid aspect ratio specified"
  }
}
```

### 8.3 Error Codes

| Code             | Meaning                  | HTTP Status |
| ---------------- | ------------------------ | ----------- |
| VALIDATION_ERROR | Invalid input data       | 400         |
| NOT_FOUND        | Resource doesn't exist   | 404         |
| UNAUTHORIZED     | Invalid or missing auth  | 401         |
| FORBIDDEN        | Insufficient permissions | 403         |
| INTERNAL_ERROR   | Server failure           | 500         |

---

## 9. UI/UX Requirements

### 9.1 Design System

**Color Palette:**

- Primary: Slate/Charcoal (neutral dark)
- Secondary: Warm Amber (fairy light inspired)
- Accent: Soft Coral (for like/heart buttons)
- Background: Off-white/Cream (warm, comfortable)
- Text: Dark Gray (not pure black)

**Typography:**

- Headings: Inter (sans-serif, various weights)
- Body: System UI stack (San Francisco, Segoe UI, Roboto)
- Monospace: JetBrains Mono (for JSON/code display)

**Spacing:**

- Base unit: 4px
- Container padding: 24px
- Component gap: 16px
- Section spacing: 48px

### 9.2 Component Library

**Core Components:**

- Button (primary, secondary, ghost, danger)
- Input (text, search, file upload)
- Card (image card, content card)
- Modal/Dialog (confirmations, forms)
- Dropdown (filter menus)
- Pagination (page navigation)
- Toast (notifications)
- Badge (status indicators)

### 9.3 Page Layouts

**Home/Gallery Page:**

```
Header
├─ Logo
├─ Search Bar
├─ Navigation
└─ Theme Toggle

Filter Sidebar (Collapsible on Mobile)
├─ Aspect Ratio
├─ Style Tags
└─ Trending Toggle

Image Grid
├─ Image Cards (responsive grid)
└─ Pagination

Footer
```

**Details Page:**

```
Header (Same as Home)

Content Area (Two Column Desktop)
├─ Left: Full Image
│  ├─ Like Button Overlay
│  └─ Download Buttons
└─ Right: Metadata Panel
   ├─ Meta Section (Collapsible)
   ├─ Character Lock Section (Collapsible)
   ├─ Scene Section (Collapsible)
   ├─ Subject Section (Collapsible)
   └─ Export JSON Button

Related Images (Horizontal Scroll)

Footer
```

**Admin Upload Page:**

```
Header (Admin Badge)

Multi-Step Form
├─ Step 1: Image Upload
│  ├─ Drag & Drop Zone
│  ├─ Preview
│  └─ R2 URL Input
├─ Step 2: Metadata Form
│  ├─ Meta Fields
│  ├─ Character Lock Fields
│  ├─ Scene Fields
│  ├─ Subject Fields
│  └─ JSON Preview
└─ Step 3: Review
   ├─ Final Preview
   └─ Publish Button
```

### 9.4 Responsive Breakpoints

| Breakpoint | Width           | Grid Columns |
| ---------- | --------------- | ------------ |
| xs         | < 640px         | 1            |
| sm         | 640px - 767px   | 2            |
| md         | 768px - 1023px  | 3            |
| lg         | 1024px - 1279px | 4            |
| xl         | 1280px - 1535px | 5            |
| 2xl        | >= 1536px       | 6            |

---

## 10. Security Requirements

### 10.1 Authentication

The admin interface uses a single password authentication model for the MVP. This approach balances security requirements with implementation simplicity for the initial release.

**Password Requirements:**

- Minimum 16 characters
- Stored in `.env` as `ADMIN_PASSWORD`
- Never logged, never exposed in client code
- Verified server-side with constant-time comparison

**Session Management:**

- Session ID generated cryptographically (256-bit)
- Stored in HTTP-only, Secure cookie
- 24-hour expiration
- Invalidated on logout

### 10.2 Input Validation

All user inputs are validated server-side regardless of client validation. The `validator` function on each server function ensures type safety and business rule enforcement. SQL queries use parameterized statements to prevent injection attacks.

**Validation Rules:**

- Image IDs: positive integers only
- Session IDs: UUID format
- Aspect ratios: predefined enum values
- Style tags: maximum 10 per image
- Metadata JSON: maximum 50KB

### 10.3 File Upload Security

- Accepted file types: image/jpeg, image/png, image/webp
- Maximum file size: 10MB
- Filenames sanitized on upload
- Content-Type verified by R2
- Virus scanning considered for future phases

### 10.4 Rate Limiting

TanStack Start server functions should implement basic rate limiting to prevent abuse. For the MVP, simple in-memory tracking limits repeated requests from the same IP.

**Initial Limits:**

- General API: 100 requests per minute
- Like endpoint: 10 likes per minute per session
- Upload endpoint: 5 uploads per hour per admin session

### 10.5 Environment Variables

Required environment variables for production:

```bash
# Database
DATABASE_PATH=./src/data/prompty.db

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=prompty
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Cloudflare Images (optional - uses R2 directly if not set)
CLOUDFLARE_IMAGES_ACCOUNT_ID=your_account_id
CLOUDFLARE_IMAGES_TOKEN=your_images_token

# Admin
ADMIN_PASSWORD=your_secure_password

# Session
SESSION_SECRET=your_session_secret

# App
NODE_ENV=production
PORT=3000
```

---

## 11. Implementation Phases

### 11.1 Phase 1: Core Gallery (MVP)

**Duration:** 2-3 weeks

**Deliverables:**

- Project setup with TanStack Start, SQLite, and TailwindCSS
- Basic image gallery with grid layout
- SQLite database with images and metadata tables
- Image details page with metadata display
- JSON export functionality
- Basic search by style and aspect ratio
- LocalStorage-based like system

**Acceptance Criteria:**

- Users can browse images in grid layout
- Users can search and filter images
- Users can view image details with full metadata
- Users can export metadata as JSON
- Images display correctly from Cloudflare R2
- Page load time under 3 seconds

### 11.2 Phase 2: Trending and Social Features

**Duration:** 1-2 weeks

**Deliverables:**

- Trending page with like-sorted content
- Improved like system with session tracking
- Visual indicators for trending content
- Share functionality (copy link, social share)

**Acceptance Criteria:**

- Trending page shows correctly sorted content
- Like counts persist across sessions
- Share links work correctly

### 11.3 Phase 3: Admin Interface

**Duration:** 1-2 weeks

**Deliverables:**

- Admin authentication system
- Single-image upload workflow
- Metadata form with validation
- R2 integration for image storage

**Acceptance Criteria:**

- Admin login works with password
- Images upload successfully to R2
- Metadata saves correctly to database
- Upload form validates all required fields

### 11.4 Phase 4: Enhancements (Post-MVP)

**Duration:** Ongoing

**Potential Features:**

- User accounts with saved collections
- Bulk import for content addition
- Advanced filtering (multiple styles, lighting type, etc.)
- Image comparison tool
- Browser extension for quick reference
- API access for researchers
- Mobile app (React Native)
- Social features (comments, following)
- Content moderation system

---

## 12. Success Metrics and KPIs

### 12.1 Engagement Metrics

| Metric               | Definition             | Target (Month 1) |
| -------------------- | ---------------------- | ---------------- |
| Page Views           | Total page views       | 10,000           |
| Unique Visitors      | Distinct users         | 2,000            |
| Avg Session Duration | Time spent on site     | 3 minutes        |
| Pages per Session    | Pages viewed per visit | 4                |
| Bounce Rate          | Single-page sessions   | < 50%            |

### 12.2 Conversion Metrics

| Metric           | Definition                | Target (Month 1) |
| ---------------- | ------------------------- | ---------------- |
| Export Rate      | Exports / Unique Visitors | 10%              |
| Like Rate        | Likes / Unique Visitors   | 25%              |
| Detail View Rate | Details / Grid Views      | 40%              |
| Search Usage     | Searches / Sessions       | 30%              |

### 12.3 Technical Metrics

| Metric       | Definition               | Target  |
| ------------ | ------------------------ | ------- |
| Availability | Uptime percentage        | 99.5%   |
| Error Rate   | Failed requests / total  | < 1%    |
| LCP          | Largest Contentful Paint | < 2.5s  |
| FID          | First Input Delay        | < 100ms |
| CLS          | Cumulative Layout Shift  | < 0.1   |

---

## 13. Risks and Mitigations

### 13.1 Technical Risks

| Risk                          | Likelihood | Impact | Mitigation                                             |
| ----------------------------- | ---------- | ------ | ------------------------------------------------------ |
| R2 integration issues         | Medium     | High   | Design modular storage layer, support future migration |
| SQLite performance at scale   | Low        | Medium | Plan for PostgreSQL migration, optimize queries early  |
| React 19 compatibility issues | Low        | Medium | Thorough testing, monitor TanStack Start updates       |

### 13.2 Security Risks

| Risk                    | Likelihood | Impact   | Mitigation                               |
| ----------------------- | ---------- | -------- | ---------------------------------------- |
| Admin password exposure | Low        | Critical | Strict access controls, regular rotation |
| R2 bucket public access | Low        | Critical | IAM policies, regular audits             |
| Injection attacks       | Low        | High     | Parameterized queries, input validation  |

### 13.3 Operational Risks

| Risk                        | Likelihood | Impact | Mitigation                                    |
| --------------------------- | ---------- | ------ | --------------------------------------------- |
| Content moderation issues   | Medium     | Medium | Clear submission guidelines, reporting system |
| Storage costs exceed budget | Medium     | Medium | Monitor usage, implement cleanup policies     |
| Low user engagement         | Medium     | High   | SEO optimization, social promotion            |

---

## 14. Appendix

### 14.1 Metadata Schema Reference

The complete metadata structure follows the example provided, organized into four main sections: meta, character_lock, scene, and subject.

**Meta Section:**
Contains high-level image attributes including quality rating, resolution, camera/lens information, aspect ratio, and style tags.

**Character_lock Section:**
Structured information about human subjects including demographic attributes, physical characteristics, and distinguishing features. Nullable for non-human images.

**Scene Section:**
Environmental details including location, setting specifics, time of day, lighting description, and atmospheric qualities.

**Subject Section:**
Information about the primary subject including pose, outfit, positioning, and any products or props featured prominently.

### 14.2 Glossary

| Term              | Definition                                                       |
| ----------------- | ---------------------------------------------------------------- |
| R2                | Cloudflare's S3-compatible object storage                        |
| Cloudflare Images | Cloudflare's image transformation and delivery service           |
| Server Function   | TanStack Start's type-safe RPC mechanism                         |
| Character Lock    | Detailed subject description for consistent character generation |
| Trending          | Popular content sorted by recent engagement                      |
| Export            | Download action for JSON metadata                                |

### 14.3 References

- TanStack Start Documentation: https://tanstack.com/start/latest
- TanStack Router: https://tanstack.com/router/latest
- TanStack Query: https://tanstack.com/query/latest
- Cloudflare R2: https://developers.cloudflare.com/r2/
- Cloudflare Images: https://developers.cloudflare.com/images/
- Shadcn UI: https://ui.shadcn.com/
- TailwindCSS: https://tailwindcss.com/

---

## 15. Document History

| Version | Date        | Author       | Changes                                                                    |
| ------- | ----------- | ------------ | -------------------------------------------------------------------------- |
| 1.0     | Feb 7, 2026 | Product Team | Initial draft                                                              |
| 1.1     | Feb 7, 2026 | Product Team | Switch to Cloudflare Images transformation, fix server function API format |

---

_This document is a living specification and will be updated as the project evolves. All stakeholders should review and approve changes before implementation begins._
