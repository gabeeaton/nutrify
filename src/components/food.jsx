import React, { useState } from "react";
import "./food.css";
import Navbar from "./navbar";

function Food() {
  const [search, setSearch] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(`The search you entered was: ${search}`);
  };

  return (
    <>
      <Navbar />
      <div className="food-container">
        <div className="main">
          <div className="search-container">
            <h3>Search a food to log</h3>
            <form onSubmit={handleSubmit}>
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
                  class="bi bi-search"
                  viewBox="0 0 16 16"
                >
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Food;
