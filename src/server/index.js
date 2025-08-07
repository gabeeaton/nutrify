import express from "express";
import cors from "cors";
import pool from "./db.js";
import pkg from "pg";
const { Client } = pkg;

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Database connection with better error handling
const client = new Client({
  connectionString: `postgresql://postgres.ahhnjzoatydxvxoosptr:Sheckwes0..@aws-0-us-west-1.pooler.supabase.com:6543/postgres`,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
  max: 20,
});

// Connection management
let isConnected = false;

const connectDB = async () => {
  try {
    await client.connect();
    isConnected = true;
    console.log("✅ Connected to Supabase PostgreSQL");
  } catch (err) {
    console.error("❌ Database connection error:", err.message);
    isConnected = false;
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

connectDB();

// Middleware for database health check
const checkDBConnection = (req, res, next) => {
  if (!isConnected) {
    return res.status(503).json({
      error: "Database connection unavailable. Please try again later.",
    });
  }
  next();
};

// Input validation middleware
const validateFirebaseId = (req, res, next) => {
  const firebaseId = req.params.firebaseid || req.body.firebase_id;
  if (!firebaseId || typeof firebaseId !== "string" || firebaseId.length < 10) {
    return res.status(400).json({
      error: "Invalid Firebase ID provided",
    });
  }
  next();
};

const validateEmail = (req, res, next) => {
  const email = req.body.email;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({
      error: "Valid email address is required",
    });
  }
  next();
};

const validateNutritionData = (req, res, next) => {
  const { calories, protein, carbs, fat } = req.body;

  const validateNumber = (value, fieldName) => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      throw new Error(`${fieldName} must be a positive number`);
    }
    return num;
  };

  try {
    req.body.calories = validateNumber(calories, "Calories");
    req.body.protein = validateNumber(protein, "Protein");
    req.body.carbs = validateNumber(carbs, "Carbs");
    req.body.fat = validateNumber(fat, "Fat");
    next();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.code === "23505") {
    // Unique constraint violation
    return res.status(409).json({
      error: "Resource already exists",
    });
  }

  if (err.code === "23503") {
    // Foreign key violation
    return res.status(400).json({
      error: "Invalid reference data",
    });
  }

  res.status(500).json({
    error: "Internal server error. Please try again later.",
  });
};

// Logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
    );
  });
  next();
};

app.use(requestLogger);

// ROUTES

// SIGN UP (INSERT SETTINGS)
app.post(
  "/sign-up",
  checkDBConnection,
  validateFirebaseId,
  validateEmail,
  async (req, res) => {
    try {
      const {
        firebase_id,
        email,
        calories_goal = 0,
        protein_goal = 0,
        fat_goal = 0,
        carbs_goal = 0,
      } = req.body;

      // Validate numeric goals
      const goals = [calories_goal, protein_goal, fat_goal, carbs_goal];
      if (!goals.every((goal) => !isNaN(goal) && goal >= 0)) {
        return res.status(400).json({
          error: "All nutrition goals must be non-negative numbers",
        });
      }

      const result = await pool.query(
        `INSERT INTO settings (firebase_id, email, calorie_goal, protein_goal, carb_goal, fat_goal) 
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (firebase_id) DO UPDATE SET
         email = EXCLUDED.email,
         calorie_goal = EXCLUDED.calorie_goal,
         protein_goal = EXCLUDED.protein_goal,
         carb_goal = EXCLUDED.carb_goal,
         fat_goal = EXCLUDED.fat_goal
       RETURNING *;`,
        [firebase_id, email, calories_goal, protein_goal, fat_goal, carbs_goal]
      );

      res.status(201).json({
        message: "Settings created/updated successfully",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Sign-up error:", err);
      res.status(500).json({
        error: "Failed to create user settings. Please try again.",
      });
    }
  }
);

// POST food entry
app.post(
  "/log-food",
  checkDBConnection,
  validateFirebaseId,
  validateNutritionData,
  async (req, res) => {
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

      // Validate required fields
      if (!name || !servingType || serving_size === undefined) {
        return res.status(400).json({
          error: "Food name, serving type, and serving size are required",
        });
      }

      if (typeof name !== "string" || name.trim().length === 0) {
        return res.status(400).json({
          error: "Food name must be a non-empty string",
        });
      }

      if (typeof serving_size !== "number" || serving_size <= 0) {
        return res.status(400).json({
          error: "Serving size must be a positive number",
        });
      }

      const result = await pool.query(
        `INSERT INTO entries (firebase_id, email, food_name, calories, protein, carbs, fats, serving_type, servings) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *;`,
        [
          user,
          email,
          name.trim(),
          calories,
          protein,
          carbs,
          fat,
          servingType,
          serving_size,
        ]
      );

      res.status(201).json({
        message: "Food entry logged successfully",
        data: result.rows[0],
      });
    } catch (err) {
      console.error("Log food error:", err);
      res.status(500).json({
        error: "Failed to log food entry. Please try again.",
      });
    }
  }
);

// GET entries for a specific date
app.get(
  "/entries/:firebaseid/:date",
  checkDBConnection,
  validateFirebaseId,
  async (req, res) => {
    try {
      const { firebaseid, date } = req.params;

      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
        return res.status(400).json({
          error: "Invalid date format. Use YYYY-MM-DD",
        });
      }

      const result = await pool.query(
        `SELECT * FROM entries 
       WHERE firebase_id = $1 AND created_at::date = $2
       ORDER BY created_at DESC`,
        [firebaseid, date]
      );

      res.json({
        data: result.rows,
        count: result.rows.length,
      });
    } catch (error) {
      console.error("Get entries error:", error);
      res.status(500).json({
        error: "Failed to fetch entries. Please try again.",
      });
    }
  }
);

