import React, { useState } from "react";
import Navbar from "./navbar";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./login.css";
import { Navigate } from "react-router-dom";

export function Login({user}) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("")

    if(user) {
        return <Navigate to='/view'></Navigate>
      }

    const handleMethodChange = (event) => {
        event.preventDefault();
        setIsSignUpActive(!isSignUpActive);
    };

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                setErrorMessage("");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                if (errorMessage.includes("auth/invalid-email")) {
                    setErrorMessage("Please enter a valid email.");
                }
                else if (errorMessage.includes("auth/invalid-credential")) {
                    setErrorMessage("Invalid login.");
                }
            })
    }

    const handleSignIn = () => {
        if(!email || !password) return;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(user);
            setErrorMessage("");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            if (errorMessage.includes("auth/invalid-email")) {
                setErrorMessage("Please enter a valid email.");
            }
            else if (errorMessage.includes("auth/invalid-credential")) {
                setErrorMessage("Invalid login.");
            }
        });
    }

    const handleEmailChange = (event) => setEmail(event.target.value);
    const handlePasswordChange = (event) => setPassword(event.target.value);

    const toggleVisible = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <>
            <div className="login-container">
                <form className="form">
                    {isSignUpActive && <p className="form-title">Create an account</p>}
                    {!isSignUpActive && <p className="form-title">Login to your account</p>}
                    {errorMessage && <p className="error-message" style={{color: "red"}}>{errorMessage}</p>}
                    <div className="input-container">
                        <input
                            placeholder="Email"
                            type="email"
                            onChange={handleEmailChange}
                            style={{
                                outline: errorMessage ? "2px solid red" : "none",
                              }}
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
                    {isSignUpActive ? (
                        <button className="submit" onClick={handleSignUp} type="button">Sign Up</button>
                    ) : (
                        <button className="submit" type="button" onClick={handleSignIn}>Sign In</button>
                    )}

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
