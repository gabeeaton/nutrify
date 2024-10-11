import pg from "pg";
const { Pool } = pg; 

const pool = new Pool ({
    user: "postgres",
    password: "sheckwes0",
    host: "localhost",
    port: 5432,
    database: "nutrition_tracker"
})

export default pool;