# Initialize TanStack Start Project

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** setup, infrastructure

**Description:**
Initialize the TanStack Start project with React 19 and TypeScript. Set up the project structure following the conventions in AGENTS.md.

**Complete Plan:**

1. Create new TanStack Start project with `npm create tanstack@latest` or `bun create tanstack`
2. Configure TypeScript with strict mode as per AGENTS.md requirements
3. Set up directory structure: `src/components`, `src/routes`, `src/lib`, `src/data`, `src/server/functions`
4. Configure path aliases: `@/*` → `src/*`
5. Set up ESLint and Prettier with the project's code style (no semicolons, single quotes, trailing commas)
6. Configure build scripts in package.json
7. Initialize git repository and create initial commit

**Deliverables:**

- Working TanStack Start project structure
- Configured TypeScript, ESLint, Prettier
- Verified `bun run dev` starts server on port 3000

---

# Configure TailwindCSS and Design System

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** setup, styling

**Description:**
Set up TailwindCSS with the design system defined in Section 9.1 of the PRD.

**Complete Plan:**

1. Install TailwindCSS and dependencies
2. Configure `tailwind.config.js` with:
   - Primary: Slate/Charcoal colors
   - Secondary: Warm Amber
   - Accent: Soft Coral
   - Background: Off-white/Cream
3. Set up CSS variables in `src/styles.css`
4. Configure typography: Inter for headings, system-ui for body, JetBrains Mono for code
5. Set up responsive breakpoints as per Section 9.4
6. Create `cn()` utility in `src/lib/utils.ts` for class merging
7. Install Shadcn UI components: Button, Input, Card, Modal/Dialog, Dropdown, Pagination, Toast, Badge

**Deliverables:**

- TailwindCSS configured with PRD color palette
- Responsive breakpoints working
- `cn()` utility available
- Core Shadcn components installed

---

# Set Up SQLite Database

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** setup, database

**Description:**
Create SQLite database schema as defined in Section 7.3 of the PRD.

**Complete Plan:**

1. Install better-sqlite3 driver
2. Create database initialization script in `src/lib/db.ts`
3. Create tables with schemas:
   - `images` table with id, r2_url, aspect_ratio, style_tags, quality, created_at, updated_at
   - `metadata` table with id, image_id, meta_data, character_lock, scene, subject
   - `likes` table with id, image_id, session_id, created_at
   - `sessions` table with id, admin, expires_at
4. Create indexes for frequently queried fields
5. Set up environment variable for DATABASE_PATH
6. Create migration/seed script for initial data

**Deliverables:**

- SQLite database with all required tables
- Indexes for performance
- Database connection utility

---

# Configure Cloudflare R2 Integration

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** setup, storage, infrastructure

**Description:**
Set up Cloudflare R2 for image storage with proper environment variables.

**Complete Plan:**

1. Create `.env.example` with all required R2 variables
2. Install @aws-sdk/client-s3 for R2 access
3. Create R2 utility functions in `src/lib/r2.ts`:
   - `getUploadUrl(filename)` - generates pre-signed upload URL
   - `getPublicUrl(filename)` - returns public R2 URL
4. Configure R2 client with environment variables
5. Set up CORS headers for direct browser uploads
6. Test R2 connection with sample upload
7. Create upload directory structure in R2 bucket

**Deliverables:**

- R2 integration working
- Pre-signed URL generation functional
- Environment configuration documented

---

# Create Environment Configuration Template

**Type:** task
**Priority:** P1
**Estimate:** 30
**Labels:** setup, documentation

**Description:**
Create `.env.example` and `.env` template with all required environment variables.

**Complete Plan:**

1. Create `.env.example` with all variables from Section 10.5:
   - DATABASE_PATH
   - R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL
   - CLOUDFLARE_IMAGES_ACCOUNT_ID, CLOUDFLARE_IMAGES_TOKEN (optional)
   - ADMIN_PASSWORD
   - SESSION_SECRET
   - NODE_ENV, PORT
