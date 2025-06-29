import React, { useState } from 'react';
import { Fat, Carbs, Protein } from './food';
import './index.css';
import axios from 'axios';

const SettingsPage = ({ user }) => {
    const [calories, setCalories] = useState(null);
    const [protein, setProtein] = useState(null);
    const [fat, setFat] = useState(null);
    const [carbs, setCarbs] = useState(null);
    const [submitMessage, setSubmitMessage] = useState("");

    const url = import.meta.env.VITE_RENDER_URL;

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
        <div className="flex items-center h-screen max-[400px]:mt-20">
            <div className="flex flex-col items-center p-12 max-w-[600px] mx-auto bg-[#fff7f0] rounded-2xl shadow-xl border border-[#f3d2af] max-[400px]:rounded-xl max-[400px]:p-8">
                <h2 style={{ color: "black", fontWeight: "bold" }} className="text-[#e66c28] font-bold text-3xl max-[400px]:text-[85%]">Set Your Daily Nutrition Goals</h2>
                <div className="w-full flex flex-col gap-2.5">
                    <div className="flex justify-between">
                        <label className="mb-1.5 text-[#e66c28] font-bold max-[400px]:text-[70%]">Calories (kcal)</label>
                        <input
                            type="number"
                            value={calories}
                            onChange={handleInputChange(setCalories)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 2000"
                            className="w-[60%] p-3 border border-[#f3d2af] rounded-lg text-base bg-[#fff7f0] transition-all duration-300 focus:border-[#f28e59] focus:shadow-[0_0_8px_rgba(242,142,89,0.4)] focus:outline-none max-[400px]:text-[70%]"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="mb-1.5 text-[#e66c28] font-bold max-[400px]:text-[70%]">Protein (%)</label>
                        <input
                            type="number"
                            value={protein}
                            onChange={handleInputChange(setProtein)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 40"
                            className="w-[60%] p-3 border border-[#f3d2af] rounded-lg text-base bg-[#fff7f0] transition-all duration-300 focus:border-[#f28e59] focus:shadow-[0_0_8px_rgba(242,142,89,0.4)] focus:outline-none max-[400px]:text-[70%]"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="mb-1.5 text-[#e66c28] font-bold max-[400px]:text-[70%]">Fat (%)</label>
                        <input
                            type="number"
                            value={fat}
                            onChange={handleInputChange(setFat)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 20"
                            className="w-[60%] p-3 border border-[#f3d2af] rounded-lg text-base bg-[#fff7f0] transition-all duration-300 focus:border-[#f28e59] focus:shadow-[0_0_8px_rgba(242,142,89,0.4)] focus:outline-none max-[400px]:text-[70%]"
                        />
                    </div>
                    <div className="flex justify-between">
                        <label className="mb-1.5 text-[#e66c28] font-bold max-[400px]:text-[70%]">Carbs (%)</label>
                        <input
                            type="number"
                            value={carbs}
                            onChange={handleInputChange(setCarbs)}
                            onKeyDown={preventNegative}
                            placeholder="e.g., 40"
                            className="w-[60%] p-3 border border-[#f3d2af] rounded-lg text-base bg-[#fff7f0] transition-all duration-300 focus:border-[#f28e59] focus:shadow-[0_0_8px_rgba(242,142,89,0.4)] focus:outline-none max-[400px]:text-[70%]"
                        />
                    </div>
                    <p className={`font-bold ${totalPercentage === 100 ? "text-green-600" : "text-red-600"} max-[400px]:text-[70%]`}>
                        Total: {totalPercentage}% (should equal 100%)
                    </p>
                    <div className="flex justify-evenly mt-5">
                        <p className="font-bold text-gray-600 max-[400px]:text-[70%]">
                            <Protein /> Protein: {(protein * calories * 0.01 / 4).toFixed(0)}g
                        </p>
                        <p className="font-bold text-gray-600 max-[400px]:text-[70%]">
                            <Carbs /> Carbs: {(carbs * calories * 0.01 / 4).toFixed(0)}g
                        </p>
                        <p className="font-bold text-gray-600 max-[400px]:text-[70%]">
                            <Fat /> Fat: {(fat * calories * 0.01 / 9).toFixed(0)}g
                        </p>
                    </div>
                    <button
                        type="submit"
                        className="w-full p-4 bg-[#e66c28] text-white text-base font-bold border-none rounded-lg cursor-pointer transition-all duration-300 hover:bg-[#f28e59] active:transform active:translate-y-0.5 disabled:bg-[#f3d2af] disabled:text-white disabled:cursor-not-allowed disabled:hover:bg-[#f3d2af]"
                        disabled={totalPercentage !== 100}
                        onClick={handleRedirect}
                        onSubmit={handleSubmit}
                    >
                        Save Goals
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
