import pg from "pg";
const { Pool } = pg; 

const pool = new Pool ({
    user: import.meta.env.VITE_DB_USER,
    password: import.meta.env.VITE_DB_PASSWORD,
    host:import.meta.env.VITE_DB_HOST,
    port: import.meta.env.VITE_DB_PORT,
    database: import.meta.env.VITE_DB_DATABASE
})

export default pool;

