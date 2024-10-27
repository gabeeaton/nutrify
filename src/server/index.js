import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());


//ROUTES//

//POST food
app.post("/log-food", async(req, res) => {
  try{
    const {total, totalP, totalC, totalF} = req.body;
    const newEntry = await pool.query("INSERT INTO ")
  }
})

//GET food

//EDIT Food

//REMOVE food

//GET settings

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});