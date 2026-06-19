import { Pool } from 'pg'

// Singleton-Pool für alle Server Components
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URI,
      // Serverless-freundlich: kleiner Pool, zügiges Schließen leerer Verbindungen,
      // damit Neon-Verbindungslimits bei vielen Cold-Starts nicht erschöpft werden.
      max: 5,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000,
    })
  }
  return pool
}
