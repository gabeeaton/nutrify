import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./App.css"; // Now includes Tailwind + custom styles
import { fetchAPI } from "./api.js";
import { Foodinfo } from "./components/food-info";
import { ApiContext } from "./components/food";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase.js";
import { ProtectedRoute } from "./components/protectedRoute.jsx";

import Navbar from "./components/navbar";
import Food from "./components/food";
import Dashboard from "./components/view.jsx";
import Login from "./components/login.jsx";
import SettingsPage from "./components/settings.jsx";

function App() {
  const [message, setMessage] = useState("");
  const [selection, setSelection] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAPI();
        setMessage(result);
      } catch (error) {
        console.error("Error fetching message", error);
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
  }, []);

  return (
    <BrowserRouter>
      <ApiContext.Provider value={selection}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar user={user} /> <Main user={user} />
              </>
            }
          />
          <Route
            path="/food"
            element={
              <ProtectedRoute user={user}>
                <Navbar user={user} />
                <Food setSelection={setSelection} user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/food-info"
            element={
              <>
                <Navbar user={user} />
                <Foodinfo />
              </>
            }
          />
          <Route
            path="/view"
            element={
              <ProtectedRoute user={user}>
                <Navbar user={user} />
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute user={user}>
                <Navbar user={user} />
                <SettingsPage user={user} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login user={user} />} />
        </Routes>
      </ApiContext.Provider>
    </BrowserRouter>
  );
}

function Main({ user }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen w-screen font-sans text-center">
      <Cover user={user} />
    </div>
  );
}

function Cover({ user }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen text-center mt-0 xl:mt-12 px-4">
      <h1
        className={`text-4xl md:text-5xl font-bold text-white mb-5 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        NUTRIFY{" "}
        <img
          className="inline-block h-8 w-8 align-middle"
          src="/assets/apple-svgrepo-com.svg"
          alt="food dish"
        />
      </h1>
      <h2
        className={`text-xl md:text-2xl font-light text-white mt-2.5 transition-opacity duration-500 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"
          }`}
      >
        Your ultimate tool in the journey towards a healthier, happier you.
      </h2>

      <div className="group mt-10 bg-[#f7b38d] rounded-full border border-[#f8d7b8] text-white transition-colors duration-300 ease-in-out hover:bg-[#f8d7b8] hover:border-[#f7b38d] cursor-pointer inline-block">
        <Link
          to={user ? "/food" : "/login"}
          className="no-underline text-inherit block px-6 py-2"
        >
          <h2 className="inline-block relative text-white text-[25px]">
            Log your first meal{" "}
            <span className="inline-block ml-1 transition-transform duration-300 ease-in-out group-hover:translate-x-2">
              <Arrow />
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );

}

function Arrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      fill="white"
      className="bi bi-arrow-right"
      viewBox="0 0 16 16"
    >
      <path
        fillRule="evenodd"
        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8"
      />
    </svg>
  );
}

export default App;