import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import { fetchAPI } from "./api.js";

const app = express();
const port = 3000;

const app_key = '4f6ba1ac291cb9d9f5fced4ea3378e3b';
const app_id = '2553f5e4';
const GET_API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;
const api_key = 'd3e40ed6';

const db = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'nutrition_tracker',
    password: 'sheckwes0',
    port: 5432,
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error', err.stack));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/search", async(req, res) => {
    const { query } = req.query;
    if(!query){
        return res.status(400).json({ error: "Missing required fields" });
    }
    try{ 
        const data = await fetchAPI(query);
        res.json(data);
    } catch(err) {
        console.error(err.message);
    }
});

app.post("/meals", async(req, res) => {
    const {name, calories, protein, fat, carbs} = req.body;
    try{
        const query = "INSERT INTO foods (name, calories, protein, fat, carbs) VALUES ($1, $2, $3, $4, $5)";
        const values = [name, calories, protein, fat, carbs];
        const result = await db.query(query,values);
        res.json(result.rows[0]);
    } catch (err) {
        console.log("error inserting meal data")
        console.error(err.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});