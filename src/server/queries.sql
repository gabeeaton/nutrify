CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    firebase_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create TABLE foods (
    food_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein INT NOT NULL,
    carbs INT NOT NULL,
    fats INT NOT NULL,
    serving_size VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    meal_name VARCHAR(100) NOT NULL,
    meal_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_entries (
    entry_id SERIAL PRIMARY KEY,
    meal_id INT REFERENCES meals(meal_id),
    food_id INT REFERENCES foods(food_id),
    quantity DECIMAL(5, 2) NOT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE goals (
    goal_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    calories_goal INT NOT NULL,
    protein_goal INT NOT NULL,
    carbs_goal INT NOT NULL,
    fats_goal INT NOT NULL,
);

CREATE TABLE daily_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    log_date DATE NOT NULL,
    total_calories INT NOT NULL,
    total_protein INT NOT NULL,
    total_carbs INT NOT NULL,
    total_fats INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);