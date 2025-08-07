import pool from "./db.js";

// Database utility functions
export const dbUtils = {
  // Execute a query with error handling
  async executeQuery(query, params = []) {
    try {
      const result = await pool.query(query, params);
      return { success: true, data: result.rows, rowCount: result.rowCount };
    } catch (error) {
      console.error("Database query error:", error);
      return { success: false, error: error.message };
    }
  },

  // Check if a record exists
  async recordExists(table, conditions) {
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");

    const query = `SELECT 1 FROM ${table} WHERE ${whereClause} LIMIT 1`;
    const params = Object.values(conditions);

    const result = await this.executeQuery(query, params);
    return result.success && result.data.length > 0;
  },

  // Get a single record
  async getRecord(table, conditions, fields = "*") {
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");

    const query = `SELECT ${fields} FROM ${table} WHERE ${whereClause} LIMIT 1`;
    const params = Object.values(conditions);

    const result = await this.executeQuery(query, params);
    return result.success ? result.data[0] : null;
  },

  // Insert a record
  async insertRecord(table, data) {
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(", ");

    const query = `
      INSERT INTO ${table} (${columns.join(", ")}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;

    return await this.executeQuery(query, values);
  },

  // Update a record
  async updateRecord(table, data, conditions) {
    const setClause = Object.keys(data)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(", ");

    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + Object.keys(data).length + 1}`)
      .join(" AND ");

    const query = `
      UPDATE ${table} 
      SET ${setClause}, updated_at = NOW() 
      WHERE ${whereClause} 
      RETURNING *
    `;

    const params = [...Object.values(data), ...Object.values(conditions)];
    return await this.executeQuery(query, params);
  },

  // Delete a record
  async deleteRecord(table, conditions) {
    const whereClause = Object.keys(conditions)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(" AND ");

    const query = `DELETE FROM ${table} WHERE ${whereClause} RETURNING id`;
    const params = Object.values(conditions);

    return await this.executeQuery(query, params);
  },
};

// Validation utility functions
export const validationUtils = {
  // Validate Firebase ID
  isValidFirebaseId(firebaseId) {
    return (
      firebaseId &&
      typeof firebaseId === "string" &&
      firebaseId.length >= 10 &&
      /^[a-zA-Z0-9_-]+$/.test(firebaseId)
    );
  },

  // Validate email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
  },

  // Validate numeric value
  isValidNumber(value, min = 0) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min;
  },

  // Validate date format (YYYY-MM-DD)
  isValidDate(dateString) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  },

  // Validate nutrition data
  validateNutritionData(data) {
    const { calories, protein, carbs, fat } = data;
    const errors = [];

    if (!this.isValidNumber(calories))
      errors.push("Calories must be a positive number");
    if (!this.isValidNumber(protein))
      errors.push("Protein must be a positive number");
    if (!this.isValidNumber(carbs))
      errors.push("Carbs must be a positive number");
    if (!this.isValidNumber(fat)) errors.push("Fat must be a positive number");

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  // Validate food entry data
  validateFoodEntry(data) {
    const { name, servingType, serving_size } = data;
    const errors = [];

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      errors.push("Food name is required and must be a non-empty string");
    }

    if (!servingType) {
      errors.push("Serving type is required");
    }

    if (!this.isValidNumber(serving_size, 0.1)) {
      errors.push("Serving size must be a positive number");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },
};

// Response utility functions
export const responseUtils = {
  // Success response
  success(res, data = null, message = "Success", statusCode = 200) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };

    if (data !== null) {
      response.data = data;
    }

    res.status(statusCode).json(response);
  },

  // Error response
  error(res, message = "An error occurred", statusCode = 500, details = null) {
    const response = {
      success: false,
      error: message,
      timestamp: new Date().toISOString(),
    };

    if (details) {
      response.details = details;
    }

    res.status(statusCode).json(response);
  },

  // Validation error response
  validationError(res, errors) {
    return this.error(res, "Validation failed", 400, { errors });
  },

  // Not found response
  notFound(res, resource = "Resource") {
    return this.error(res, `${resource} not found`, 404);
  },

  // Unauthorized response
  unauthorized(res, message = "Access denied") {
    return this.error(res, message, 401);
  },
};

// Logging utility functions
export const loggingUtils = {
  // Log request details
  logRequest(req, res, next) {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      const logLevel = res.statusCode >= 400 ? "ERROR" : "INFO";

      console.log(
        `[${logLevel}] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`
      );

      if (res.statusCode >= 400) {
        console.error(`Request failed: ${req.method} ${req.path}`, {
          statusCode: res.statusCode,
          userAgent: req.get("User-Agent"),
          ip: req.ip,
          body: req.body,
        });
      }
    });

    next();
  },

  // Log database operations
  logDbOperation(operation, table, duration, success, error = null) {
    const logLevel = success ? "INFO" : "ERROR";
    console.log(`[DB ${logLevel}] ${operation} on ${table} - ${duration}ms`);

    if (!success && error) {
      console.error(
        `Database operation failed: ${operation} on ${table}`,
        error
      );
    }
  },
};

// Security utility functions
export const securityUtils = {
  // Sanitize input
  sanitizeInput(input) {
    if (typeof input !== "string") return input;
    return input.trim().replace(/[<>]/g, "");
  },

  // Validate and sanitize object
  sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        sanitized[key] = this.sanitizeInput(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  },

  // Rate limiting helper (basic implementation)
  createRateLimiter(maxRequests = 100, windowMs = 15 * 60 * 1000) {
    const requests = new Map();

    return (req, res, next) => {
      const ip = req.ip;
      const now = Date.now();
      const windowStart = now - windowMs;

      // Clean old entries
      if (requests.has(ip)) {
        requests.set(
          ip,
          requests.get(ip).filter((time) => time > windowStart)
        );
      }

      const userRequests = requests.get(ip) || [];

      if (userRequests.length >= maxRequests) {
        return responseUtils.error(res, "Too many requests", 429);
      }

      userRequests.push(now);
      requests.set(ip, userRequests);
      next();
    };
  },
};
