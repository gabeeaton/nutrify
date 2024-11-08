import React, { useState } from 'react';
import { Fat, Carbs, Protein } from './food';
import './settings.css';
import axios from 'axios';

const SettingsPage = ({user}) => {
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [fat, setFat] = useState(0);
    const [carbs, setCarbs] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const goals = {
            firebase_id: user.uid,
            email: user.email,
            calorie_goal: calories,
            protein_goal: protein  * (calories * .01 / 4).toFixed(0),
            fat_goal: fat  * (calories * .01 / 4).toFixed(0),
            carbs_goal: carbs  * (calories * .01 / 4).toFixed(0),
        };
        const result = await axios.put("http://localhost:3000/settings", goals);

    };

    const handleInputChange = (setter) => (e) => {
        const value = e.target.value;
        setter(value === '' ? '' : parseInt(value, 10));
    };

    const totalPercentage = (carbs || 0) + (protein || 0) + (fat || 0);

    return (
        <div className="main-cont">
            <div className="settings-container">
                <h2 style={{ color: "black", fontWeight: "bold" }}>Set Your Daily Nutrition Goals</h2>
                <form onSubmit={handleSubmit} className="settings-form">
                    <div className="form-group">
                        <label>Calories (kcal)</label>
                        <input
                            type="number"
                            value={calories}
                            onChange={(e) => setCalories(e.target.value)}
                            placeholder="e.g., 2000"
                        />
                    </div>
                    <div className="form-group">
                        <label>Protein (%)</label>
                        <input
                            type="number"
                            value={protein}
                            onChange={handleInputChange(setProtein)}
                            placeholder="e.g., 40"
                        />
                    </div>
                    <div className="form-group">
                        <label>Fat (%)</label>
                        <input
                            type="number"
                            value={fat}
                            onChange={handleInputChange(setFat)}
                            placeholder="e.g., 20"
                        />
                    </div>
                    <div className="form-group">
                        <label>Carbs (%)</label>
                        <input
                            type="number"
                            value={carbs}
                            onChange={handleInputChange(setCarbs)}
                            placeholder="e.g., 40"
                        />
                    </div>
                    <p className={totalPercentage === 100 ? "valid" : "error"}>
                        Total: {totalPercentage}% (should equal 100%)
                    </p>
                    <div class="macros">
                        <p>
                            <Protein /> Protein: {(protein * calories * .01 / 4).toFixed(0)}g
                        </p>
                        <p>
                            <Carbs /> Carbs: {(carbs * calories * .01 / 4).toFixed(0)}g
                        </p>
                        <p>
                        <Fat /> Fat: {(fat * calories * 0.01 / 4).toFixed(0)}g
                        </p>
                    </div>
                    <button type="submit" className="save-button" disabled={totalPercentage !== 100} onClick={handleSubmit}>Save Goals</button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
