import React, { useState, useContext } from "react";
import "./food-info.css";
import Navbar from "./navbar";
import { ApiContext } from "./food";

function Foodinfo({results}) {

    const info = useContext(ApiContext);
    
    if (info) {   
        console.log("data", info);
    } else {
        console.log("data is null or undefined");
    }

    return (
    
    (
        <>
       <Navbar />
   
       <div className = "container">
        <div className = "child">
            <h1>

            </h1>
        </div>
       </div>
       </>
    )
    )

}
export default Foodinfo