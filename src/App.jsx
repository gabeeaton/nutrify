import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchAPI } from "./api.js";
import { Foodinfo } from "./components/food-info"
import { ApiContext } from "./components/food";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { ProtectedRoute } from "./components/protectedRoute.jsx";

import Navbar from "./components/navbar";
import Food from "./components/food";
import Dashboard from "./components/view.jsx";
import Login from "./components/login.jsx";

function App() {
  const [message, setMessage] = useState('');
  const [selection, setSelection] = useState(null);
  const [user, setUser] = useState(null);

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);

        return;
      }
      setUser(null);
    });
    return () => unsubscribe();
  }, [])

  return (
    <BrowserRouter>
      <ApiContext.Provider value={selection}>
        <Routes>
          <Route path="/" element={<><Navbar user={user} /> <Main/></>} />
          <Route path="/food" element={<><Navbar user={user} /><Food setSelection={setSelection} /></>} />
          <Route path="/food-info" element={<><Navbar user={user} /><Foodinfo /></>} />
          <Route path="/view" element={
            <ProtectedRoute user={user}>
              <Dashboard user={user}></Dashboard>
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login user={user}/>} />
        </Routes>
      </ApiContext.Provider>
    </BrowserRouter>
  );
}

function Main() {
  return (
    <>

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
      <div className="coverTitle">
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