2. Add comments explaining each variable
3. Verify application loads environment variables correctly
4. Add validation for required variables at startup

**Deliverables:**

- Complete `.env.example` file
- Runtime validation of required environment variables

---

# Create Database Schema Types

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** types, database

**Description:**
Define TypeScript interfaces for all database entities and API responses.

**Complete Plan:**

1. Create `src/types/database.ts` with interfaces:
   - `Image` - image table fields
   - `Metadata` - metadata table fields (with meta, character_lock, scene, subject objects)
   - `Like` - like records
   - `Session` - admin session records
2. Create `src/types/api.ts` with response types:
   - `GetImagesResponse` - paginated image list
   - `GetImageByIdResponse` - single image with full metadata
   - `GetTrendingResponse` - trending images
   - `ToggleLikeResponse` - like count and state
3. Create `src/types/metadata.ts` with nested types for metadata sections
4. Export all types from `src/types/index.ts`
5. Enable strict mode checking for all types

**Deliverables:**

- Complete TypeScript type definitions
- Type exports for use across application

---

# Implement Server Functions - getImages

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** backend, server-functions

**Description:**
Implement `getImages` server function with pagination, filtering, and search.

**Complete Plan:**

1. Create `src/server/functions/images.ts`
2. Implement `getImages` server function:
   - Accept parameters: page, limit, aspectRatio, style, search
   - Add validation using validator function
   - Query SQLite with filters
   - Implement full-text search on style_tags
   - Calculate pagination (page, limit, total, hasMore)
   - Join with likes table to get like_count
3. Handle edge cases: invalid page, empty results, filter combinations
4. Write unit tests for query logic
5. Test with sample data

**Deliverables:**

- Working getImages server function
- Pagination, filtering, search working
- Unit tests passing

---

# Implement Server Functions - getImageById

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** backend, server-functions

**Description:**
Implement `getImageById` server function for single image retrieval.

**Complete Plan:**

1. Add `getImageById` to `src/server/functions/images.ts`
2. Implement handler:
   - Validate image ID (positive integer)
   - Query image record
   - Query associated metadata
   - Get like_count and user's like status (if session exists)
   - Return combined response
3. Handle not found case with proper error
4. Test with valid and invalid IDs

**Deliverables:**

- getImageById server function
- Error handling for invalid IDs
- Full metadata retrieval

---

# Implement Server Functions - getTrendingImages

**Type:** task
**Priority:** P1
**Estimate:** 90
**Labels:** backend, server-functions

**Description:**
Implement `getTrendingImages` with the algorithm from Section 5.2.3.

**Complete Plan:**

1. Add `getTrendingImages` to `src/server/functions/images.ts`
2. Implement trending algorithm:
   ```
   Score = (Likes * 1.0) + (Views * 0.1) - (DaysSincePosted * DecayFactor)
   DecayFactor = 0.5 for days 1-3
               = 1.0 for days 4-7
               = 2.0 for days 8+
   ```
3. Add index optimization for likes and created_at queries
4. Set default limit (10 images)
5. Cache trending results for 1 hour (update hourly)
6. Test sorting logic with sample data

**Deliverables:**

- Trending algorithm implemented
- Caching for performance
- Test cases for edge cases

---

# Create Image Card Component

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** frontend, component

**Description:**
Create reusable ImageCard component for gallery grid.

**Complete Plan:**

1. Create `src/components/ImageCard.tsx`
2. Implement props interface:
   - `image: Image` (with like_count)
   - `onLike?: (id) => void`
   - `onClick?: (id) => void`
3. Design specifications:
   - Thumbnail 300x300px ideal, 400x400px max
   - Heart icon like button top-right
   - Hover state with metadata overlay (200ms transition)
   - Aspect ratio preservation with object-fit: cover
   - Trending badge for top 10% by likes
4. Implement lazy loading with Intersection Observer
5. Add loading placeholder skeleton
6. Accessibility: keyboard nav, ARIA labels
7. Style with TailwindCSS per design system

**Deliverables:**