// GET total calories over past month
app.get(
  "/total/:firebaseid",
  checkDBConnection,
  validateFirebaseId,
  async (req, res) => {
    try {
      const { firebaseid } = req.params;

      const result = await pool.query(
        `SELECT 
        DATE(created_at) AS day,
        SUM(calories) AS total_calories,
        COUNT(*) AS entry_count
       FROM entries
       WHERE firebase_id = $1 
         AND created_at >= NOW() - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY day ASC;`,
        [firebaseid]
      );

      res.json({
        data: result.rows,
        summary: {
          totalDays: result.rows.length,
          averageCalories:
            result.rows.length > 0
              ? result.rows.reduce(
                  (sum, row) => sum + parseFloat(row.total_calories || 0),
                  0
                ) / result.rows.length
              : 0,
        },
      });
    } catch (error) {
      console.error("Get total calories error:", error);
      res.status(500).json({
        error: "Failed to fetch calorie data. Please try again.",
      });
    }
  }
);

// GET daily calories
app.get(
  "/cals/:firebaseid",
  checkDBConnection,
  validateFirebaseId,
  async (req, res) => {
    try {
      const { firebaseid } = req.params;

      const result = await pool.query(
        `
      SELECT
        COALESCE(SUM(calories), 0) AS total_calories,
        COUNT(*) AS entry_count
      FROM entries
      WHERE firebase_id = $1 
        AND DATE(created_at) = CURRENT_DATE;
    `,
        [firebaseid]
      );

      res.json({
        data: result.rows[0],
        date: new Date().toISOString().split("T")[0],
      });
    } catch (error) {
      console.error("Get daily calories error:", error);
      res.status(500).json({
        error: "Failed to fetch daily calories. Please try again.",
      });
    }
  }
);

// GET calorie goal
app.get(
  "/calgoal/:firebaseid",
  checkDBConnection,
  validateFirebaseId,
  async (req, res) => {
    try {
      const { firebaseid } = req.params;

      const result = await pool.query(
        `SELECT calorie_goal FROM settings WHERE firebase_id = $1`,
        [firebaseid]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "User settings not found. Please complete your profile setup.",
        });
      }

      res.json({
        data: result.rows[0],
        firebase_id: firebaseid,
      });
    } catch (error) {
      console.error("Get calorie goal error:", error);
      res.status(500).json({
        error: "Failed to fetch calorie goal. Please try again.",
      });
    }
  }
);

