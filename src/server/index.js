import express from "express";
import cors from "cors";
import pool from "./db.js";
import pkg from 'pg';
const { Client } = pkg;

const app = express();

app.use(cors());
app.use(express.json());

const client = new Client({
  connectionString: `postgresql://postgres.ahhnjzoatydxvxoosptr:Sheckwes0..@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()
  .then(() => console.log("Connected to Supabase PostgreSQL"))
  .catch(err => console.error("Connection error", err.stack));

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
      return res.status(400).json({ error: "Must have firebase_id and email." });
    }

    const defaultSettings = await pool.query(
      `INSERT INTO settings (firebase_id, email, calorie_goal, protein_goal, carb_goal, fat_goal) 
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [firebase_id, email, calories_goal, protein_goal, carbs_goal, fat_goal]
    );
    
    res.status(201).json({
      message: "User settings created successfully",
      data: defaultSettings.rows[0]
    });
  } catch (err) {
    console.error("Sign-up error:", err);
    if (err.code === '23505') { // Duplicate key error
      return res.status(409).json({ error: "User already exists" });
    }
    res.status(500).json({ error: "Failed to create user settings" });
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
      timestamp
    } = req.body;

    const loggedAt = timestamp ? new Date(timestamp) : new Date();
    const localDate = new Date(loggedAt).toLocaleDateString('en-CA'); // YYYY-MM-DD in local time


    const newEntry = await pool.query(
      `INSERT INTO entries (
        firebase_id, email, food_name, calories, protein, carbs, fats,
        serving_type, servings, logged_at, entry_date
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11
      )
      RETURNING *;
      `,
      [user, email, name, calories || 0, protein || 0, carbs || 0, fat || 0, servingType, serving_size, loggedAt]
    );
    
    res.status(201).json({
      message: "Food entry logged successfully",
      data: newEntry.rows[0]
    });
  } catch (err) {
    console.error("Log food error:", err);
    res.status(500).json({ error: "Failed to log food entry" });
  }
});

//GET entries
app.get("/entries/:firebaseid/:date", async (req, res) => {
  const { firebaseid, date } = req.params;

  if (!firebaseid || !date) {
    return res.status(400).json({ error: "Firebase ID and date are required" });
  }

  try {
    const result = await pool.query(
      `SELECT * FROM entries WHERE firebase_id = $1 AND created_at::date = $2 ORDER BY created_at DESC`,
      [firebaseid, date]
    );
    
    res.status(200).json({
      message: "Entries retrieved successfully",
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Get entries error:", error);
    res.status(500).json({ error: "An error occurred while fetching entries" });
  }
});

//GET total cals over past month
app.get("/total/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  
  if (!firebaseid) {
    return res.status(400).json({ error: "Firebase ID is required" });
  }

  try {
    const result = await pool.query(
      `
      SELECT 
        entry_date AS day,
        SUM(calories) AS total_calories
      FROM 
        entries
      WHERE 
        firebase_id = $1 AND entry_date >= CURRENT_DATE - INTERVAL '30 days'
      GROUP BY 
        entry_date
      ORDER BY 
        day ASC;
    `,
      [firebaseid]
    );
    
    res.status(200).json({
      message: "Monthly calorie totals retrieved successfully",
      data: result.rows,
      count: result.rows.length
    });
  } catch (error) {
    console.error("Get total calories error:", error);
    res.status(500).json({ error: "An error occurred while fetching calories" });
  }
});


//get calories for today
app.get("/cals/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  
  if (!firebaseid) {
    return res.status(400).json({ error: "Firebase ID is required" });
  }

  try {
    const result = await pool.query(`
      SELECT
        SUM(calories) AS total_calories,
        SUM(protein) AS total_protein,
        SUM(carbs) AS total_carbs,
        SUM(fats) AS total_fats
      FROM
        entries
      WHERE
        firebase_id = $1 AND
        DATE(created_at) = CURRENT_DATE;
    `, [firebaseid]);
    
    if (result.rows.length > 0 && result.rows[0].total_calories !== null) {
      res.status(200).json({
        message: "Daily macros retrieved successfully",
        data: result.rows[0]
      });
    } else {
      res.status(200).json({
        message: "No entries found for today",
        data: {
          total_calories: 0,
          total_protein: 0,
          total_carbs: 0,
          total_fats: 0
        }
      });
    }
  } catch (error) {
    console.error("Get daily macros error:", error);
    res.status(500).json({ error: "An error occurred while fetching macros" });
  }
});

