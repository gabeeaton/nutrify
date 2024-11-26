import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css";
import { fetchAPI } from "./api.js";
import { Foodinfo } from "./components/food-info"
import { ApiContext } from "./components/food";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { ProtectedRoute } from "./components/protectedRoute.jsx";
import { Link } from "react-router-dom";

import Navbar from "./components/navbar";
import Food from "./components/food";
import Dashboard from "./components/view.jsx";
import Login from "./components/login.jsx";
import SettingsPage from "./components/settings.jsx";

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
          
          <Route path="/" element={<><Navbar user={user} /> <Main /></>} />
          <Route path="/food" element={<>
            <ProtectedRoute user={user}>
              <Navbar user={user} /><Food setSelection={setSelection} user={user} />
            </ProtectedRoute>
          </>} />
          <Route path="/food-info" element={<><Navbar user={user} /><Foodinfo /></>} />
          <Route path="/view" element={
            <ProtectedRoute user={user}>
                <Navbar user={user} /><Dashboard user={user}></Dashboard>
            </ProtectedRoute>
          } />
             <Route path="/settings" element={
            <ProtectedRoute user={user}>
              <Navbar user={user}/><SettingsPage user={user} />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login user={user} />} />
        </Routes>
      </ApiContext.Provider>
    </BrowserRouter>
  );
}

function Main({user}) {
  return (
    <>
      <div className="container">
        <Cover user={user}/>
      </div>
    </>
  );
}

function Cover({user}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <>
      <div className="coverTitle">
        <h1 className="fade-in">
          NUTRIFY{" "}
          <img className="apple" src="./Gpublic/apple-svgrepo-com.svg" alt="food dish" />
        </h1>
        <h2 className="fade-in">
          Your ultimate tool in the journey towards a healthier, happier you.
        </h2>
        <div className="first">
          <Link to={user ? "/food" : "/login"} style={{ textDecoration: 'none', color: 'inherit' }}> 
            <h2 className = "firsttext" style={{ fontSize: "25px" }}>Log your first meal <span className="arrow"><Arrow /></span></h2>
          </Link>
        </div>
      </div>
    </>

  );
}

function Arrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="white" className="bi bi-arrow-right" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
    </svg>
  )
}
export default App;