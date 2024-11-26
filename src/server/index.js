import express from "express";
import cors from "cors";
import pool from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

//ROUTES//

//SIGN UP(INSERT SETTINGS)
app.post("/sign-up", async (req, res) => {
  try {
    const {
      firebase_id,
      email,
      calories_goal,
      protein_goal,
      fat_goal,
      carbs_goal,
    } = req.body;

    if (!firebase_id || !email) {
      return res.status(400).json({ error: "Must have id and email. " });
    }
    const defaultSettings = await pool.query(
      `INSERT INTO settings (firebase_id, email, calorie_goal, protein_goal, carb_goal, fat_goal) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [firebase_id, email, calories_goal, protein_goal, fat_goal, carbs_goal]
    );
    res.json(defaultSettings.rows)
  } catch (err) {
    console.error(err);
  }
});

//POST food
app.post("/log-food", async (req, res) => {
  try {
    const {
      user,
      email,
      name,
      calories,
      protein,
      carbs,
      fat,
      servingType,
      serving_size,
    } = req.body;

    if (!servingType || !serving_size) {
      return res.status(400).json({ error: "All fields are requried." });
    }

    const newEntry = await pool.query(
      `INSERT INTO entries (firebase_id, email, food_name, calories, protein, carbs, fats, serving_type, servings) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *;`,
      [
        user,
        email,
        name,
        calories,
        protein,
        carbs,
        fat,
        servingType,
        serving_size,
      ]
    );
  } catch (err) {
    console.error(err);
  }
});

//GET entries
app.get("/entries/:firebaseid/:date", async (req, res) => {
  const { firebaseid, date } = req.params;
  try {
    const result = await pool.query(
      `SELECT * FROM entries WHERE firebase_id = $1 AND created_at::date = $2`,
      [firebaseid, date]
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching entries." });
  }
});

//GET total cals over past month
app.get("/entries/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  try {
    const result = await pool.query(
      `
      SELECT 
        DATE(created_at) AS day,
        SUM(calories) AS total_calories
      FROM 
        entries
      WHERE 
        firebase_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY 
        DATE(created_at)
      ORDER BY 
        day ASC;
    `,
      [firebaseid]
    );
    res.json(result.rows);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching calories." });
  }
});

//get macros for the day
app.get("/cals/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  try {
    const result = await pool.query(`
    SELECT
    SUM(calories) AS total_calories
FROM
    entries
WHERE
    firebase_id = $1 AND
    DATE(created_at) = CURRENT_DATE;
    `, [firebaseid]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]); // Send the data back to the client
    } else {
      res.status(404).json({ error: "No data found for the provided firebaseid." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching macros." });
  }
});

app.get("/calgoal/:firebaseid", async (req, res) => {
  const {firebaseid} = req.params;
  try{
    const result = await pool.query(`SELECT calorie_goal FROM settings WHERE firebase_id = $1`, [firebaseid]);
    res.json(result.rows);
  } catch(error) {
    console.error(error);
  }
});

//EDIT Food
app.put("/edit-food/:firebaseid/:entryid", async (req, res) => {
  const { calories, protein, carbs, fat } = req.body;
  // Destructure URL parameters for firebaseid and entryid
  const { firebaseid, entryid } = req.params;


  try {
    const edit = await pool.query(`UPDATE ENTRIES
       SET calories = $1, protein = $2, carbs = $3, fats = $4
       WHERE firebase_id = $5 AND id = $6;
    `, [ calories, protein, carbs, fat, firebaseid, entryid])
  } catch(error) {
    console.error(error);
  }
})

//REMOVE food
app.delete("/entries/:firebaseid/:entryid", async (req, res) => {
  const { firebaseid, entryid} = req.params;
  try{
    const deleteEntry = await pool.query(
      `DELETE FROM entries WHERE firebase_id = $1 AND id = $2`,[firebaseid, entryid]
    )
    res.json("Successfully deleted");
  } catch(error) {
    console.error(error.message);
  }
});

// GET settings
app.get("/settings/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  try {
    const result = await pool.query(
      `SELECT carb_goal, protein_goal, fat_goal FROM settings WHERE firebase_id = $1`,
      [firebaseid]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching settings." });
  }
});

// EDIT settings
app.put("/settings", async (req, res) => {
  const {
    firebase_id,
    email,
    calorie_goal,
    protein_goal,
    fat_goal,
    carbs_goal,
  } = req.body;
  try {
    const updatedSettings = await pool.query(
      `UPDATE settings 
    SET email = COALESCE($2, email),
        calorie_goal = COALESCE($3, calorie_goal),
        protein_goal = COALESCE($4, protein_goal),
        fat_goal = COALESCE($5, fat_goal),
        carb_goal = COALESCE($6, carb_goal)
    WHERE firebase_id = $1
    RETURNING *;
  `,
      [firebase_id, email, calorie_goal, protein_goal, fat_goal, carbs_goal]
    );
  } catch (error) {
    console.error(error);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
