import React, { useState, createContext, useEffect } from "react";
import "./food.css";
import axios from "axios";

import { Link } from "react-router-dom";

export const app_key = import.meta.env.VITE_APP_KEY;
export const app_id = import.meta.env.VITE_APP_ID
export const API_URL = `https://api.edamam.com/api/food-database/v2/parser?app_id=${app_id}&app_key=${app_key}`;

export const ApiContext = createContext(null);

function Food({ setSelection, user }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [isModal, setIsModal] = useState(false);
  const [selectedServing, setSelectedServing] = useState("Serving Size");
  const [isDrop, setISDrop] = useState(false);
  const [isDrop2, setIsDrop2] = useState(false);
  const [index, setIndex] = useState("");
  const [servings, setServings] = useState(0);
  const [weight, setWeight] = useState(0);
  const [totalP, setTotalP] = useState(0);
  const [totalC, setTotalC] = useState(0);
  const [totalF, setTotalF] = useState(0);
  const [cals, setCals] = useState(0);
  const [type, setType] = useState("");
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fat, setFat] = useState(0);
  const [total, setTotal] = useState(0);
  const [customName, setCustomName] = useState("");
  const [customCalories, setCustomCalories] = useState("");
  const [customProtein, setCustomProtein] = useState("");
  const [customCarbs, setCustomCarbs] = useState("");
  const [customFat, setCustomFat] = useState("");
  const [foodName, setFoodName] = useState("");
  const [servingSize, setServingSize] = useState(null);
  const [servingType, setServingType] = useState("");



  function calcSingleServingNutrition(cals, weight, servings, type, protein, carbs, fat) {
    var caloriesPerWeight = 0;
    var proteinPerWeight = 0;
    var carbsPerWeight = 0;
    var fatPerWeight = 0;
    var totalCalories = 0;
    var totalProtein = 0;
    var totalCarbs = 0;
    var totalFat = 0;

    if (type === "oz") {
      caloriesPerWeight = cals / weight;
      totalCalories = caloriesPerWeight * servings;

      proteinPerWeight = protein / weight;
      totalProtein = proteinPerWeight * servings;

      carbsPerWeight = carbs / weight;
      totalCarbs = carbsPerWeight * servings;

      fatPerWeight = fat / weight;
      totalFat = fatPerWeight * servings;
    }
    else if (type === "g") {
      caloriesPerWeight = (cals / 28.35) / (weight / 28.35);
      totalCalories = caloriesPerWeight * servings;

      proteinPerWeight = (protein / 28.35) / (weight / 28.35);
      totalProtein = proteinPerWeight * servings;

      carbsPerWeight = (carbs / 28.35) / (weight / 28.35);
      totalCarbs = carbsPerWeight * servings;

      fatPerWeight = (fat / 28.35) / (weight / 28.35);
      totalFat = fatPerWeight * servings;
    }

    setTotal(totalCalories);
    setTotalP(totalProtein);
    setTotalC(totalCarbs);
    setTotalF(totalFat);
  }

  const handleClick = () => {
    setIsModal(false);
    onSubmitNutritionData();
  };


  const validateInputs = () => {
    if (!customName || !customCalories || !customProtein || !customCarbs || !customFat) {
      alert("Please fill in all fields.");
      return false;
    }

    if (
      isNaN(customCalories) || customCalories < 0 ||
      isNaN(customProtein) || customProtein < 0 ||
      isNaN(customCarbs) || customCarbs < 0 ||
      isNaN(customFat) || customFat < 0
    ) {
      alert("Please enter valid positive numbers for calories, protein, carbs, and fat.");
      return false;
    }

    return true;
  };


  const onSubmitNutritionData = async () => {
    const nutritionData = {
      name: foodName,
      calories: total.toFixed(0),
      protein: totalP.toFixed(0),
      carbs: totalC.toFixed(0),
      fat: totalF.toFixed(0),
      servingType: servingType,
      serving_size: servingSize,
      user: user.uid,
      email: user.email
    };

    try {
      const response = await axios.post("https://nutrify-9dyi.onrender.com/log-food", nutritionData);
    }
    catch (error) {
      console.error("error", error);
    }
  }

  const onSubmitCustomNutritionData = async () => {
    const customNutritionData = {
      name: customName,
      calories: customCalories,
      protein: customProtein,
      carbs: customCarbs,
      fat: customFat,
      servingType: 'custom',
      serving_size: 1,
      user: user.uid,
      email: user.email
    }

    try {
     const response = await axios.post("https://nutrify-9dyi.onrender.com/log-food", customNutritionData);
    } catch (error) {
      console.error(error);
    }
  }

  const handleSelect = (selectedServing) => {
    setSelectedServing(selectedServing);
  }

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(API_URL, {
        params: {
          ingr: search,
        },
      });
      const data = response.data;
      setResults(data.hints);
    } catch (err) {
      console.error(err.message);
    }
  };

  function calcGrams() {
    setWeight(results[index].measures[0].weight.toFixed(0))
    setCals(results[index].food.nutrients.ENERC_KCAL.toFixed(0))
    setProtein(results[index].food.nutrients.PROCNT.toFixed(0))
    setCarbs(results[index].food.nutrients.CHOCDF.toFixed(0))
    setFat(results[index].food.nutrients.FAT.toFixed(0))
    setType('g')
    calcSingleServingNutrition(results[index].food.nutrients.ENERC_KCAL.toFixed(0), results[index].measures[0].weight.toFixed(0), servings, type, results[index].food.nutrients.PROCNT.toFixed(0), results[index].food.nutrients.CHOCDF.toFixed(0), results[index].food.nutrients.FAT.toFixed(0))
    setServingType("1g")
  }

  function calcOunces() {
    setWeight(convertGrams(results[index].measures[0].weight.toFixed(0)))
    setCals(results[index].food.nutrients.ENERC_KCAL.toFixed(0))
    setProtein(results[index].food.nutrients.PROCNT.toFixed(0))
    setCarbs(results[index].food.nutrients.CHOCDF.toFixed(0))
    setFat(results[index].food.nutrients.FAT.toFixed(0))
    setType("oz")
    calcSingleServingNutrition(results[index].food.nutrients.ENERC_KCAL.toFixed(0), results[index].measures[0].weight.toFixed(0), servings, type, results[index].food.nutrients.PROCNT.toFixed(0), results[index].food.nutrients.CHOCDF.toFixed(0), results[index].food.nutrients.FAT.toFixed(0))
    setServingType("1oz")
  }

  function convertGrams(grams) {
    const oz = (grams / 28).toFixed(1);
    return oz;
  }

  function handleInfoClick(food) {
    setSelection(food);
  }

  function handleIndex(index) {
    setIndex(index);
  }


  useEffect(() => {
    calcSingleServingNutrition(cals, weight, servings, type, protein, carbs, fat);
  }, [cals, weight, servings, type, protein, carbs, fat])


  return (
    <>
      <div className="search-container">
        <div className="group">
    
          <form
            onSubmit={submitForm}>
            <input
              placeholder="Log your food"
              type="search"
              className="input"
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </form>
          <button
            className="custom-food-button"
            data-toggle="modal"
            data-target="#exampleModal"
            onClick={() => setIsDrop2(!isDrop2)}>
            Custom
            <svg
              xmlns="http://www.w3.org/200"
              height="15"
              fill="currentColor"
              className="bi bi-plus-lg cust"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                stroke="white"
                strokeWidth="1.05"
                d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
              />
            </svg>
          </button>
        </div>
      </div>
      <div></div>
      <div className="parent-container">
        {results ? null : <p>No search results found</p>}
        <div className="results">
          {results.map((result, index) => (
            <div key={index} className="result-item">
              <div className="parent-food-block">
                <div className="food-block">
                  <div>
                    <div className="food-item">
                      <div className="food-name">
                        {result.food.label}: {result.food.nutrients.ENERC_KCAL.toFixed(0)} cal per
                        100g{" "}
                        (3.5 oz)
                      </div>
                      <div className="buttons">
                        <button className="add-button" onClick={() => {
                          setIsModal(true);
                          handleInfoClick(result.food);
                          handleIndex(index);
                          setSelectedServing("Serving Size");
                          setFoodName(result.food.label);
                        }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="21"
                            height="21"
                            fill="currentColor"
                            className="bi bi-plus-lg"
                            viewBox="0 0 16 16"
                          >
                            <path
                              fillRule="evenodd"
                              stroke="white"
                              strokeWidth="1.05"
                              d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                            />
                          </svg>
                        </button>
                        <Link to="/food-info" info={result.food}>
                          <button className="info-button" onClick={() => handleInfoClick(result.food)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="21"
                              height="21"
                              fill="darkgray"
                              className="bi bi-info-lg"
                              viewBox="0 0 16 16"
                            >
                              <path d="m9.708 6.075-3.024.379-.108.502.595.108c.387.093.464.232.38.619l-.975 4.577c-.255 1.183.14 1.74 1.067 1.74.72 0 1.554-.332 1.933-.789l.116-.549c-.263.232-.65.325-.905.325-.363 0-.494-.255-.402-.704zm.091-2.755a1.32 1.32 0 1 1-2.64 0 1.32 1.32 0 0 1 2.64 0" />
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isDrop2 && (
          <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Custom Food</h5>
                </div>
                <div className="modal-body">
                  <form className="customForm">
                    <div className="form-group">
                      <input
                        value={customName}
                        type="text"
                        className="cust-form"
                        id="foodName"
                        placeholder="Enter food name"
                        onChange={(e) => setCustomName(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        value={customCalories}
                        type="number"
                        className="cust-form"
                        id="foodCalories"
                        placeholder="Enter calories"
                        onChange={(e) => setCustomCalories(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        value={customProtein}
                        type="number"
                        className="cust-form"
                        id="foodProtein"
                        placeholder="Enter protein (g)"
                        onChange={(e) => setCustomProtein(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        value={customCarbs}
                        type="number"
                        className="cust-form"
                        id="foodCarbs"
                        placeholder="Enter carbs (g)"
                        onChange={(e) => setCustomCarbs(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <input
                        value={customFat}
                        type="number"
                        className="cust-form"
                        id="foodFat"
                        placeholder="Enter fat (g)"
                        onChange={(e) => setCustomFat(e.target.value)}
                      />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="closeout"
                    onClick={() => { setIsDrop2(false), setFoodName("") }}>
                    Close
                  </button>
                  <button
                    type="button"
                    className="cust-log"
                    onClick={() => {
                      // Error checking before submitting
                      if (validateInputs()) {
                        onSubmitCustomNutritionData();
                        setIsDrop2(false);
                      }
                    }}>
                    Log Food
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


        {isModal && (
          <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Food</h5>
                  <button type="button" className="btn-close" onClick={() => { setIsModal(false), setFoodName("") }} aria-label="Close"></button>
                </div>
                <div className="body-container">
                  <div className="bodyrow1">
                    <div className="modal-body">
                      <div className="dropdown">
                        <button
                          className="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          onClick={() => setISDrop(!isDrop)}
                        >
                          {selectedServing}
                        </button>
                        {isDrop && (
                          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><a className="dropdown-item" href="#" onClick={() => {
                              handleSelect('1 oz')

                              { results ? calcOunces() : null };
                            }}>1 oz</a></li>

                            <li><a className="dropdown-item" href="#" onClick={() => {
                              handleSelect('1 g')
                              { results ? calcGrams() : null };
                            }}>1 g</a></li>
                          </ul>
                        )}
                      </div>
                      <input type="number" className="form-control" placeholder="Number of Servings" onChange={(e) => {
                        setServings(e.target.value);
                        setServingSize(e.target.value)
                        setISDrop(false);
                      }}>
                      </input>
                    </div>
                  </div>
                  <div className="bodyrow2">
                    <div>
                      {cals && servings && selectedServing ? <Calories /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{total.toFixed(0)} Cal</span> : null}
                    </div>
                    <div>
                      {cals && servings && selectedServing ? <Protein /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{totalP.toFixed(0)}g Protein</span> : null}</div>
                    <div>
                      {cals && servings && selectedServing ? <Carbs /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{totalC.toFixed(0)}g Carbs</span> : null}
                    </div>
                    <div>
                      {cals && servings && selectedServing ? <Fat /> : null}
                      {cals && servings && selectedServing ? <span className="mac">{totalF.toFixed(0)}g Fat</span> : null}
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="closeout" onClick={() => { setIsModal(false); setFoodName(""); }}>Close</button>
                  <button
                    type="submit"
                    className="cust-log"
                    onClick={() => {
                      if (servings && selectedServing !== "Serving Size") {
                        handleClick();
                      } else {
                        alert("Please select a serving and serving size");
                      }
                    }}
                  >
                    Log Food
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}


export function Calories() {
  return (
    <img className="calories" src="/assets/fire-svgrepo-com.svg"></img>
  )
}

export function Protein() {
  return (
    <img className="protein" src="/assets/meat-on-bone-svgrepo-com.svg"></img>
  )
}


export function Carbs() {
  return (
    <img className="carb" src="/assets/bread-svgrepo-com.svg"></img>
  )
}

export function Fat() {
  return (
    <img className="fat" src="/assets/butter-svgrepo-com.svg"></img>
  )
}


export default Food
