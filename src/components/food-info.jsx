import React, { useContext } from "react";
import "./food-info.css";
import { ApiContext } from "./food";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; 
import { Protein, Carbs, Fat, Calories } from "./food";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function Foodinfo() {
  const info = useContext(ApiContext);

  const image_url = info ? info.image : "";
  const label = info ? info.label : "No food information available";
  const calories = info && info.nutrients ? info.nutrients.ENERC_KCAL.toFixed(0) : "N/A";
  const protein = info && info.nutrients ? info.nutrients.PROCNT.toFixed(0) : "N/A";
  const carbohydrates = info && info.nutrients ? info.nutrients.CHOCDF.toFixed(0) : "N/A";
  const fat = info && info.nutrients ? info.nutrients.FAT.toFixed(0) : "N/A";

  const data = {
    labels: ['Fat', 'Carbs', 'Protein'],
    datasets: [
      {
        data: [fat, carbohydrates, protein],
        backgroundColor: ['#f3d2af', '#ff9e4a', '#e66c28'], // Light beige, orange, dark orange
        hoverBackgroundColor: ['#f0c9a0', '#ff7c29', '#d75f1d'], // Lighter beige, lighter orange, darkened orange
        borderWidth: 1,
      }
    ]
  };
  
  return (
    <>
      <div className="super-container">
        <div className="child-container">
          <div className="top">
            {image_url && <img src={image_url} alt={label} />} <h3>{label}</h3>
          </div>
          <hr />
          <div className="bottom">
            <div className="left">
              <div className="donut">
                <Doughnut
                  data={data}
                  options={{
                    responsive: true,  // Ensures the chart is responsive
                    maintainAspectRatio: false,  
                    plugins: {
                      tooltip: {
                        enabled: false // Disable tooltip
                      },
                      legend: {
                        position: 'top', // Position the legend at the top
                        labels: {
                          usePointStyle: true, // Use circular points for the legend
                          boxWidth: 15, // Set the size of the legend circles
                          padding: 20, // Adjust space between legend items
                        }
                      },
                      datalabels: {
                        display: false,
                      }
                    },
                    cutout: '50%' // Makes it a donut chart
                  }}
                />
              </div>
            </div>
            
            <div className="right">
            <div className="nutrition-card">
                  <h3>Calories</h3>
                  <p>{calories} cal</p>
                </div>
              <div className="nutrition-container">
                <div className="nutrition-card">
                  <h3>Carbs</h3>
                  <p>{carbohydrates} g</p>
                </div>
                <div className="nutrition-card">
                  <h3>Fat</h3>
                  <p>{fat} g</p>
                </div>
                <div className="nutrition-card">
                  <h3>Protein</h3>
                  <p>{protein} g</p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Foodinfo;
