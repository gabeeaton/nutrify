import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useState } from "react";

function Navbar({ user }) {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  const [menuOpen, setMenuOpen] = useState(false);


  return (
    <div className="nav-section">
      <div className="nav-area1">
        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
          <div className={`line ${menuOpen ? "open" : ""}`}></div>
        </div>
        <ul className={`ul1 ${menuOpen ? "open" : ""}`}>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              <div><Home />Home</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/food">
              <div><Journal />Log Food</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/view">
              <div><Chart />Dashboard</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              <div><Settings />Settings</div>
            </Link>
          </li>
        </ul>
      </div>


      <div className="nav-area2">
        <ul>
          {user ? (
            <>
              <li className="nav-item">
                <span className="username">
                  {user.email}
                </span>
              </li>
              <li className="nav-item sign-out">
                <button
                  className="nav-link signOut"
                  style={{ fontWeight: "bold", color: "white" }}
                  onClick={handleSignOut}
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li className="nav-item">
              <Link className="nav-link sign-in" to="/login">
                <span style={{ color: "white" }}>Sign In</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Home() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" className="bi bi-house" viewBox="0 0 16 16">
      <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
    </svg>
  )
}

function Journal() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-journal-text" viewBox="0 0 16 16">
      <path d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5" />
      <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2" />
      <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1z" />
    </svg>
  )
}

function Chart() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-bar-chart" viewBox="0 0 16 16">
      <path d="M4 11H2v3h2zm5-4H7v7h2zm5-5v12h-2V2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1z" />
    </svg>
  )
}

function Settings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
      <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492M5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0" />
      <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115z" />
    </svg>
  )
}

export default Navbar;
