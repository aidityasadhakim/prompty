import Database from 'better-sqlite3'
import { resolve } from 'path'

const dbPath = process.env.DATABASE_PATH || './src/data/prompty.db'

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    const absolutePath = resolve(dbPath)
    db = new Database(absolutePath)
    db.pragma('journal_mode = WAL')
    initializeSchema(db)
  }
  return db
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      r2_url TEXT NOT NULL,
      aspect_ratio TEXT NOT NULL,
      style_tags TEXT NOT NULL,
      quality TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS metadata (
      id INTEGER PRIMARY KEY,
      image_id INTEGER NOT NULL,
      meta_data TEXT NOT NULL,
      character_lock TEXT,
      scene TEXT,
      subject TEXT,
      FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      image_id INTEGER NOT NULL,
      session_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(image_id, session_id)
    )
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      admin INTEGER DEFAULT 0,
      expires_at DATETIME NOT NULL
    )
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_images_aspect_ratio ON images(aspect_ratio)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_images_created_at ON images(created_at)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_likes_image_id ON likes(image_id)
  `)

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_likes_session_id ON likes(session_id)
  `)
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}

export type Image = {
  id: number
  r2_url: string
  aspect_ratio: string
  style_tags: string
  quality: string | null
  created_at: string
  updated_at: string
}

export type ImageWithMetadata = Image & {
  meta_data: string
  character_lock: string | null
  scene: string
  subject: string
  like_count: number
  is_liked: boolean
}

export type Like = {
  id: number
  image_id: number
  session_id: string
  created_at: string
}

export type Session = {
  id: string
  admin: number
  expires_at: string
}

export type Pagination = {
  page: number
  limit: number
  total: number
  hasMore: boolean
}
