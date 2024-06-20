import React from "react";
import "./App.css";

function App() {
  return (
    <>
    <div className = 'cover'>
      <div style = {{background: 'white'}}><Navbar /></div>
      <div class = "container"><Cover /></div>
    </div>
    </>
  );
}

function Cover () {
  return (
    <div class="cover">
  <h1>Welcome to SmartTracker <img src = "./src/assets/food-dish-svgrepo-com.svg"></img></h1>
  <h2>Your ultimate tool in the journey towards a healthier, happier you.</h2>
  <button type = "button" class="btn">Get Started</button>
  <button type = "button" class="btn">Sign In</button>
  </div>
  )
}

function Navbar() {
  return (
    <ul className="nav justify-content-center">
    <li className="nav-item">
      <a className="nav-link" aria-current="page" href="/">Home</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#">Log Food</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#">View Entries</a>
    </li>
    <li className="nav-item">
      <a className="nav-link" href="#">Settings</a>
    </li>
  </ul>
  );
}

export default App;
