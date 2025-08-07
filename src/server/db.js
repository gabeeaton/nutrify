import pkg from "pg";
const { Pool } = pkg;

// Environment-based configuration
const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: `postgresql://postgres.ahhnjzoatydxvxoosptr:Sheckwes0..@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
  ssl: {
    rejectUnauthorized: false,
  },
  // Connection pool settings
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
  maxUses: 7500, // Close (and replace) a connection after it has been used 7500 times
});

// Test the connection
pool.on("connect", (client) => {
  console.log("🔌 New client connected to database");
});

pool.on("error", (err, client) => {
  console.error("❌ Unexpected error on idle client", err);
  process.exit(-1);
});

pool.on("remove", (client) => {
  console.log("🔌 Client removed from pool");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🔄 Shutting down database pool...");
  await pool.end();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🔄 Shutting down database pool...");
  await pool.end();
  process.exit(0);
});

export default pool;