- ImageCard component
- Hover effects and transitions
- Accessibility features
- Lazy loading implemented

---

# Create Gallery Grid Layout

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** frontend, page

**Description:**
Implement main gallery page with responsive grid layout.

**Complete Plan:**

1. Create `src/routes/index.tsx` (main gallery)
2. Implement responsive grid breakpoints:
   - xs (<640px): 1 column
   - sm (640-767px): 2 columns
   - md (768-1023px): 3 columns
   - lg (1024-1279px): 4 columns
   - xl (1280-1535px): 5 columns
   - 2xl (>=1536px): 6 columns
3. Use TanStack Query for data fetching:
   - queryKey: ['images', { page, limit, aspectRatio, style, search }]
   - queryFn: getImages
4. Implement infinite scroll or pagination
5. Show loading state with skeleton cards
6. Handle error states with retry option
7. Empty state when no results

**Deliverables:**

- Gallery page with responsive grid
- Data fetching with TanStack Query
- Loading and error states
- Pagination working

---

# Implement Search Bar Component

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** frontend, component, search

**Description:**
Create search bar with debounced real-time search.

**Complete Plan:**

1. Create `src/components/SearchBar.tsx`
2. Implement debouncing at 300ms
3. Search across fields: title, style_tags, quality, camera, lighting, character attributes
4. Real-time results update as user types
5. Clear search button
6. Search icon styling per design system
7. Keyboard shortcut (Cmd/Ctrl+K) to focus search
8. Accessible label and focus states

**Deliverables:**

- SearchBar component
- Debounced search working
- Keyboard shortcuts
- Accessibility compliant

---

# Implement Filter Panel

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** frontend, component, filter

**Description:**
Create collapsible filter panel with aspect ratio and style filters.

**Complete Plan:**

1. Create `src/components/FilterPanel.tsx`
2. Implement aspect ratio filter (checkboxes):
   - 1:1 (Square)
   - 3:2 (Landscape)
   - 2:3 (Portrait)
   - 9:16 (Vertical/Tall)
   - 16:9 (Horizontal/Wide)
3. Implement style filter (checkboxes):
   - Photorealistic, Abstract, Anime, Digital Art
   - Oil Painting, Film Photography, Macro Photography
   - Portrait, Landscape, Fashion/Editorial, Fantasy/Sci-Fi
4. Filters additive within category (AND logic)
5. Flexible between categories (OR logic)
6. Collapsible on mobile
7. Clear all filters button
8. Active filter count indicator

**Deliverables:**

- FilterPanel component
- All filter categories working
- Mobile responsive
- Filter state persistence

---

# Implement Trending Page

**Type:** task
**Priority:** P1
**Estimate:** 90
**Labels:** frontend, page, trending

**Description:**
Create dedicated trending page with like-sorted content.

**Complete Plan:**

1. Create `src/routes/trending.tsx`
2. Use getTrendingImages server function
3. Different layout emphasizing popularity
4. Visual indicators for ranking (1st, 2nd, 3rd badges)
5. Time filter dropdown (today, this week, this month)
6. Share button for trending images
7. Test algorithm with various like counts and dates

**Deliverables:**

- Trending page route
- Sorted by trending algorithm
- Visual ranking indicators
- Time filter working

---

# Create Image Details Page

**Type:** task
**Priority:** P0
**Estimate:** 150
**Labels:** frontend, page

**Description:**
Implement image details page with full metadata display.

**Complete Plan:**

1. Create `src/routes/image.$id.tsx`
2. Layout: left rail image + right rail metadata (desktop), stacked (mobile)
3. Fetch data with getImageById server function
4. Full-size image display with Cloudflare R2 URL
5. Download image button
6. Metadata sections (collapsible):
   - Meta Section: quality, resolution, camera, lens, aspect ratio, style
   - Character Lock Section (when applicable): age, ethnicity, hair, eyes, face, body, features
   - Scene Section: location, setting, time of day, lighting, atmosphere
   - Subject Section: pose, outfit, product placement