// EDIT food entry
app.put(
  "/edit-food/:firebaseid/:entryid",
  checkDBConnection,
  validateFirebaseId,
  validateNutritionData,
  async (req, res) => {
    try {
      const { calories, protein, carbs, fat } = req.body;
      const { firebaseid, entryid } = req.params;

      // Validate entry ID
      const entryId = parseInt(entryid);
      if (isNaN(entryId) || entryId <= 0) {
        return res.status(400).json({
          error: "Invalid entry ID",
        });
      }

      // Check if entry exists and belongs to user
      const checkResult = await pool.query(
        `SELECT id FROM entries WHERE firebase_id = $1 AND id = $2`,
        [firebaseid, entryId]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({
          error: "Food entry not found or access denied",
        });
      }

      const result = await pool.query(
        `UPDATE entries
       SET calories = $1, protein = $2, carbs = $3, fats = $4, updated_at = NOW()
       WHERE firebase_id = $5 AND id = $6
       RETURNING *;`,
        [calories, protein, carbs, fat, firebaseid, entryId]
      );

      res.json({
        message: "Food entry updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Edit food error:", error);
      res.status(500).json({
        error: "Failed to update food entry. Please try again.",
      });
    }
  }
);

// DELETE food entry
app.delete(
  "/entries/:firebaseid/:entryid",
  checkDBConnection,
  validateFirebaseId,
  async (req, res) => {
    try {
      const { firebaseid, entryid } = req.params;

      // Validate entry ID
      const entryId = parseInt(entryid);
      if (isNaN(entryId) || entryId <= 0) {
        return res.status(400).json({
          error: "Invalid entry ID",
        });
      }

      const result = await pool.query(
        `DELETE FROM entries WHERE firebase_id = $1 AND id = $2 RETURNING id`,
        [firebaseid, entryId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "Food entry not found or access denied",
        });
      }

      res.json({
        message: "Food entry deleted successfully",
        deletedId: entryId,
      });
    } catch (error) {
      console.error("Delete entry error:", error);
      res.status(500).json({
        error: "Failed to delete food entry. Please try again.",
      });
    }
  }
);

// GET settings
app.get(
  "/settings/:firebaseid",
  checkDBConnection,
  validateFirebaseId,
  async (req, res) => {
    try {
      const { firebaseid } = req.params;

      const result = await pool.query(
        `SELECT carb_goal, protein_goal, fat_goal, calorie_goal, email 
       FROM settings WHERE firebase_id = $1`,
        [firebaseid]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error: "User settings not found. Please complete your profile setup.",
        });
      }

      res.json({
        data: result.rows[0],
        firebase_id: firebaseid,
      });
    } catch (err) {
      console.error("Get settings error:", err);
      res.status(500).json({
        error: "Failed to fetch settings. Please try again.",
      });
    }
  }
);

// UPDATE settings
app.put(
  "/settings",
  checkDBConnection,
  validateFirebaseId,
  validateEmail,
  async (req, res) => {
    try {
      const {
        firebase_id,
        email,
        calorie_goal,
        protein_goal,
        fat_goal,
        carbs_goal,
      } = req.body;

      // Validate numeric goals
      const goals = [calorie_goal, protein_goal, fat_goal, carbs_goal];
      if (!goals.every((goal) => !isNaN(goal) && goal >= 0)) {
        return res.status(400).json({
          error: "All nutrition goals must be non-negative numbers",
        });
      }

      const result = await pool.query(
        `UPDATE settings 
       SET email = COALESCE($2, email),
           calorie_goal = COALESCE($3, calorie_goal),
           protein_goal = COALESCE($4, protein_goal),
           fat_goal = COALESCE($5, fat_goal),
           carb_goal = COALESCE($6, carb_goal),
           updated_at = NOW()
       WHERE firebase_id = $1
       RETURNING *;`,
        [firebase_id, email, calorie_goal, protein_goal, fat_goal, carbs_goal]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          error:
            "User settings not found. Please complete your profile setup first.",
        });
      }

      res.json({
        message: "Settings updated successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({
        error: "Failed to update settings. Please try again.",
      });
    }
  }
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    database: isConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

// Error handling middleware
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await client.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await client.end();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});
