import { drizzle } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

const databaseUrl = process.env.DATABASE_URL;

let pool: InstanceType<typeof Pool> | null = null;
type DatabaseClient = NodePgDatabase<Record<string, never>>;
let db: DatabaseClient | null = null;

if (databaseUrl) {
  pool = new Pool({
    connectionString: databaseUrl,
  });
  db = drizzle(pool);
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "[db] DATABASE_URL not set. Falling back to in-memory storage for development."
  );
} else {
  throw new Error("DATABASE_URL must be set. Did you forget to provision a database?");
}

export { pool, db, type DatabaseClient };
