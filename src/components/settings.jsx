import React, { useState } from 'react';
import { Fat, Carbs, Protein } from './food';
import './settings.css';
import axios from 'axios';

const SettingsPage = ({ user }) => {
    const [calories, setCalories] = useState(null);
    const [protein, setProtein] = useState(null);
    const [fat, setFat] = useState(null);
    const [carbs, setCarbs] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");

    const url = "https://ahhnjzoatydxvxoosptr.supabase.co"

    const handleSubmit = async (e) => {
        e.preventDefault();
        const goals = {
            firebase_id: user.uid,
            email: user.email,
            calorie_goal: calories,
            protein_goal: (protein * (calories * 0.01) / 4).toFixed(0),
            fat_goal: (fat * (calories * 0.01) / 9).toFixed(0),
            carbs_goal: (carbs * (calories * 0.01) / 4).toFixed(0),
        };
        const result = await axios.put(`${url}/settings`, goals);

    }
    const handleRedirect = () => {
        window.location.href = '/';
    };

    const handleInputChange = (setter) => (e) => {
        const value = parseInt(e.target.value, 10);
        setter(value);
    };

    const preventNegative = (e) => {
        if (e.key === '-' || e.key === 'e') {
            e.preventDefault();
        }
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
                            onChange={handleInputChange(setCalories)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 2000"
                        />
                    </div>
                    <div className="form-group">
                        <label>Protein (%)</label>
                        <input
                            type="number"
                            value={protein}
                            onChange={handleInputChange(setProtein)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 40"
                        />
                    </div>
                    <div className="form-group">
                        <label>Fat (%)</label>
                        <input
                            type="number"
                            value={fat}
                            onChange={handleInputChange(setFat)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 20"
                        />
                    </div>
                    <div className="form-group">
                        <label>Carbs (%)</label>
                        <input
                            type="number"
                            value={carbs}
                            onChange={handleInputChange(setCarbs)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 40"
                        />
                    </div>
                    <p className={totalPercentage === 100 ? "valid" : "error"}>
                        Total: {totalPercentage}% (should equal 100%)
                    </p>
                    <div className="macros">
                        <p>
                            <Protein /> Protein: {(protein * calories * 0.01 / 4).toFixed(0)}g
                        </p>
                        <p>
                            <Carbs /> Carbs: {(carbs * calories * 0.01 / 4).toFixed(0)}g
                        </p>
                        <p>
                            <Fat /> Fat: {(fat * calories * 0.01 / 9).toFixed(0)}g
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="save-button"
                        disabled={totalPercentage !== 100}
                        onClick={handleRedirect}
                    >
                        Save Goals
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SettingsPage;
