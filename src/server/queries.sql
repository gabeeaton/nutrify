CREATE TABLE foods (
    food_id SERIAL PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    serving_size VARCHAR(50),
    calories DECIMAL(5, 2),      
    protein DECIMAL(5, 2),          
    fat DECIMAL(5, 2),             
    carbohydrates DECIMAL(5, 2)       
);

CREATE TABLE meals (
    meal_id SERIAL PRIMARY KEY,    
    meal_name VARCHAR(100),         
    meal_date DATE NOT NULL,         
    meal_time TIME,                 
    total_calories DECIMAL(5, 2)    
);

CREATE TABLE meal_foods (
    meal_food_id SERIAL PRIMARY KEY, 
    meal_id INT REFERENCES meals(meal_id) ON DELETE CASCADE, 
    food_id INT REFERENCES foods(food_id) ON DELETE CASCADE, 
    quantity DECIMAL(5, 2) NOT NULL,
    calories DECIMAL(5, 2),      
    protein DECIMAL(5, 2), 
    fat DECIMAL(5, 2),
    carbohydrates DECIMAL(5, 2)
);

CREATE TABLE daily_totals (
    date DATE PRIMARY KEY,           
    total_calories DECIMAL(5, 2),    
    total_protein DECIMAL(5, 2),      
    total_fat DECIMAL(5, 2),         
    total_carbohydrates DECIMAL(5, 2),
    weight DECIMAL(5, 2) 
);
