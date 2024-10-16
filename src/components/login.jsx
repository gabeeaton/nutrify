import React, { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./login.css";

export function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(false);

    const handleMethodChange = (event) => {
        event.preventDefault();
        setIsSignUpActive(!isSignUpActive);
    };

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            })
    }

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const toggleVisible = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <Navbar />
            <div className="login-container">
                <form className="form">
                    {isSignUpActive && <p className="form-title">Create an account</p>}
                    {!isSignUpActive && <p className="form-title">Login to your account</p>}
                    <div className="input-container">
                        <input
                            placeholder="Email"
                            type="email"
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="input-container">
                        <input
                            placeholder="Password"
                            type={passwordVisible ? "text" : "password"}
                            onChange={handlePasswordChange}
                        />
                        <span onClick={toggleVisible} style={{ cursor: "pointer" }}>
                            <svg
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                ></path>
                                <path
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                ></path>
                            </svg>
                        </span>
                    </div>
                    {isSignUpActive ?
                        <button className="submit" onClick={() => handleSignUp} type="button">Sign Up</button>
                        :
                        <button className="submit" type="button">Sign In</button>}
                    {isSignUpActive ? (
                        <p className="login-link">
                            Already have an account?{" "}
                            <a href="/login" onClick={handleMethodChange}>
                                Login
                            </a>
                        </p>
                    ) : (
                        <p className="login-link">
                            Don't have an account?{" "}
                            <a href="" onClick={handleMethodChange}>
                                Sign Up
                            </a>
                        </p>
                    )}
                </form>
            </div>
        </>
    );
}

export default Login;
