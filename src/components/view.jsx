import React from "react";
import "./view.css"
import { Link } from "react-router-dom";

function Dashboard() {

    return (
        <div className="wrap">
            <div className="main-container">
                <div className="grid-item grid-item0">
                    <h1>Your Dashboard</h1>
                    <Link className="nav-link" to="/">
                        <div className = "home">Home</div>
                    </Link>
                </div>
                <div className="grid-item grid-item1"></div>
                <div className="grid-item grid-item2"></div>
                <div className="grid-item grid-item3"></div>
                <div className="grid-item grid-item4"></div>
                <div className="grid-item grid-item5"></div>
            </div>
        </div>
    )
}

export default Dashboard;