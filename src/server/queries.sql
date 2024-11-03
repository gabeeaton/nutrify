create TABLE foods (   
    user_id SERIAL PRIMARY KEY,
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
    updated_at TIMESTAMP DEFAULT date_trunc('second', CURRENT_TIMESTAMP)
);


