import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

const app = express();
const port = 3000;

const app_key = '4f6ba1ac291cb9d9f5fced4ea3378e3b';
const app_id = '2553f5e4';
const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;
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

app.get("/nutrition", async (req, res) => {
    const foodText = req.query.foodText;
    if (!foodText) {
        return res.status(400).json({ error: "foodText query parameter is required" });
    }

    try {
        const response = await axios.get(API_URL, {
            params: {
                ingr: foodText
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('Error fetching data from Edamam API', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});