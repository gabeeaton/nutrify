import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar({ user }) {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => console.log("Sign Out"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="nav-section">
      <div className = "nav-area1">
        <ul>
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/food">
              Log Food
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/view">
              View Entries
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/settings">
              Settings
            </Link>
          </li>
        </ul>
      </div>

      <div className ="nav-area2">
        <ul>
          {user ? (
            <>
              <li className="nav-item">
                <span className = "username">
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
                <span style={{color: "white"}}>Sign In</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
