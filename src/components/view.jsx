import React, { useState, useEffect } from "react";
import axios from "axios";
import { Protein, Carbs, Fat, Calories } from "./food";
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
import "./index.css";

// Fix the URL - should use template literal
const url = import.meta.env.VITE_RENDER_URL;

ChartJS.register(
    Title, Tooltip, Legend, ArcElement, CategoryScale,
    LinearScale, PointElement, LineElement, ChartDataLabels
);

const Dashboard = ({ user }) => {
    const [entries, setEntries] = useState([]); // Initialize as empty array
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
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            // Derive current date in UTC
            const now = new Date();
            const currentDate = now.toLocaleDateString('en-CA');
    
            // Log the timezone and derived date
            console.log("Timezone Offset (minutes):", now.getTimezoneOffset());
            console.log("Locale Timezone String:", Intl.DateTimeFormat().resolvedOptions().timeZone);
            console.log("Formatted Current Date (UTC):", currentDate);
    
            // Make the API call
            const response = await axios.get(`${url}/entries/${user.uid}/${currentDate}`);
            
            // Handle new API response format
            const entriesData = response.data.data || response.data || [];
            setEntries(Array.isArray(entriesData) ? entriesData : []);
            console.log("Entries:", entriesData);
        } catch (err) {
            console.error("Error fetching entries:", err);
            setEntries([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchSettings = async () => {
        try {
            const response = await axios.get(`${url}/settings/${user.uid}`);
            
            // Handle new API response format
            const settingsData = response.data.data || response.data;
            
            if (settingsData && (Array.isArray(settingsData) ? settingsData.length > 0 : settingsData)) {
                const settings = Array.isArray(settingsData) ? settingsData[0] : settingsData;
                const { carb_goal, protein_goal, fat_goal } = settings;
                setSettings({ carb_goal, protein_goal, fat_goal });
            }
        } catch (err) {
            console.error("Error fetching settings:", err);
        }
    };

    const getCalories = async () => {
        try {
          const response = await axios.get(`${url}/total/${user.uid}`);
          const caloriesData = response.data.data || response.data || [];
      
          // ✅ Safely format as MM/DD/YYYY
          const days = caloriesData.map(entry => {
            const datePart = entry.day.split('T')[0]; // Get "YYYY-MM-DD"
            const [year, month, day] = datePart.split('-');
            return `${month}/${day}/${year}`;
          });
      
          const calories = caloriesData.map(entry => entry.total_calories);
      
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
          console.error("Error fetching calories:", err);
        }
      };
      
      

    const getCurrentCals = async () => {
        try {
            const currentCals = await axios.get(`${url}/cals/${user.uid}`);
            const calorieGoal = await axios.get(`${url}/calgoal/${user.uid}`);

            // Handle new API response format
            const currentCalsData = currentCals.data.data || currentCals.data;
            const calorieGoalData = calorieGoal.data.data || calorieGoal.data;

            const consumedCalories = parseInt(currentCalsData?.total_calories || 0);
            const goalCalories = (Array.isArray(calorieGoalData) ? calorieGoalData[0] : calorieGoalData)?.calorie_goal || 0;

            const remainingCalories = Math.max(0, goalCalories - consumedCalories);

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
            console.error("Error fetching current calories:", err);
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
            calories: parseFloat(putCals),
            protein: parseFloat(putProtein),
            carbs: parseFloat(putCarbs),
            fat: parseFloat(putFat),
        }

        try {
            const response = await axios.put(`${url}/edit-food/${user.uid}/${foodid}`, editNutritionData);
            console.log("Edit response:", response.data);
            
            // Refresh data after successful edit
            await Promise.all([
                getEntries(),
                fetchSettings(),
                getCalories(),
                getCurrentCals()
            ]);
            
            setIsModal(false);
            setErrorMessage('');
        } catch (error) {
            console.error("Error editing food:", error);
            setErrorMessage('Failed to update food entry. Please try again.');
        }
    }

    const handleSubmit = () => {
        if (parseFloat(putCals) < 0 || parseFloat(putProtein) < 0 || parseFloat(putCarbs) < 0 || parseFloat(putFat) < 0) {
            setErrorMessage('Values cannot be negative. Please enter valid values.');
        } else {
            setErrorMessage('');
            onSubmitEditData();
        }
    };

    useEffect(() => {
        getDate();
    }, []);

    useEffect(() => {
        if (currentDate && user) {
            getEntries();
        }
    }, [currentDate, user]);

    useEffect(() => {
        if (user) {
            fetchSettings();
            getCalories();
            getCurrentCals();
        }
    }, [entries, user]);

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
        try {
            const response = await axios.delete(`${url}/entries/${user.uid}/${id}`);
            console.log("Delete response:", response.data);
            
            // Update state immediately for better UX
            setEntries(entries.filter(entry => entry.id !== id));
            
            // Refresh charts after deletion
            setTimeout(() => {
                getCurrentCals();
                getCalories();
            }, 100);
        } catch (error) {
            console.error("Error deleting entry:", error);
            alert("Failed to delete entry. Please try again.");
        }
    }

    const handleEditClick = (entry) => {
        setIsModal(!isModal);
        setEditFoodName(entry);
    }

    // Show loading state
    if (loading && entries.length === 0) {
        return (
            <div className="wrap">
                <div className="main-container">
                    <div className="loading">Loading dashboard...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="wrap">
            <div className="w-screen h-[88vh] grid grid-cols-3 grid-rows-2 gap-2.5 p-8 overflow-y-auto relative max-[1200px]:pt-24 max-[1200px]:h-screen max-[768px]:pt-24 max-[768px]:overflow-y-auto max-[768px]:p-5 max-[768px]:flex max-[768px]:flex-col max-[768px]:h-screen max-[400px]:p-1.5 max-[400px]:overflow-y-auto max-[400px]:p-5">
        
                <div className="col-span-2 p-1.5 rounded-lg bg-white overflow-y-auto shadow-lg max-[768px]:min-h-[300px]">
                    <Line data={calorieChartData} options={calorieChartOptions} />
                </div>
                <div className="p-1.5 rounded-lg bg-white overflow-y-auto flex flex-col items-center justify-center gap-5 shadow-lg max-[768px]:min-h-[300px] max-[400px]:min-h-[100px] max-[400px]:flex-col-reverse max-[400px]:items-end">
                    <h3 className="text-[22px] text-gray-600 capitalize m-0 p-0">{formattedDate}</h3>
                    <h1 className="text-[80px] font-bold text-gray-800 uppercase m-0 p-2.5 tracking-wider hover:text-blue-500 max-[768px]:text-[40px]">{year}</h1>
                </div>
                <div className="rounded-lg bg-white overflow-y-auto shadow-lg max-[768px]:min-h-[300px]">
                    <Pie data={macronutrientChartData} options={macronutrientChartOptions} />
                </div>
                <div className="p-2.5 overflow-y-auto rounded-lg bg-white shadow-lg max-[768px]:min-h-[300px]">
                    {loading ? (
                        <p className="mt-6 text-2xl">Loading entries...</p>
                    ) : entries.length === 0 ? (
                        <p className="mt-6 text-2xl">No entries found.</p>
                    ) : (
                        <ul className="flex flex-col w-full items-center p-0">
                            {entries.map((entry) => (
                                <li key={entry.id} className="bg-[#fbe1c9] mb-5 rounded-2xl w-4/5 p-5 shadow-lg transition-all duration-200 border border-[#e6c8a7] min-w-[200px] text-white hover:transform hover:-translate-y-1 hover:shadow-2xl max-[768px]:w-[85%]">
                                    <h5 className="text-white">{entry.food_name}</h5>
                                    <p className="text-white"> 
                                        <span className="text-white font-normal text-black normal-case">
                                            Serving:
                                        </span> {entry.servings} {entry.serving_type?.split("1")[1] || entry.serving_type}
                                    </p>
                                    <div className="flex justify-evenly m-0">
                                        <p className="text-white"><Protein /> {entry.protein}g</p>
                                        <p className="text-white"><Carbs /> {entry.carbs}g</p>
                                        <p className="text-white"><Fat /> {entry.fats}g</p>
                                    </div>
                                    <div className="flex justify-evenly m-0">
                                        <button 
                                            onClick={() => { 
                                                handleEditClick(entry.food_name);
                                                setPutCals(entry.calories);
                                                setPutProtein(entry.protein);
                                                setPutCarbs(entry.carbs);
                                                setPutFat(entry.fats);
                                                setFoodid(entry.id);
                                            }}
                                            className="font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] text-base py-2.5 px-5 border-none rounded-lg cursor-pointer transition-all duration-300 shadow-md outline-none bg-[#f28e59] text-white hover:bg-[#e66c28] hover:transform hover:-translate-y-0.5"
                                        >
                                            <Edit />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (window.confirm('Are you sure you want to delete this entry?')) {
                                                    deleteEntry(entry.id);
                                                }
                                            }} 
                                            className="font-['Segoe_UI',_Tahoma,_Geneva,_Verdana,_sans-serif] text-base py-2.5 px-5 border-none rounded-lg cursor-pointer transition-all duration-300 shadow-md outline-none bg-[#e66c28] text-white hover:bg-[#b9481e] hover:transform hover:-translate-y-1"
                                        >
                                            <Delete />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="rounded-lg bg-white overflow-y-auto shadow-lg max-[768px]:min-h-[300px]">
                    <Doughnut data={chartData} options={doughnutChartOptions} />
                </div>
            </div>
            {isModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 max-[1200px]:mt-24"
                    tabIndex="-1"
                    role="dialog"
                    style={{ display: 'block' }}
                    aria-labelledby="editFoodModalTitle"
                    aria-hidden="true"
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4" role="document">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h5 className="text-lg font-semibold text-black" id="editFoodModalTitle">
                                Edit {editFoodName}
                            </h5>
                        </div>
                        <div className="p-6">
                            <div className="customForm">
                                {errorMessage && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="mb-4">
                                    <label htmlFor="foodCalories" className="block text-sm font-medium text-black mb-2">Calories (kcal) <Calories /></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="foodCalories"
                                        placeholder="Enter calories"
                                        value={putCals}
                                        onChange={(e) => setPutCals(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="foodProtein" className="block text-sm font-medium text-black mb-2">Protein (g) <Protein /></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="foodProtein"
                                        placeholder="Enter protein (g)"
                                        value={putProtein}
                                        onChange={(e) => setPutProtein(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="foodCarbs" className="block text-sm font-medium text-black mb-2">Carbs (g) <Carbs /></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="foodCarbs"
                                        placeholder="Enter carbs (g)"
                                        value={putCarbs}
                                        onChange={(e) => setPutCarbs(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="foodFat" className="block text-sm font-medium text-black mb-2">Fat (g) <Fat /></label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        id="foodFat"
                                        placeholder="Enter fat (g)"
                                        value={putFat}
                                        onChange={(e) => setPutFat(e.target.value)}
                                        required
                                        min="0"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="bg-gray-500 border-none text-white text-base font-bold py-3 px-5 rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:bg-gray-600 hover:transform hover:-translate-y-0.5"
                                onClick={() => {
                                    setIsModal(false);
                                    setErrorMessage('');
                                }}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className="bg-[#f28e59] border-none text-white text-base font-bold py-3 px-5 rounded-lg cursor-pointer shadow-md transition-all duration-300 hover:bg-[#e66c28] hover:transform hover:-translate-y-0.5 active:bg-[#cc5a1d] active:transform active:translate-y-0 active:shadow-sm"
                                onClick={handleSubmit}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
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