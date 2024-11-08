import React, { useContext } from "react";
import "./food-info.css";
import Navbar from "./navbar";
import { ApiContext } from "./food";

export function Foodinfo() {
  const info = useContext(ApiContext);

  const image_url = info ? info.image : "";
  const label = info ? info.label : "No food information available";
  const calories = info && info.nutrients ? info.nutrients.ENERC_KCAL.toFixed(0) : "N/A";
  const protein = info && info.nutrients ? info.nutrients.PROCNT.toFixed(0) : "N/A";
  const carbohydrates = info && info.nutrients ? info.nutrients.CHOCDF.toFixed(0) : "N/A";
  const fat = info && info.nutrients ? info.nutrients.FAT.toFixed(0) : "N/A";

  return (
    <div className="super-container">
      <div className="container">
        <div className="child overflow-auto">
          <h1 style={{ color: "black", marginTop: "50px" }}>
            {label}
          </h1>
          {image_url && <img src={image_url} alt={label} />}
          <div className="nutrient-container">
            <div style={{ color: "green", fontWeight: "bold" }}>
              Calories: {calories} cal
            </div>
            <div style={{ color: "red" }}>
              Protein: {protein} g
            </div>
            <div style={{ color: "blue" }}>
              Carbohydrates: {carbohydrates} g
            </div>
            <div style={{ color: "orange" }}>
              Fat: {fat} g
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Foodinfo;
