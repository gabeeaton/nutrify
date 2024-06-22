import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import axios from 'axios'

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const api_url = process.env.API_URL;
const api_key = process.env.API_KEY;
const app_key = process.env.app_key;
const app_id = process.env.app_id;

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

db.connect()
    .then(() => console.log('Connected to the database'))
    .catch(err => console.error('Database connection error', err.stack));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/nutrition", async (req, res) => {
    const foodText = req.query.foodText;
});