7. Loading skeleton
8. Error handling for invalid IDs

**Deliverables:**

- Image details page
- All metadata sections
- Collapsible panels
- Responsive layout

---

# Implement JSON Export Functionality

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** frontend, feature

**Description:**
Add JSON export button to image details page.

**Complete Plan:**

1. Create `exportMetadata(image, metadata)` utility
2. Export format excludes original prompt field
3. Include all structured metadata sections
4. Filename format: `prompty-[image-id]-[timestamp].json`
5. UTF-8 encoding, 2-space indentation
6. Trigger browser download on click
7. Toast notification on export success

**Deliverables:**

- Export button and functionality
- Correct JSON format
- Toast notification

---

# Implement Like Functionality

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** frontend, feature, social

**Description:**
Implement like button with optimistic UI and localStorage persistence.

**Complete Plan:**

1. Create toggleLike server function
2. Like button component with heart icon
3. Optimistic UI update (immediate feedback)
4. Background API request
5. Rollback on failure
6. LocalStorage for session persistence
7. Display localized numbers (1.2k format)
8. Like count display in gallery grid

**Deliverables:**

- Like button component
- Optimistic updates
- localStorage persistence
- Error rollback

---

# Implement Related Images Section

**Type:** task
**Priority:** P2
**Estimate:** 90
**Labels:** frontend, feature

**Description:**
Add horizontal scroll section for related images on details page.

**Complete Plan:**

1. Create related images query (same style_tags, exclude current)
2. Horizontal scroll container
3. Related ImageCard components (smaller)
4. Scroll buttons (left/right)
5. Empty state if no related images
6. Lazy loading for related images
7. Performance optimization (limit to 10)

**Deliverables:**

- Related images section
- Horizontal scroll
- Matching algorithm

---

# Implement Admin Authentication

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** backend, security, admin

**Description:**
Create admin login system with password authentication.

**Complete Plan:**

1. Create adminLogin server function
2. Validate password against ADMIN_PASSWORD env var
3. Constant-time comparison for security
4. Generate session ID (256-bit)
5. Store session in SQLite sessions table
6. Set HTTP-only, Secure cookie
7. 24-hour expiration
8. adminLogout function
9. Session validation middleware for admin routes

**Deliverables:**

- Login/logout working
- Session management
- HTTP-only cookies
- Security best practices

---

# Create Admin Login Page

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** frontend, admin, page

**Description:**
Create admin login page with password form.

**Complete Plan:**

1. Create `src/routes/admin.login.tsx`
2. Password input field
3. Submit button with loading state
4. Error handling (invalid password)
5. Redirect to admin dashboard on success
6. Show session expiry time
7. Security notice

**Deliverables:**

- Admin login page
- Form validation
- Error handling
- Session feedback

---

# Protect Admin Routes

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** backend, security, middleware

**Description:**
Add session validation middleware to admin routes.

**Complete Plan:**

1. Create session validation helper
2. Add middleware to admin routes:
   - admin.upload
   - admin.dashboard
   - admin.images
3. Redirect to login if no valid session
4. Handle session expiry gracefully
5. Invalidate session on logout
6. Test all admin routes are protected

**Deliverables:**

- All admin routes protected
- Redirect to login
- Session validation utility

---

# Implement Image Upload - Step 1

**Type:** task
**Priority:** P0
**Estimate:** 120
**Labels:** frontend, admin, upload

**Description:**
Create upload step 1: drag & drop image upload to R2.

**Complete Plan:**

1. Create `src/components/admin/UploadStep1.tsx`
2. Drag & drop zone for image files
3. Accepted formats: JPG, PNG, WebP
4. Max file size: 10MB validation
5. Client-side preview after upload
6. Get pre-signed R2 upload URL
7. Upload directly to R2
8. Show upload progress
9. Return R2 URL on success

**Deliverables:**

- Drag & drop upload
- File validation
- R2 upload working
- Progress indicator

---

# Implement Image Upload - Step 2

