import React, { useState } from "react";
import "./food.css";
import Navbar from "./navbar";
import axios from "axios";

export const app_key = '4f6ba1ac291cb9d9f5fced4ea3378e3b';
export const app_id = '2553f5e4';
export const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;

function Food() {
  
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);

  const submitForm = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.get(API_URL, {
        params: {
          query: search,
        }
      });
      const data = response.data;
      setResults(data.hints || []);
    } catch (err) {
      console.error(err.message);
    }
  }

  return (
    <>
      <Navbar />
      <div className="food-container">
        <div className="main">
          <div className="search-container">
            <h3>Search a food to log</h3>
            <form onSubmit ={submitForm}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              ></input>
              <button type="submit" className="search">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  className="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </form>
            <div className="results">
              {results.map((result, index) => (
                <div key={index} className="result-item">
                  <div className="parent-food-block">
                    <div className="food-block">
                      <p className="food-item">{result.food.label}: {result.food.nutrients.ENERC_KCAL} cal</p>
                    </div>
                    <button className="add-button">+</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Food;
