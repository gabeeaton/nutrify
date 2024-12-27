import pg from "pg";
const { Pool } = pg; 

const pool = new Pool ({
    user: "nutrify_db_user",
    password: "q6k1t2u6kyZmEN9KDbpisfK6Iim61Spx",
    host: "dpg-ctnhhia3esus73a22jag-a",
    port: "5432",
    database: "nutrify_db"
})

export default pool;

