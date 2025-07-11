// server.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, param, validationResult } from "express-validator";
import pool from "./db.js";
import pkg from 'pg';

const { Client } = pkg;
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with environment variables
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Connect to database
const connectDB = async () => {
  try {
    await client.connect();
    console.log("Connected to Supabase PostgreSQL");
  } catch (error) {
    console.error("Database connection error:", error.stack);
    process.exit(1);
  }
};

// Error handling middleware
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Response helper
const sendResponse = (res, statusCode, data = null, message = null) => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data
  });
};

// VALIDATION SCHEMAS
const signUpValidation = [
  body('firebase_id').notEmpty().withMessage('Firebase ID is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('calories_goal').optional().isNumeric().withMessage('Calories goal must be a number'),
  body('protein_goal').optional().isNumeric().withMessage('Protein goal must be a number'),
  body('fat_goal').optional().isNumeric().withMessage('Fat goal must be a number'),
  body('carbs_goal').optional().isNumeric().withMessage('Carbs goal must be a number'),
];

const logFoodValidation = [
  body('user').notEmpty().withMessage('User ID is required'),
  body('name').notEmpty().withMessage('Food name is required'),
  body('servingType').notEmpty().withMessage('Serving type is required'),
  body('serving_size').isNumeric().withMessage('Serving size must be a number'),
  body('calories').optional().isNumeric().withMessage('Calories must be a number'),
  body('protein').optional().isNumeric().withMessage('Protein must be a number'),
  body('carbs').optional().isNumeric().withMessage('Carbs must be a number'),
  body('fat').optional().isNumeric().withMessage('Fat must be a number'),
];

const paramValidation = [
  param('firebaseid').notEmpty().withMessage('Firebase ID is required'),
];

const entryParamValidation = [
  param('firebaseid').notEmpty().withMessage('Firebase ID is required'),
  param('entryid').isNumeric().withMessage('Entry ID must be a number'),
];

const editFoodValidation = [
  body('calories').optional().isNumeric().withMessage('Calories must be a number'),
  body('protein').optional().isNumeric().withMessage('Protein must be a number'),
  body('carbs').optional().isNumeric().withMessage('Carbs must be a number'),
  body('fat').optional().isNumeric().withMessage('Fat must be a number'),
];

const settingsValidation = [
  body('firebase_id').notEmpty().withMessage('Firebase ID is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('calorie_goal').optional().isNumeric().withMessage('Calorie goal must be a number'),
  body('protein_goal').optional().isNumeric().withMessage('Protein goal must be a number'),
  body('fat_goal').optional().isNumeric().withMessage('Fat goal must be a number'),
  body('carbs_goal').optional().isNumeric().withMessage('Carbs goal must be a number'),
];

// ROUTES

// Health check endpoint
app.get('/health', (req, res) => {
  sendResponse(res, 200, { status: 'healthy' }, 'Server is running');
});

// Sign up (Insert user settings)
app.post("/sign-up", 
  signUpValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const {
      firebase_id,
      email,
      calories_goal = 2000,
      protein_goal = 150,
      fat_goal = 65,
      carbs_goal = 250,
    } = req.body;

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
      [firebase_id, email, calories_goal, protein_goal, carbs_goal, fat_goal]
    );
    
    sendResponse(res, 201, result.rows[0], 'User settings created successfully');
  })
);