**Type:** task
**Priority:** P0
**Estimate:** 180
**Labels:** frontend, admin, upload

**Description:**
Create upload step 2: comprehensive metadata entry form.

**Complete Plan:**

1. Create `src/components/admin/UploadStep2.tsx`
2. Form fields for all metadata sections:
   - Meta: quality, resolution, camera, lens, aspect ratio, style tags
   - Character Lock: age, ethnicity, hair, eyes, face, body, features
   - Scene: location, setting, time of day, lighting, atmosphere
   - Subject: pose, outfit, product placement
3. Add/remove array items (style tags, features)
4. Live JSON preview panel
5. Client-side validation
6. Character counter for text fields
7. Image preview thumbnail

**Deliverables:**

- Complete metadata form
- All form fields
- Array item management
- JSON preview

---

# Implement Image Upload - Step 3

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** frontend, admin, upload

**Description:**
Create upload step 3: review and publish.

**Complete Plan:**

1. Create `src/components/admin/UploadStep3.tsx`
2. Final preview of complete entry
3. Thumbnail preview
4. JSON preview
5. Edit buttons for each section
6. Publish button
7. Redirect to gallery on success
8. Error handling for publish failure

**Deliverables:**

- Review page
- Edit capability
- Publish workflow
- Success redirect

---

# Create Admin Upload Page

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** frontend, admin, page

**Description:**
Create admin upload page with multi-step form wizard.

**Complete Plan:**

1. Create `src/routes/admin.upload.tsx`
2. Step indicator (Step 1 of 3)
3. Multi-step form state management
4. Navigation between steps
5. Save draft between steps (localStorage)
6. Progress bar
7. Mobile responsive stepper
8. Header with admin badge

**Deliverables:**

- Admin upload page
- Step wizard
- State management
- Progress indicator

---

# Implement confirmUpload Server Function

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** backend, server-functions, admin

**Description:**
Implement server function to save image and metadata to database.

**Complete Plan:**

1. Create confirmUpload server function
2. Validate admin session
3. Insert into images table
4. Insert into metadata table
5. Return new image ID
6. Transaction handling for atomic inserts
7. Validation of all required fields
8. Error handling for duplicates

**Deliverables:**

- confirmUpload function
- Database insertion
- Transaction handling
- Error validation

---

# Implement toggleLike Server Function

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** backend, server-functions, social

**Description:**
Implement toggleLike with session tracking and optimistic support.

**Complete Plan:**

1. Create toggleLike server function
2. Get session ID from cookie
3. Check if like exists
4. Insert or delete from likes table
5. Return new like_count and is_liked state
6. Rate limiting (10 likes/minute per session)
7. Unique constraint for (image_id, session_id)
8. Test toggle behavior

**Deliverables:**

- toggleLike function
- Session-based likes
- Rate limiting
- Unique constraints

---

# Implement uploadImage Server Function

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** backend, server-functions, admin

**Description:**
Implement uploadImage to generate pre-signed R2 URLs.

**Complete Plan:**

1. Create uploadImage server function
2. Validate admin password
3. Generate unique filename (UUID + original extension)
4. Get pre-signed upload URL from R2
5. Set 15-minute expiration
6. Return upload URL to client
7. Rate limiting (5 uploads/hour per admin)
8. File size validation before upload

**Deliverables:**

- Pre-signed URL generation
- Unique filename handling
- Rate limiting
- Security validation

---

# Create Server Function Error Handling

**Type:** task
**Priority:** P1
**Estimate:** 60
**Labels:** backend, error-handling

**Description:**
Implement standardized error handling for all server functions.

**Complete Plan:**

1. Create error types (VALIDATION_ERROR, NOT_FOUND, UNAUTHORIZED, FORBIDDEN, INTERNAL_ERROR)
2. Error response format with code and message
3. HTTP status mapping
4. Global error handler in TanStack Start
5. Toast notifications for client errors
6. Logging for server errors
7. Validation helper functions

**Deliverables:**

- Error handling utility
- Standardized responses
- Client notifications
- Server logging

