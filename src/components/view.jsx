import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calories, Protein, Carbs, Fat } from "./food";
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
    const [foodName, setFoodName] = useState("");
    const [servings, setServings] = useState(0);
    const [servingSize, setServingSize] = useState(null);
    const [selectedServing, setSelectedServing] = useState("Serving Size");
    const [isDrop, setISDrop] = useState(false);
    const [cals, setCals] = useState(0);


    const [chartData, setChartData] = useState({
        labels: [], 
        datasets: [{
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB'],
            borderColor: ['#FF6384', '#36A2EB'],
            borderWidth: 1
        }]
    });

    const handleClick = () => {
        onSubmitNutritionData();
        setIsModal(false);
      };

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
            const response = await axios.get(`http://localhost:3000/entries/${user.uid}/${currentDate}`);
            setEntries(response.data);
        } catch (err) {
            console.error(err);
        }
    };

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
                    tension: 0.4, 
                    pointBackgroundColor: 'rgba(75,192,192,1)',
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    fill: false, 
                    borderWidth: 2, 
                    hoverBackgroundColor: 'rgba(75,192,192,0.6)',
                }]
            });
        } catch (err) {
            console.error(err);
        }
    };
    const getCurrentCals = async () => {
        try {
            const currentCals = await axios.get(`http://localhost:3000/cals/${user.uid}`);
            const calorieGoal = await axios.get(`http://localhost:3000/calgoal/${user.uid}`);

            const consumedCalories = parseInt(currentCals.data?.total_calories || 0);

            const goalCalories = calorieGoal.data[0]?.calorie_goal;

            const remainingCalories = goalCalories - consumedCalories;

            setChartData({
                labels: ['Consumed Calories', 'Remaining Calories'],
                datasets: [
                    {
                        label: 'Calories',
                        data: [consumedCalories, remainingCalories],
                        backgroundColor: ['#FF6347', '#00BFFF'], 
                        hoverBackgroundColor: ['#FF4500', '#1E90FF'],
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


    useEffect(() => {
        getDate();
        if (currentDate) {
            getEntries();
        }
    }, [currentDate]);

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
                color: '#000',
                font: { weight: 'bold', size: 11 },
                formatter: (value) => `${value} kcal`, 
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
        const deleteEntry = await axios.delete(`http://localhost:3000/entries/${user.uid}/${id}`);
        console.log(user.uid, " ", id)
        console.log(deleteEntry.data);
        setEntries(entries.filter(entry => entry.id !== id));
    }

    const handleSelect = (selectedServing) => {
        setSelectedServing(selectedServing);
      }


    const handleEditClick = (entry) => {
        setIsModal(!isModal);
        setEditFoodName(entry)
    }

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
                                    <p><span style={{ fontWeight: "normal", color: "black", textTransform: "none" }}>Serving:</span> {entry.servings} {entry.serving_type.split("1")[1]}
                                    </p>
                                    <div className="macros">
                                        <p><Protein /> {entry.protein}g</p>
                                        <p><Carbs /> {entry.carbs}g</p>
                                        <p><Fat /> {entry.fats}g</p>
                                    </div>
                                    <div className="buttons">
                                        <button onClick = {()=>handleEditClick(entry.food_name)}
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
          {isModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Food</h5>
                  <button type="button" className="btn-close" onClick={() => { setIsModal(false), setFoodName("") }} aria-label="Close"></button>
                </div>
                <div className="body-container">
                  <div className="bodyrow1">
                    <div className="modal-body">
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          onClick={() => setISDrop(!isDrop)}
                        >
                          {selectedServing}
                        </button>
                        {isDrop && (
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a className="dropdown-item" href="#" onClick={() => {
                              handleSelect('1 oz')

                              { results ? calcOunces() : null };
                            }}>1 oz</a></li>

                            <li><a className="dropdown-item" href="#" onClick={() => {
                              handleSelect('1 g')
                              { results ? calcGrams() : null };
                            }}>1 g</a></li>
                          </ul>
                        )}
                      </div>
                      <input type="number" className="form-control" placeholder="Number of Servings" onChange={(e) => {
                        setServings(e.target.value);
                        setServingSize(e.target.value)
                        setISDrop(false);
                      }}>
                      </input>
                    </div>
                  </div>
                  <div className="bodyrow2">
                    <div>
                      {cals && servings && selectedServing ? <Calories /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{total.toFixed(0)} Cal</span> : null}
                    </div>
                    <div>
                      {cals && servings && selectedServing ? <Protein /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{totalP.toFixed(0)}g Protein</span> : null}</div>
                    <div>
                      {cals && servings && selectedServing ? <Carbs /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{totalC.toFixed(0)}g Carbs</span> : null}
                    </div>
                    <div>
                      {cals && servings && selectedServing ? <Fat /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{totalF.toFixed(0)}g Fat</span> : null}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => { setIsModal(false); setFoodName(""); }}>Close</button>
                  <button
                    type="submit"
                    className="btn btn-success log-btn"
                    onClick={() => {
                      if (servings && selectedServing !== "Serving Size") {
                        handleClick();
                      } else {
                        alert("Please select a serving and serving size");
                      }
                    }}
                  >
                    Log Food
                  </button>
                </div>
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
