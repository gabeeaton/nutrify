create TABLE entries (
    id SERIAL PRIMARY KEY,
    firebase_id VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    food_name VARCHAR(255) NOT NULL,
    calories INT NOT NULL,
    protein INT NOT NULL,
    carbs INT NOT NULL,
    fats INT NOT NULL,
    serving_type VARCHAR(100) NOT NULL,
    servings INT NOT NULL,
    created_at TIMESTAMP DEFAULT date_trunc('second', CURRENT_TIMESTAMP),
    updated_at TIMESTAMP DEFAULT date_trunc('second', CURRENT_TIMESTAMP),
    FOREIGN KEY (firebase_id) REFERENCES settings(firebase_id)
);

CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    firebase_id VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    calorie_goal INT NOT NULL,
    protein_goal INT NOT NULL,
    carb_goal INT NOT NULL,
    fat_goal INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
