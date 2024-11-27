import React, { useState, useEffect } from "react";
import axios from "axios";
import { Protein, Carbs, Fat, Calories } from "./food";
import { Link } from "react-router-dom";
import { Pie, Line, Doughnut } from 'react-chartjs-2';
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
    const [isModal, setIsModal] = useState(false);
    const [editFoodName, setEditFoodName] = useState("");

    const [putCals, setPutCals] = useState(0);
    const [putProtein, setPutProtein] = useState(0);
    const [putCarbs, setPutCarbs] = useState(0);
    const [putFat, setPutFat] = useState(0);
    const [foodid, setFoodid] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');



    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1
        }]
    });

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

    const getDate = () => {
        const datenow = new Date();
        setCurrentDate(generateDatabaseDateTime(datenow));

        const options = { weekday: 'long', month: 'long', day: 'numeric' };
        setFormattedDate(datenow.toLocaleDateString('en-US', options));

        const yearOptions = { year: 'numeric' };
        setYear(datenow.toLocaleDateString('en-US', yearOptions));
    };

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

    const getEntries = async () => {
        try {
            const response = await axios.get(`https://nutrify-9dyi.onrender.com/entries/${user.uid}/${currentDate}`);
            setEntries(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`https://nutrify-9dyi.onrender.com/settings/${user.uid}`);
            if (response.data.length > 0) {
                const { carb_goal, protein_goal, fat_goal } = response.data[0];
                setSettings({ carb_goal, protein_goal, fat_goal });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const getCalories = async () => {
        try {
            const response = await axios.get(`https://nutrify-9dyi.onrender.com/total/${user.uid}`);
            const days = response.data.map(entry => new Date(entry.day).toLocaleDateString());
            const calories = response.data.map(entry => entry.total_calories);
            setCalorieChartData({
                labels: days,
                datasets: [{
                    data: calories,
                    borderColor: '#e66c28', 
                    tension: 0.4,
                    pointBackgroundColor: '#f28e59',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: false,
                    borderWidth: 2,
                    hoverBackgroundColor: '#f3d2af', 
                }]
            });
            
        } catch (err) {
            console.error(err);
        }
    };
    const getCurrentCals = async () => {
        try {
            const currentCals = await axios.get(`https://nutrify-9dyi.onrender.com/cals/${user.uid}`);
            const calorieGoal = await axios.get(`https://nutrify-9dyi.onrender.com/calgoal/${user.uid}`);

            const consumedCalories = parseInt(currentCals.data?.total_calories || 0);

            const goalCalories = calorieGoal.data[0]?.calorie_goal || 0;

            const remainingCalories = goalCalories - consumedCalories;

            setChartData({
                labels: ['Consumed Calories', 'Remaining Calories'],
                datasets: [
                    {
                        label: 'Calories',
                        data: [consumedCalories, remainingCalories],
                        backgroundColor: ['#f28e59', '#f0c9a0'],
                        hoverBackgroundColor: ['#f4d5b3', '#f3d2af'], 
                    }
                ]
            });
            
        } catch (err) {
            console.error(err);
        }
    };

    const doughnutChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '45%',
        plugins: {
            datalabels: {
                color: '#fff',
                font: { weight: 'normal', size: 13 },
                formatter: (value) => `${value}`,
            },
            legend: {
                position: 'top',
                labels: {
                    font: {
                        size: 12,
                    },
                },
            },
            title: {
                display: true,
                text: 'Calories for Today',
                font: {
                    size: 16,
                },
            },
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw} kcal`;
                    },
                },
            },
        },
        animation: {
            animateScale: true,
            animateRotate: true,
        },
        layout: {
            padding: {
                top: 10,
                left: 15,
                right: 15,
                bottom: 10,
            },
        },
    };


    const onSubmitEditData = async () => {
        const editNutritionData = {
            calories: putCals,
            protein: putProtein,
            carbs: putCarbs,
            fat: putFat,
        }

        try {
            const response = await axios.put(`https://nutrify-9dyi.onrender.com/edit-food/${user.uid}/${foodid}`, editNutritionData);
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = () => {
        if (parseFloat(putCals) < 0 || parseFloat(putProtein) < 0 || parseFloat(putCarbs) < 0 || parseFloat(putFat) < 0) {
            setErrorMessage('Values cannot be negative. Please enter valid values.');
        } else {
            setErrorMessage('');
            onSubmitEditData();
            getEntries();
            fetchSettings();
            getCalories();
            getCurrentCals();
        }
    };

    useEffect(() => {
        getDate();
        if (currentDate) {
            getEntries();
        }
    }, [currentDate]);

    useEffect(() => {
        getEntries();
    }, [])

    useEffect(() => {
        fetchSettings();
        getCalories();
        getCurrentCals();
    }, [entries])

    const macronutrientChartData = {
        labels: ["Carbs", "Protein", "Fat"],
        datasets: [
            {
                label: "Macro Goals",
                data: [settings.carb_goal, settings.protein_goal, settings.fat_goal],
                backgroundColor: ["#f28e59", "#e66c28", "#f0c9a0"], // Coral, Burnt Orange, Soft Peach
                hoverBackgroundColor: ["#f28e59", "#e66c28", "#f3d2af"] // Slightly lighter hover for Fat
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
                color: '#000',
                font: { weight: 'bold', size: 11 },
                formatter: (value) => `${value}`,
                align: 'top',
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => `${tooltipItem.raw} kcal`,
                },
            },
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Daily Calorie Intake',
                font: { size: 16, weight: 'bold', color: '#000' },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    color: '#ddd',
                    borderColor: '#ccc',
                    borderWidth: 1,
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                    color: '#000',
                },
            },
            y: {
                grid: {
                    color: '#ddd',
                    borderColor: '#ccc',
                    borderWidth: 1,
                },
                ticks: {
                    font: {
                        size: 12,
                    },
                    color: '#000',
                    beginAtZero: true,
                },
            },
        },
    };

    const deleteEntry = async (id) => {
        const deleteEntry = await axios.delete(`https://nutrify-9dyi.onrender.com/entries/${user.uid}/${id}`);
        setEntries(entries.filter(entry => entry.id !== id));
    }


    const handleEditClick = (entry) => {
        setIsModal(!isModal);
        setEditFoodName(entry)
    }
    return (
        <div className="wrap">
            <div className="main-container">
        
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
                                    <p className = "wt"> <span className = "serve" style={{ fontWeight: "normal", color: "black", textTransform: "none" }}>Serving:</span> {entry.servings} {entry.serving_type.split("1")[1]}
                                    </p>
                                    <div className="macros">
                                        <p className = "wt"><Protein /> {entry.protein}g</p>
                                        <p className = "wt"><Carbs /> {entry.carbs}g</p>
                                        <p className = "wt"><Fat /> {entry.fats}g</p>
                                    </div>
                                    <div className="buttons">
                                        <button onClick={() => { handleEditClick(entry.food_name), setPutCals(entry.calories), setPutProtein(entry.protein), setPutCarbs(entry.carbs), setPutFat(entry.fats), setFoodid(entry.id) }}
                                            className="edit-button"><Edit /></button>
                                        <button onClick={() => deleteEntry(entry.id)} className="delete-button"><Delete /></button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="grid-item grid-item3 shadow">
                    <Doughnut data={chartData} options={doughnutChartOptions} />
                </div>
            </div>
            {isModal ? (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block' }}
                    aria-labelledby="editFoodModalTitle"
                    aria-hidden="true"
                >
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editFoodModalTitle">
                                    Edit {editFoodName}
                                </h5>
                            </div>
                            <div className="modal-body">
                                <form
                                    className="customForm"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        onSubmitEditData(); // Trigger the submission logic
                                    }}
                                >
                                    {errorMessage && (
                                        <div className="alert alert-danger" role="alert">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div className="form-group">
                                        <label htmlFor="foodCalories">Calories (kcal) <Calories /></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="foodCalories"
                                            placeholder="Enter calories"
                                            defaultValue={putCals ? putCals : null}
                                            onChange={(e) => setPutCals(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="foodProtein">Protein (g) <Protein /></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="foodProtein"
                                            placeholder="Enter protein (g)"
                                            defaultValue={putProtein ? putProtein : null}
                                            onChange={(e) => setPutProtein(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="foodCarbs">Carbs (g) <Carbs /></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="foodCarbs"
                                            placeholder="Enter carbs (g)"
                                            defaultValue={putCarbs ? putCarbs : null}
                                            onChange={(e) => setPutCarbs(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="foodFat">Fat (g) <Fat /></label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="foodFat"
                                            placeholder="Enter fat (g)"
                                            defaultValue={putFat ? putFat : null}
                                            onChange={(e) => setPutFat(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="closeout"
                                    onClick={() => setIsModal(false)}
                                >
                                    Close
                                </button>
                                <button
                                    type="submit"
                                    className="save"
                                    onClick={(e) => {
                                        handleSubmit();
                                        setIsModal(!isModal)
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
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
