import express from "express";
import cors from "cors";
import pool from "./db.js"

const app = express();

app.use(cors());
app.use(express.json());


//ROUTES//


//Add user to database

//Authenticate users

//POST food

//GET food

//EDIT Food

//REMOVE food

//GET settings

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});