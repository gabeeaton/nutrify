import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <div className="justify-content-center nav-area">
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
  );
}

export default Navbar;