---

# Create Header Component

**Type:** task
**Priority:** P0
**Estimate:** 90
**Labels:** frontend, component

**Description:**
Create main header with logo, search, navigation, and theme toggle.

**Complete Plan:**

1. Create `src/components/Header.tsx`
2. Logo with app name
3. Search bar (integrate SearchBar)
4. Navigation: Home, Trending, Admin
5. Theme toggle (light/dark)
6. Sticky header with blur
7. Mobile hamburger menu
8. Responsive layout

**Deliverables:**

- Header component
- All navigation links
- Search integration
- Mobile menu

---

# Create Footer Component

**Type:** task
**Priority:** P1
**Estimate:** 60
**Labels:** frontend, component

**Description:**
Create minimal footer with essential links.

**Complete Plan:**

1. Create `src/components/Footer.tsx`
2. Minimal design per Section 9.3
3. Essential links only
4. Newsletter capture input
5. Social links
6. Copyright notice
7. Responsive layout

**Deliverables:**

- Footer component
- Newsletter capture
- Social links

---

# Create Toast Notification System

**Type:** task
**Priority:** P1
**Estimate:** 60
**Labels:** frontend, component

**Description:**
Implement toast notifications for user feedback.

**Complete Plan:**

1. Install/use Shadcn Toast component
2. Create toast utility functions:
   - showSuccess(message)
   - showError(message)
   - showInfo(message)
3. Configure default durations
4. Position top-right
5. Animation transitions
6. Dismiss button
7. Use throughout app for feedback

**Deliverables:**

- Toast system
- Utility functions
- Used throughout app

---

# Implement Page Transitions

**Type:** task
**Priority:** P2
**Estimate:** 90
**Labels:** frontend, animation

**Description:**
Add smooth page transitions using TanStack Router.

**Complete Plan:**

1. Configure TanStack Router transitions
2. Fade or slide between pages
3. Loading states during navigation
4. Preserve scroll position
5. Back/forward cache
6. Transition duration (200-300ms)
7. Reduced motion support

**Deliverables:**

- Smooth page transitions
- Loading states
- Accessibility compliant

---

# Set Up Cloudflare Images Transformations

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** infrastructure, optimization

**Description:**
Configure Cloudflare Images for automatic image optimization.

**Complete Plan:**

1. Set up Cloudflare Images variants:
   - thumbnail: 300x300, cover, auto
   - mobile: 640w, width, auto
   - tablet: 1024w, width, auto
   - full: original, contain, auto
2. Create image URL builder utility
3. Implement srcset for responsive images
4. Configure format conversion (WebP/AVIF)
5. Set cache headers
6. Test image loading performance

**Deliverables:**

- Image transformation working
- Responsive images
- Performance optimized

---

# Create Image URL Builder Utility

**Type:** task
**Priority:** P0
**Estimate:** 30
**Labels:** frontend, utility

**Description:**
Create utility for generating Cloudflare Images URLs.

**Complete Plan:**

1. Create `src/lib/images.ts`
2. Function: getImageUrl(filename, variant)
3. Function: getResponsiveSrcset(filename)
4. Fallback to direct R2 URL if Images not configured
5. CDN cache headers
6. Error handling for invalid variants

**Deliverables:**

- URL builder utility
- Responsive srcset
- Fallback handling

---

# Create Session Management Utilities

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** backend, utility

**Description:**
Create session utilities for admin authentication.

**Complete Plan:**

1. Create `src/lib/sessions.ts`
2. GenerateSessionId() - cryptographically secure
3. ValidateSession(sessionId) - check expiry
4. CreateSession(sessionId, admin) - insert to database
5. DeleteSession(sessionId) - remove from database
6. CleanupExpiredSessions() - periodic cleanup
7. Cookie helpers (set, get, clear)

**Deliverables:**

- Session utilities
- Cryptographically secure IDs
- Cookie helpers

---

# Create Rate Limiting Middleware

**Type:** task
**Priority:** P1
**Estimate:** 60
**Labels:** backend, security