// Log food entry
app.post("/log-food", 
  logFoodValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const {
      user,
      email,
      name,
      calories = 0,
      protein = 0,
      carbs = 0,
      fat = 0,
      servingType,
      serving_size,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO entries (firebase_id, email, food_name, calories, protein, carbs, fats, serving_type, servings) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *;`,
      [user, email, name, calories, protein, carbs, fat, servingType, serving_size]
    );
    
    sendResponse(res, 201, result.rows[0], 'Food entry logged successfully');
  })
);

// Get entries for a specific date
app.get("/entries/:firebaseid/:date", 
  paramValidation,
  param('date').isDate().withMessage('Valid date is required'),
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firebaseid, date } = req.params;

    const result = await pool.query(
      `SELECT * FROM entries 
       WHERE firebase_id = $1 AND created_at::date = $2 
       ORDER BY created_at DESC`,
      [firebaseid, date]
    );
    
    sendResponse(res, 200, result.rows, 'Entries retrieved successfully');
  })
);

// Get total calories over past month
app.get("/total/:firebaseid", 
  paramValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firebaseid } = req.params;
    
    const result = await pool.query(
      `SELECT 
        DATE(created_at) AS day,
        SUM(calories)::INTEGER AS total_calories
      FROM entries
      WHERE firebase_id = $1 AND created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY day ASC;`,
      [firebaseid]
    );
    
    sendResponse(res, 200, result.rows, 'Monthly calorie data retrieved successfully');
  })
);

// Get daily calories for current day
app.get("/cals/:firebaseid", 
  paramValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firebaseid } = req.params;
    
    const result = await pool.query(
      `SELECT COALESCE(SUM(calories), 0)::INTEGER AS total_calories
       FROM entries
       WHERE firebase_id = $1 AND DATE(created_at) = CURRENT_DATE;`,
      [firebaseid]
    );
    
    sendResponse(res, 200, result.rows[0], 'Daily calories retrieved successfully');
  })
);

// Get calorie goal for user
app.get("/calgoal/:firebaseid", 
  paramValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firebaseid } = req.params;
    
    const result = await pool.query(
      `SELECT calorie_goal FROM settings WHERE firebase_id = $1`,
      [firebaseid]
    );
    
    if (result.rows.length === 0) {
      return sendResponse(res, 404, null, 'User settings not found');
    }
    
    sendResponse(res, 200, result.rows[0], 'Calorie goal retrieved successfully');
  })
);

// Edit food entry
app.put("/edit-food/:firebaseid/:entryid", 
  entryParamValidation,
  editFoodValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { calories, protein, carbs, fat } = req.body;
    const { firebaseid, entryid } = req.params;

    const result = await pool.query(
      `UPDATE entries
       SET calories = COALESCE($1, calories), 
           protein = COALESCE($2, protein), 
           carbs = COALESCE($3, carbs), 
           fats = COALESCE($4, fats),
           updated_at = CURRENT_TIMESTAMP
       WHERE firebase_id = $5 AND id = $6
       RETURNING *;`,
      [calories, protein, carbs, fat, firebaseid, entryid]
    );
    
    if (result.rows.length === 0) {
      return sendResponse(res, 404, null, 'Entry not found');
    }
    
    sendResponse(res, 200, result.rows[0], 'Food entry updated successfully');
  })
);

// Delete food entry
app.delete("/entries/:firebaseid/:entryid", 
  entryParamValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firebaseid, entryid } = req.params;
    
    const result = await pool.query(
      `DELETE FROM entries WHERE firebase_id = $1 AND id = $2`,
      [firebaseid, entryid]
    );
    
    if (result.rowCount === 0) {
      return sendResponse(res, 404, null, 'Entry not found');
    }
    
    sendResponse(res, 200, null, 'Entry deleted successfully');
  })
);

// Get user settings
app.get("/settings/:firebaseid", 
  paramValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const { firebaseid } = req.params;
    
    const result = await pool.query(
      `SELECT calorie_goal, carb_goal, protein_goal, fat_goal, email 
       FROM settings WHERE firebase_id = $1`,
      [firebaseid]
    );
    
    if (result.rows.length === 0) {
      return sendResponse(res, 404, null, 'User settings not found');
    }
    
    sendResponse(res, 200, result.rows[0], 'Settings retrieved successfully');
  })
);

// Update user settings
app.put("/settings", 
  settingsValidation,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const {
      firebase_id,
      email,
      calorie_goal,
      protein_goal,
      fat_goal,
      carbs_goal,
    } = req.body;
    
    const result = await pool.query(
      `UPDATE settings 
       SET email = COALESCE($2, email),
           calorie_goal = COALESCE($3, calorie_goal),
           protein_goal = COALESCE($4, protein_goal),
           fat_goal = COALESCE($5, fat_goal),
           carb_goal = COALESCE($6, carb_goal),
           updated_at = CURRENT_TIMESTAMP
       WHERE firebase_id = $1
       RETURNING *;`,
      [firebase_id, email, calorie_goal, protein_goal, fat_goal, carbs_goal]
    );
    
    if (result.rows.length === 0) {
      return sendResponse(res, 404, null, 'User settings not found');
    }
    
    sendResponse(res, 200, result.rows[0], 'Settings updated successfully');
  })
);

// 404 handler
app.use('*', (req, res) => {
  sendResponse(res, 404, null, 'Route not found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle different types of errors
  if (err.code === '23505') { // PostgreSQL unique violation
    return sendResponse(res, 409, null, 'Resource already exists');
  }
  
  if (err.code === '23503') { // PostgreSQL foreign key violation
    return sendResponse(res, 400, null, 'Invalid reference');
  }
  
  if (err.code === '22P02') { // PostgreSQL invalid input syntax
    return sendResponse(res, 400, null, 'Invalid input format');
  }
  
  // Default error response
  sendResponse(res, 500, null, 'Internal server error');
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await client.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await client.end();
  process.exit(0);
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer().catch(console.error);