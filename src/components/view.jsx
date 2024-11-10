import React, { useState, useEffect } from "react";
import axios from "axios";
import { Protein, Carbs, Fat } from "./food";
import { Link } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    CategoryScale,
    LinearScale,
  } from 'chart.js';
import "./view.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

function Dashboard({ user }) {

    const [entries, setEntries] = useState([]);
    const [currentDate, setCurrentDate] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
    const [year, setYear] = useState("");

    const getEntries = async () => {
        try {
            console.log(currentDate);
            const response = await axios.get(`http://localhost:3000/entries/${user.uid}/${currentDate}`);
            const jsonData = response.data;

            setEntries(jsonData);
        } catch (err) {
            console.error(err);
        }

    };

  
    const getDate = () => {
        let datenow = new Date();

        setCurrentDate(generateDatabaseDateTime(datenow));

        const options = {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
        };
        setFormattedDate(datenow.toLocaleDateString('en-US', options));

        const year = {
            year: 'numeric',
        };
        setYear(datenow.toLocaleDateString('en-US', year))

        function generateDatabaseDateTime(date) {
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
        }
    }

    const fetchSettings = async() => {
        try{
            const response = await axios.get(`http://localhost:3000/settings/${user.uid}`);
            console.log(response.data);
        }
        catch(err) {
            console.error(err);
        }
        
    }

    useEffect(() => {
        getDate();
        if (currentDate) {
            getEntries();
        }
        fetchSettings();
    }, [currentDate, formattedDate])

    return (
        <div className="wrap">
            <div className="main-container">
                <div className="grid-item grid-item-header">
                    {user && <h1>Welcome, {user.email}</h1>}
                    <Link className="nav-link" to="/">
                        <button className="home-btn">Home</button>
                    </Link>
                </div>
                <div className="grid-item grid-item-main shadow"></div>
                <div className="grid-item grid-item2 shadow">
                    <h3 className="date">{formattedDate}</h3>
                    <h1 className="year">{year}</h1>
                </div>
                <div className="grid-item grid-item3 shadow">
                    
                </div>
                <div className="grid-item grid-item4 shadow">
                    {entries.length === 0 ? (
                        <p className="none">No entries found.</p>
                    ) : (
                        <ul className="entry-list">
                            {entries.map((entry) => (
                                <li key={entry.id} style={{ display: "block" }} className="entry-item">
                                    <h5>{entry.food_name}</h5>
                                    <p><span style={{ fontWeight: "normal", color: "black", textTransform: "none" }}>Servings:</span> {entry.servings}</p>
                                    <div className="macros">
                                        <p><Protein /> {entry.protein}g</p>
                                        <p><Carbs /> {entry.carbs}g</p>
                                        <p><Fat /> {entry.fats}g</p>
                                    </div>
                                    <div className="buttons">
                                        <button class="edit-button"><Edit /></button>
                                        <button class="delete-button"><Delete /></button>
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
}

function Edit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-pencil" viewBox="0 0 16 16">
            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
        </svg>
    )
}

function Delete() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
        </svg>
    )
}

export default Dashboard;