**Description:**
Implement basic rate limiting for server functions.

**Complete Plan:**

1. Create rate limiter utility
2. In-memory tracking by IP/session
3. Limits:
   - General API: 100 requests/minute
   - Like endpoint: 10 likes/minute
   - Upload endpoint: 5 uploads/hour
4. Return 429 on limit exceeded
5. Headers with rate limit info
6. Sliding window or fixed window

**Deliverables:**

- Rate limiting middleware
- Per-endpoint limits
- 429 responses

---

# Implement Database Indexes

**Type:** task
**Priority:** P1
**Estimate:** 30
**Labels:** database, performance

**Description:**
Create and verify all database indexes for query performance.

**Complete Plan:**

1. Create indexes from Section 7.3.5:
   - idx_images_aspect_ratio
   - idx_images_created_at
   - idx_likes_image_id
   - idx_likes_session_id
2. Analyze query performance
3. Add additional indexes if needed
4. Monitor slow queries
5. Document index strategy

**Deliverables:**

- All indexes created
- Query performance analyzed
- Documentation

---

# Add Lazy Loading to Gallery

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** frontend, performance

**Description:**
Implement lazy loading for gallery images below fold.

**Complete Plan:**

1. Implement Intersection Observer for ImageCard
2. Load images when approaching viewport
3. Skeleton loading placeholder
4. Fade-in animation when loaded
5. Debounced image loading
6. Cancel loading if scrolled past
7. Performance metrics tracking

**Deliverables:**

- Lazy loading implemented
- Smooth scrolling
- Performance optimized

---

# Optimize Bundle Size

**Type:** task
**Priority:** P2
**Estimate:** 90
**Labels:** frontend, performance

**Description:**
Optimize bundle size and implement code splitting.

**Complete Plan:**

1. Analyze bundle with source-map-explorer
2. Implement code splitting by route
3. Lazy load heavy components
4. Tree-shaking optimization
5. Remove unused dependencies
6. Optimize images and assets
7. Target: initial bundle < 200KB

**Deliverables:**

- Code splitting
- Bundle analyzed
- Size optimized

---

# Set Up Testing Infrastructure

**Type:** task
**Priority:** P0
**Estimate:** 60
**Labels:** testing, setup

**Description:**
Set up Vitest and testing utilities.

**Complete Plan:**

1. Install Vitest and React Testing Library
2. Configure vitest.config.ts
3. Set up test utilities
4. Configure coverage reporting
5. Create sample test
6. Add test scripts to package.json

**Deliverables:**

- Vitest configured
- Test utilities available
- Sample tests passing

---

# Write Server Function Tests

**Type:** task
**Priority:** P1
**Estimate:** 120
**Labels:** testing, backend

**Description:**
Write unit tests for all server functions.

**Complete Plan:**

1. Create `src/server/functions/__tests__/`
2. Test getImages with all filter combinations
3. Test getImageById valid/invalid IDs
4. Test getTrendingImages sorting
5. Test toggleLike logic
6. Test admin authentication
7. Test uploadImage rate limiting
8. Mock SQLite database for tests

**Deliverables:**

- Server function tests
- High coverage
- Mock database

---

# Write Component Tests

**Type:** task
**Priority:** P1
**Estimate:** 120
**Labels:** testing, frontend

**Description:**
Write component tests for key UI components.

**Complete Plan:**

1. Create `src/components/__tests__/`
2. Test ImageCard rendering and interactions
3. Test SearchBar debouncing
4. Test FilterPanel filter logic
5. Test Like button optimistic updates
6. Test UploadStep forms
7. Test accessibility with jest-axe
8. Test responsive behavior

**Deliverables:**

- Component tests
- Accessibility tests
- Interaction tests

---

# Configure Production Build

**Type:** task
**Priority:** P1
**Estimate:** 60
**Labels:** deployment, build

**Description:**
Configure and test production build process.

**Complete Plan:**

