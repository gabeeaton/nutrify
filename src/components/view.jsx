import React, { useState, useEffect } from "react";
import axios from "axios";
import { Protein, Carbs, Fat } from "./food";
import { Link } from "react-router-dom";
import { Pie, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';
import "./view.css";

ChartJS.register(
    Title, Tooltip, Legend, ArcElement, CategoryScale,
    LinearScale, PointElement, LineElement, ChartDataLabels
);

const Dashboard = ({ user }) => {
    const [entries, setEntries] = useState([]);
    const [currentDate, setCurrentDate] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [year, setYear] = useState("");
    const [settings, setSettings] = useState({ carb_goal: 0, protein_goal: 0, fat_goal: 0 });

    const [calorieChartData, setCalorieChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Calories',
                data: [],
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    });

    // Get today's date
    const getDate = () => {
        const datenow = new Date();
        setCurrentDate(generateDatabaseDateTime(datenow));

        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        setFormattedDate(datenow.toLocaleDateString('en-US', options));

        const yearOptions = { year: 'numeric' };
        setYear(datenow.toLocaleDateString('en-US', yearOptions));
    };

    // Format date for database
    const generateDatabaseDateTime = (date) => {
        const p = new Intl.DateTimeFormat('en', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).formatToParts(date).reduce((acc, part) => {
            acc[part.type] = part.value;
            return acc;
        }, {});
        return `${p.year}-${p.month}-${p.day}`;
    };

    // Fetch user's entries for the current date
    const getEntries = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/entries/${user.uid}/${currentDate}`);
            setEntries(response.data);
            console.log(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch user settings
    const fetchSettings = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/settings/${user.uid}`);
            if (response.data.length > 0) {
                const { carb_goal, protein_goal, fat_goal } = response.data[0];
                setSettings({ carb_goal, protein_goal, fat_goal });
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch calories data for the chart
    const getCalories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/entries/${user.uid}`);
            const days = response.data.map(entry => new Date(entry.day).toLocaleDateString());
            const calories = response.data.map(entry => entry.total_calories);
            setCalorieChartData({
                labels: days,
                datasets: [{
                    data: calories,
                    borderColor: 'rgba(75,192,192,1)',
                    tension: 0.4, // Slight curve in the line
                    pointBackgroundColor: 'rgba(75,192,192,1)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: false, // Line is not filled under the graph
                    borderWidth: 2, // Line thickness
                    hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                }]
            });
        } catch (err) {
            console.error(err);
        }
    };

    const getMacros = async () => {
        try{
            const response = await axios.get(`http://localhost:3000/macros/${user.uid}`);
            console.log(response.data);
        } catch(err) {
            console.error(err);
        }
    }

    
    // Fetch all necessary data
    useEffect(() => {
        getDate();
        if (currentDate) {
            getEntries();
        }
        fetchSettings();
        getCalories();
        getMacros();
    }, [currentDate]);

    // Chart data for macronutrients
    const macronutrientChartData = {
        labels: ["Carbs", "Protein", "Fat"],
        datasets: [
            {
                label: "Macro Goals",
                data: [settings.carb_goal, settings.protein_goal, settings.fat_goal],
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
            }
        ]
    };

    const macronutrientChartOptions = {
        plugins: {
            datalabels: {
                color: '#fff',
                font: { weight: 'bold', size: 16 },
                formatter: (value) => `${value}g`,
            },
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Your Macronutrient Goals',
                font: { size: 15, weight: 'bold' },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
    };

    const calorieChartOptions = {
        plugins: {
            datalabels: {
                color: '#000', // Set the data labels to black
                font: { weight: 'bold', size: 11 },
                formatter: (value) => `${value} kcal`, // Displaying calories with unit
                align: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw} kcal`, // Custom tooltip text
                },
            },
            legend: {
                display: false, // Remove the legend
            },
            title: {
                display: true,
                text: 'Daily Calorie Intake',
                font: { size: 16, weight: 'bold', color: '#000' }, // Set title to black
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: '#ddd', // Light grid lines
                    borderColor: '#ccc',
                    borderWidth: 1,
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                    color: '#000', // Set x-axis labels to black
                },
            },
            y: {
                grid: {
                    color: '#ddd', // Light grid lines
                    borderColor: '#ccc',
                    borderWidth: 1,
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                    color: '#000', // Set y-axis labels to black
                    beginAtZero: true, // Ensure y-axis starts from 0
                },
            },
        },
    };

    return (
        <div className="wrap">
            <div className="main-container">
                <div className="grid-item grid-item-header">
                    {user && <h1>Welcome, {user.email}</h1>}
                    <Link className="nav-link" to="/">
                        <button className="home-btn">Home</button>
                    </Link>
                </div>
                <div className="grid-item grid-item-main shadow">
                    <Line data={calorieChartData} options={calorieChartOptions} />
                </div>
                <div className="grid-item grid-item2 shadow">
                    <h3 className="date">{formattedDate}</h3>
                    <h1 className="year">{year}</h1>
                </div>
                <div className="grid-item grid-item3 shadow">
                    <Pie data={macronutrientChartData} options={macronutrientChartOptions} />
                </div>
                <div className="grid-item grid-item4 shadow">
                    {entries.length === 0 ? (
                        <p className="none">No entries found.</p>
                    ) : (
                        <ul className="entry-list">
                            {entries.map((entry) => (
                                <li key={entry.id} className="entry-item">
                                    <h5>{entry.food_name}</h5>
                                    <p><span style={{ fontWeight: "normal", color: "black", textTransform: "none" }}>Servings:</span> {entry.servings}</p>
                                    <div className="macros">
                                        <p><Protein /> {entry.protein}g</p>
                                        <p><Carbs /> {entry.carbs}g</p>
                                        <p><Fat /> {entry.fats}g</p>
                                    </div>
                                    <div className="buttons">
                                        <button className="edit-button"><Edit /></button>
                                        <button className="delete-button"><Delete /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="grid-item"></div>
            </div>
        </div>
    );
};

const Edit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-pencil" viewBox="0 0 16 16">
        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
    </svg>
);

function Delete() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" className="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
    )
}

export default Dashboard;
