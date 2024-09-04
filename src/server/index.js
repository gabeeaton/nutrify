import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

//ROUTES//

//Add user to database
app.post("/sign-up", (req, res) => {
  const sql = "INSERT INTO users (email, password) VALUES ($1, $2)";
  const values = [req.body.email, req.body.password];
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  pool.query(sql, values, (err, data) => {
    if(err) {
      if (err) {
        console.error("Database insertion error:", err);
        return res.status(500).json({ message: "Error inserting user into database" });
      }
    }
    if (data.length > 0) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(201).json({ message: "User account created successfully" });
  })
})

//Sign In
app.post("/login", (req, res) => {
  const sql = "SELECT * FROM users WHERE email = $1 AND password = $2";
  const values = [req.body.email, req.body.password];
  pool.query(sql, values, (err, data) => {
    if (err) {
    console.error(err);
      return res.json("Error");
    }
    if (data.length > 0) {
      return res.json("Login successful");
    } else {
      res.json("No record");
    }
  });
});


//POST food

//GET food

//EDIT Food

//REMOVE food

//GET settings

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
