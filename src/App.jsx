import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import "../src/components/navbar.css";
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config();

import Navbar from "./components/navbar";
import Food from "./components/food";

const app_id = process.env.APP_ID;
const app_key = process.env.APP_KEY;
const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;

export const fetchAPI = async () => {
    try {
        const response = await axios.get(API_URL)
        return response.data;
    } catch (error) {
        console.error('Error fetching data', error);
        throw error;
    } 
};
function App() {
  const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await fetchAPI();
                setMessage(result);
            } catch (error) {
                console.error('Error fetching message', error);
            }
        };

        fetchData();
    }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/food" element={<Food />} />
      </Routes>
    </BrowserRouter>
  );
}

function Main() {
  return (
    <>
      <div className="cover">
        <div className = "nav-area">
          <Navbar />
        </div>
        <div className="container">
          <Cover />
        </div>
      </div>
    </>
  );
}

function Cover() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`cover fade-in ${isVisible ? "show" : ""}`}>
      <h1 className="fade-in">
        Welcome to SmartTracker{" "}
        <img src="./src/assets/food-dish-svgrepo-com.svg" alt="food dish" />
      </h1>
      <h2 className="fade-in">
        Your ultimate tool in the journey towards a healthier, happier you.
      </h2>
      <Link to="/get-started" className="btn fade-in">
        Get Started
      </Link>
      <Link to="/sign-in" className="btn fade-in">
        Sign In
      </Link>
    </div>
  );
}

export default App;
