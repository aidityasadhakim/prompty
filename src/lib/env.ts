export interface EnvConfig {
  database: {
    path: string
  }
  cloudflare: {
    r2: {
      accountId: string
      accessKeyId: string
      secretAccessKey: string
      bucketName: string
      publicUrl: string
    }
    images: {
      accountId: string
      token: string | null
    }
  }
  admin: {
    password: string
  }
  session: {
    secret: string
  }
  app: {
    nodeEnv: string
    port: number
  }
}

function getEnvVar(name: string): string
function getEnvVar(name: string, defaultValue: string): string
function getEnvVar(name: string, defaultValue: null): string | null
function getEnvVar(name: string, defaultValue?: string | null): string | null {
  const value = process.env[name]
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) {
      return defaultValue
    }
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return value
}

export function getEnv(): EnvConfig {
  return {
    database: {
      path: getEnvVar('DATABASE_PATH', './src/data/prompty.db'),
    },
    cloudflare: {
      r2: {
        accountId: getEnvVar('R2_ACCOUNT_ID'),
        accessKeyId: getEnvVar('R2_ACCESS_KEY_ID'),
        secretAccessKey: getEnvVar('R2_SECRET_ACCESS_KEY'),
        bucketName: getEnvVar('R2_BUCKET_NAME', 'prompty'),
        publicUrl: getEnvVar('R2_PUBLIC_URL'),
      },
      images: {
        accountId: getEnvVar('CLOUDFLARE_IMAGES_ACCOUNT_ID', ''),
        token: getEnvVar('CLOUDFLARE_IMAGES_TOKEN', null),
      },
    },
    admin: {
      password: getEnvVar('ADMIN_PASSWORD'),
    },
    session: {
      secret: getEnvVar('SESSION_SECRET'),
    },
    app: {
      nodeEnv: getEnvVar('NODE_ENV', 'development'),
      port: parseInt(getEnvVar('PORT', '3000'), 10),
    },
  }
}

export function isDev(): boolean {
  return getEnv().app.nodeEnv === 'development'
}

export function isProd(): boolean {
  return getEnv().app.nodeEnv === 'production'
}
