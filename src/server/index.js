import express from "express";
import cors from "cors";
import pool from "./db.js"

const app = express();

app.use(cors());
app.use(express.json());

//ROUTES//


//Add user to database

app.post('/login', (req ,res) => {
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [
        req.body.email,
        req.body.password
    ]
    pool.query(sql, [values], (err, data) => {
        if(err) return res.json("Login failed");
        return res.json(data);
    })
});

//Authenticate users

//POST food

//GET food

//EDIT Food

//REMOVE food

//GET settings

app.listen(3000, () => {
    console.log("Server is running on port 3000")
});