//GET calorie goal
app.get("/calgoal/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  
  if (!firebaseid) {
    return res.status(400).json({ error: "Firebase ID is required" });
  }

  try {
    const result = await pool.query(`SELECT calorie_goal FROM settings WHERE firebase_id = $1`, [firebaseid]);
    
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Calorie goal retrieved successfully",
        data: result.rows[0]
      });
    } else {
      res.status(404).json({ error: "User settings not found" });
    }
  } catch (error) {
    console.error("Get calorie goal error:", error);
    res.status(500).json({ error: "Failed to retrieve calorie goal" });
  }
});

//EDIT Food
app.put("/edit-food/:firebaseid/:entryid", async (req, res) => {
  const { calories, protein, carbs, fat } = req.body;
  const { firebaseid, entryid } = req.params;

  if (!firebaseid || !entryid) {
    return res.status(400).json({ error: "Firebase ID and entry ID are required" });
  }

  try {
    const edit = await pool.query(`
      UPDATE entries
      SET calories = COALESCE($1, calories), 
          protein = COALESCE($2, protein), 
          carbs = COALESCE($3, carbs), 
          fats = COALESCE($4, fats)
      WHERE firebase_id = $5 AND id = $6
      RETURNING *;
    `, [calories, protein, carbs, fat, firebaseid, entryid]);

    if (edit.rows.length > 0) {
      res.status(200).json({
        message: "Food entry updated successfully",
        data: edit.rows[0]
      });
    } else {
      res.status(404).json({ error: "Food entry not found" });
    }
  } catch (error) {
    console.error("Edit food error:", error);
    res.status(500).json({ error: "Failed to update food entry" });
  }
});

//REMOVE food
app.delete("/entries/:firebaseid/:entryid", async (req, res) => {
  const { firebaseid, entryid } = req.params;
  
  if (!firebaseid || !entryid) {
    return res.status(400).json({ error: "Firebase ID and entry ID are required" });
  }

  try {
    const deleteEntry = await pool.query(
      `DELETE FROM entries WHERE firebase_id = $1 AND id = $2 RETURNING *;`,
      [firebaseid, entryid]
    );
    
    if (deleteEntry.rows.length > 0) {
      res.status(200).json({
        message: "Entry deleted successfully",
        data: deleteEntry.rows[0]
      });
    } else {
      res.status(404).json({ error: "Entry not found" });
    }
  } catch (error) {
    console.error("Delete entry error:", error.message);
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

// GET settings
app.get("/settings/:firebaseid", async (req, res) => {
  const { firebaseid } = req.params;
  
  if (!firebaseid) {
    return res.status(400).json({ error: "Firebase ID is required" });
  }

  try {
    const result = await pool.query(
      `SELECT calorie_goal, carb_goal, protein_goal, fat_goal FROM settings WHERE firebase_id = $1`,
      [firebaseid]
    );
    
    if (result.rows.length > 0) {
      res.status(200).json({
        message: "Settings retrieved successfully",
        data: result.rows[0]
      });
    } else {
      res.status(404).json({ error: "User settings not found" });
    }
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ error: "An error occurred while fetching settings" });
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

  if (!firebase_id) {
    return res.status(400).json({ error: "Firebase ID is required" });
  }

  try {
    const updatedSettings = await pool.query(
      `UPDATE settings 
       SET email = COALESCE($2, email),
           calorie_goal = COALESCE($3, calorie_goal),
           protein_goal = COALESCE($4, protein_goal),
           fat_goal = COALESCE($5, fat_goal),
           carb_goal = COALESCE($6, carb_goal)
       WHERE firebase_id = $1
       RETURNING *;`,
      [firebase_id, email, calorie_goal, protein_goal, fat_goal, carbs_goal]
    );

    if (updatedSettings.rows.length > 0) {
      res.status(200).json({
        message: "Settings updated successfully",
        data: updatedSettings.rows[0]
      });
    } else {
      res.status(404).json({ error: "User settings not found" });
    }
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Handle 404 routes
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});