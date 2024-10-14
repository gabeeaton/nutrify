import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchAPI } from "./api.js";
import { Foodinfo } from "./components/food-info"
import { ApiContext } from "./components/food";

import Navbar from "./components/navbar";
import Food from "./components/food";
import Dashboard from "./components/view.jsx";
import SignUp from "./components/sign_up.jsx";
import Login from "./components/login.jsx";

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
          <Route path="/view" element={<Dashboard />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </ApiContext.Provider>
    </BrowserRouter>
  );
}

function Main() {
  return (
    <>

      <div className="nav-area">
        <Navbar />
      </div>
      <div className="container">
        <Cover />
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
    <>
      <div class="coverTitle">
        <h1 className="fade-in">
          Nutrify{" "}
          <img src="./src/assets/food-dish-svgrepo-com.svg" alt="food dish" />
        </h1>
        <h2 className="fade-in">
          Your ultimate tool in the journey towards a healthier, happier you.
        </h2>
      </div>
    </>

  );
}

export default App;