import pg from "pg";
const { Pool } = pg; 

const pool = new Pool ({
    user: "postgres.ahhnjzoatydxvxoosptr",
    password: "Sheckwes0..",
    host: "aws-0-us-west-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
    pool_mode: "transaction",
})


export default pool;