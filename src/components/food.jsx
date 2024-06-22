import React from "react";
import "./food.css";
import Navbar from "./navbar";

function Food() {
  return (
    <>
      <Navbar />
      <div class="food-container">
        <div className="main">
          <div class = "search-container"><h3>Search a food to log</h3><input type="text"></input></div>
        </div>
      </div>
    </>
  );
}

export default Food;
