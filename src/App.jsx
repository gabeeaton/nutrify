// App.js

import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  return (
    <>
      <div className="cover">
        <div style={{ background: "white" }}>
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

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <div className={`cover fade-in ${isVisible ? 'show' : ''}`}>
      <h1 className="fade-in">Welcome to SmartTracker <img src="./src/assets/food-dish-svgrepo-com.svg" alt="food dish" /></h1>
      <h2 className="fade-in">Your ultimate tool in the journey towards a healthier, happier you.</h2>
      <a href="/get-started" className="btn fade-in" onClick={handleClick}>Get Started</a>
      <a href="/sign-in" className="btn fade-in"onClick={handleClick}>Sign In</a>
    </div>
  );
}

function Navbar() {
  return (
    <ul className="nav justify-content-center">
      <li className="nav-item">
        <a className="nav-link" aria-current="page" href="/">
          Home
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/food">
          Log Food
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/view">
          View Entries
        </a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/settings">
          Settings
        </a>
      </li>
    </ul>
  );
}

export default App;
