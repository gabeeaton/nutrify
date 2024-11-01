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
    const {name, calories, protein, carbs, fat, servingType, serving_size} = req.body;

    if( !servingType || !serving_size ) {
      return res.status(400).json({error: "All fields are requried."})
    }

    console.log(name, calories, protein, carbs, fat, servingType, serving_size );
    const newEntry = await pool.query(
      `INSERT INTO foods (name, calories, protein, carbs, fats, serving_type, servings) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *;`, 
      [name, calories, protein, carbs, fat, serving_size, servingType]
  );
  }
  catch(err) {
    console.error(err);
  }
})

//POST custom food



//GET food

//EDIT Food

//REMOVE food

//GET settings

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});