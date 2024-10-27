import React, { useState, useContext } from "react";
import "./food-info.css";
import Navbar from "./navbar";
import { ApiContext } from "./food";

export function Foodinfo() {
  const info = useContext(ApiContext);
  var image_url = "";
  if (info) {
    image_url = info.image;
  }

  if (info) {
    console.log("data", info);
  } else {
    console.log("data is null or undefined");
  }

  return (
  <div className = "super-container">
      <div className="container">
        <div className="child  overflow-auto">
          <h1 style={{ color: "black", marginTop: "50px" }}>
            {info ? info.label : null}
          </h1>
            <div className="nutrient-container">
              <div style={{ color: "green", fontWeight: "bold" }}>
                Calories: {info.nutrients.ENERC_KCAL.toFixed(0)}
              </div>
              <div style={{ color: "red" }}>
                Protein: {info.nutrients.PROCNT.toFixed(0)}
              </div>
              <div style={{ color: "blue" }}>
                Carbohydrates: {info.nutrients.CHOCDF.toFixed(0)}
              </div>
              <div style={{ color: "orange" }}>Fat: {info.nutrients.FAT.toFixed(0)}</div>
            </div>
          </div>
        </div>
        </div>
  );
}
export default Foodinfo;
