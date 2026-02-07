# Deployment Guide

## Prerequisites

- Node.js 22+
- Bun runtime
- Cloudflare account with R2 enabled
- SQLite-compatible file system (for production)

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Database
DATABASE_PATH=./src/data/prompty.db

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=prompty
R2_PUBLIC_URL=https://your-bucket.r2.dev

# Cloudflare Images (optional)
CLOUDFLARE_IMAGES_ACCOUNT_ID=your_account_id
CLOUDFLARE_IMAGES_TOKEN=your_images_token

# Admin Authentication
ADMIN_PASSWORD=your_secure_password_here

# Session Management
SESSION_SECRET=generate_a_secure_random_string_at_least_32_characters

# Application
NODE_ENV=production
PORT=3000
```

## Production Build

```bash
# Install dependencies
bun install

# Build for production
bun run build

# Preview production build
bun run preview
```

## Deployment Options

### 1. Node.js Server

```bash
# Build and start
bun run build
NODE_ENV=production PORT=3000 bun run preview
```

### 2. Docker

```dockerfile
FROM oven/bun:1

WORKDIR /app
COPY package.json bun.lock ./
RUN bun install

COPY . .
RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "preview"]
```

### 3. Cloudflare Pages

1. Connect your repository to Cloudflare Pages
2. Set build command: `bun install && bun run build`
3. Set output directory: `dist/client`
4. Add environment variables in Cloudflare dashboard

### 4. Vercel

```bash
npm i -g vercel
vercel
```

## Cloudflare R2 Setup

1. Create R2 bucket in Cloudflare dashboard
2. Generate R2 API token with read/write permissions
3. Configure CORS for your domain:

```json
[
  {
    "AllowedOrigins": ["https://your-domain.com"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"]
  }
]
```

## Database Initialization

The SQLite database is automatically initialized on first run. For production, ensure the `src/data` directory exists and is writable.

## Performance Optimization

- Enable gzip compression on your reverse proxy
- Set up Redis for session storage in high-traffic scenarios
- Configure CDN caching for static assets
- Use Cloudflare Images transformations for optimal image delivery

## Monitoring

- Set up error tracking (e.g., Sentry)
- Configure logging (e.g., Winston, Pino)
- Monitor R2 storage usage and costs

## Security Checklist

- [ ] Use strong ADMIN_PASSWORD (16+ characters)
- [ ] Enable HTTPS only
- [ ] Set up rate limiting
- [ ] Configure CORS properly
- [ ] Regular backups of SQLite database
- [ ] Rotate R2 API keys periodically
