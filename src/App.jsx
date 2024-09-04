import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import "../src/components/navbar.css";
import { fetchAPI } from "./api.js";
import {Foodinfo }from "./components/food-info"
import { ApiContext } from "./components/food";
import {Login} from "./components/login.jsx"
import { SignIn } from "./components/sign_in.jsx";

import Navbar from "./components/navbar";
import Food from "./components/food";

function App() {
  const [message, setMessage] = useState('');
  const [selection, setSelection] = useState(null);

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
      <ApiContext.Provider value={selection}>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/food" element={<Food setSelection={setSelection} />} />
          <Route path="/food-info" element={<Foodinfo />} />
          <Route path = "/login" element={<Login />} />
          <Route path = "/sign-up" element={<SignIn />} />
        </Routes>
      </ApiContext.Provider>
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
        Welcome to Nutrify{" "}
        <img src="./src/assets/food-dish-svgrepo-com.svg" alt="food dish" />
      </h1>
      <h2 className="fade-in">
        Your ultimate tool in the journey towards a healthier, happier you.
      </h2>
      <Link to="/sign-up" className="btn fade-in but">
        Get Started
      </Link>
      <Link to="/login" className="btn fade-in but">
      Sign In
      </Link>
    </div>
  );
}

export default App;
