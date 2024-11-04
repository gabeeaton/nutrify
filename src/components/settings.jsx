import React, { useState } from 'react';
import './settings.css';

const SettingsPage = () => {
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [fat, setFat] = useState('');
    const [carbs, setCarbs] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Goals Saved:', { calories, protein, fat, carbs });
    };

    const handleInputChange = (setter) => (e) => {
        const value = e.target.value;
        setter(value === '' ? '' : parseInt(value, 10));
    };

    const totalPercentage = (carbs || 0) + (protein || 0) + (fat || 0);

    return (
        <div className="main-cont">
            <div className="settings-container">
                <h2 style={{ color: "black" }}>Set Your Daily Nutrition Goals</h2>
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
                            placeholder="e.g., 150"
                        />
                    </div>
                    <div className="form-group">
                        <label>Fat (%)</label>
                        <input
                            type="number"
                            value={fat}
                            onChange={handleInputChange(setFat)}
                            placeholder="e.g., 70"
                        />
                    </div>
                    <div className="form-group">
                        <label>Carbs (%)</label>
                        <input
                            type="number"
                            value={carbs}
                            onChange={handleInputChange(setCarbs)}
                            placeholder="e.g., 250"
                        />
                    </div>
                    <p className={totalPercentage === 100 ? "valid" : "error"}>
                        Total: {totalPercentage}% (should equal 100%)
                    </p>
                    <button type="submit" className="save-button" disabled={totalPercentage !== 100}>Save Goals</button>
                </form>
            </div>
        </div>
    );
};

export default SettingsPage;
