import React from "react";
import { Link } from "react-router-dom";
import "./view.css";

function Dashboard({user}) {
    return (
        <div className="wrap">
            <div className="main-container">
                <div className="grid-item grid-item-header">
                    {user && <h1>Welcome, {user.email}</h1>}
                    <Link className="nav-link" to="/">
                        <button className="home-btn">Home</button>
                    </Link>
                </div>
                <div className="grid-item grid-item-main"></div>
                <div className="grid-item grid-item2"></div>
                <div className="grid-item grid-item3"></div>
                <div className="grid-item grid-item4"></div>
                <div className="grid-item"></div>
                <div className="grid-item grid-item-large"></div>
            </div>
        </div>
    );
}

export default Dashboard;
