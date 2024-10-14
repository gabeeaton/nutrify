import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <div className="nav-area">
      <ul>
        <li className="nav-item">
          <div>
          <Link className="nav-link" to="/">
            Home
          </Link>
          </div>
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
        <li className="nav-item">
          <Link className="nav-link sign-in" to="/sign-in">
            <span>Sign In</span>
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link sign-up" to="/sign-up">
            <span>Sign Up</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
