import pg from "pg";
const { Pool } = pg; 

const pool = new Pool ({
    user: "gabeeaton",
    password: "HYXBeklHKrvaqcnq8nzK05v3tW9lISk1",
    host: "dpg-ct2vtlbtq21c73b94iag-a",
    port: 5432,
    database: "nutrition_tracker_db"
})

export default pool;