1. Configure TanStack Start for production
2. Set up environment variables for production
3. Configure build output
4. Test `bun run build`
5. Test `bun run preview`
6. Optimize build settings
7. Generate build stats

**Deliverables:**

- Production build working
- Preview tested
- Build optimized

---

# Create Deployment Documentation

**Type:** task
**Priority:** P1
**Estimate:** 60
**Labels:** documentation, deployment

**Description:**
Create deployment guide for Cloudflare Pages or similar.

**Complete Plan:**

1. Create DEPLOYMENT.md
2. Prerequisites checklist
3. Environment variable setup
4. Build steps
5. Deployment commands
6. Post-deployment verification
7. Rollback procedures
8. Monitoring setup

**Deliverables:**

- Deployment documentation
- Environment checklist
- Verification steps

---

# Set Up Lint and Format Checks

**Type:** task
**Priority:** P1
**Estimate:** 30
**Labels:** ci, quality

**Description:**
Configure lint and format checks for CI/CD.

**Complete Plan:**

1. Configure ESLint rules
2. Configure Prettier
3. Add lint script: `bun run lint`
4. Add format script: `bun run format`
5. Add check script: `bun run check`
6. Configure pre-commit hooks
7. Test CI pipeline integration

**Deliverables:**

- Lint working
- Format working
- Pre-commit hooks

---

# Create Landing Page Structure

**Type:** task
**Priority:** P2
**Estimate:** 180
**Labels:** frontend, landing-page

**Description:**
Create landing page with all required sections avoiding "AI slop" aesthetic.

**Complete Plan:**

1. Create `src/routes/landing.tsx` (or static HTML)
2. Implement dark theme per Section 16.2:
   - Background: #05060b, #12141c, #2A4245
   - Text: #FFFFFF, #a1a1aa, #71717a
   - Accent: #6074DD, #56D6DA, #7FE660
3. Typography: Poppins for headings, JetBrains Mono for code
4. Hero Section with interactive demo
5. Problem/Solution narrative with scroll reveals
6. Product showcase with animated mockup
7. Social proof with testimonials
8. Technical differentiators grid
9. Conversion section with quick form
10. Minimal footer

**Deliverables:**

- Landing page
- All sections implemented
- Dark theme applied

---

# Implement Landing Page Animations

**Type:** task
**Priority:** P2
**Estimate:** 120
**Labels:** frontend, animation, landing-page

**Description:**
Add motion design and scroll-triggered animations.

**Complete Plan:**

1. Implement page load reveal sequence (0ms → 200ms → 400ms stagger)
2. Scroll-triggered fade-in-up animations
3. Parallax effects on key visuals
4. Hover interactions (scale transforms, color transitions)
5. Background ambient motion (floating particles)
6. Intersection Observer for scroll effects
7. Reduced motion support
8. Performance optimization

**Deliverables:**

- All animations working
- Scroll triggers
- Performance optimized

---

# Verify Landing Page Accessibility

**Type:** task
**Priority:** P2
**Estimate:** 60
**Labels:** accessibility, landing-page

**Description:**
Ensure landing page meets WCAG 2.1 AA standards.

**Complete Plan:**

1. Test color contrast ratios
2. Verify keyboard navigation
3. Check focus indicators
4. Add ARIA labels where needed
5. Test screen reader compatibility
6. Verify heading hierarchy
7. Test form accessibility
8. Document accessibility features

**Deliverables:**

- WCAG 2.1 AA compliant
- Keyboard navigation
- Screen reader support

---

# Final Testing and Bug Fixes

**Type:** task
**Priority:** P0
**Estimate:** 240
**Labels:** testing, polish, completion

**Description:**
Comprehensive testing and bug fixes before launch.

**Complete Plan:**

1. Run full test suite
2. Manual testing of all features
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Mobile testing
5. Accessibility audit
6. Performance testing
7. Security audit
8. Fix all critical and high bugs
9. User acceptance testing
10. Performance regression testing

**Deliverables:**

- All tests passing
- No critical bugs
- Performance targets met
