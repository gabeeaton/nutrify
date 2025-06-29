import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./login.css";
import { Navigate } from "react-router-dom";
import axios from "axios";


export function Login({ user }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const url = import.meta.env.VITE_SUPABASE_URL

    if (user) {
        return <Navigate to='/'></Navigate>
    }

    const handleMethodChange = (event) => {
        event.preventDefault();
        setIsSignUpActive(!isSignUpActive);
    };

    const handleSignUp = async () => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            setErrorMessage("");

            if (user) {
                await setSettings(user);
            }

        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;

            if (errorCode === "auth/invalid-email") {
                setErrorMessage("Email address is not valid.");
            }
            else if (errorCode === "auth/user-not-found") {
                setErrorMessage("No user found with this email.");
            }
            else if (errorCode === "auth/wrong-password") {
                setErrorMessage("Incorrect password.");
            }
            else if (errorCode === "auth/email-already-in-use") {
                setErrorMessage("Email is already in use. Please use a different email.");
            }
            else if (errorCode === "auth/weak-password") {
                setErrorMessage("Password must be at least 6 characters.");
            }
            else if (errorCode === "auth/operation-not-allowed") {
                setErrorMessage("This operation is not allowed.");
            }
            else if (errorCode === "auth/too-many-requests") {
                setErrorMessage("Too many requests. Please try again later.");
            }
            else {
                setErrorMessage("Error signing up. Please try again.");
            }
        }
    };

    const setSettings = async (user) => {
        try {
            const firebaseId = user.uid;
            const settingsData = {
                firebase_id: firebaseId,
                email: email,
                calories_goal: 0,
                protein_goal: 0,
                fat_goal: 0,
                carbs_goal: 0
            };

            const response = await axios.post(`${url}/sign-up`, settingsData);

        } catch (error) {
            console.error(error);
        }
    }


    const handleSignIn = () => {
        if (!email || !password) return;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                setUser(user);
                setErrorMessage("");
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (errorMessage.includes("auth/invalid-email")) {
                    setErrorMessage("Email not found.");
                }
                else if (errorMessage.includes("auth/invalid-credential")) {
                    setErrorMessage("Incorrect password.");
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
                    {errorMessage && <p className="error-message" style={{ color: "red" }}>{errorMessage}</p>}
                    <div className="input-container">
                        <input
                            className = "em"
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
                            className = "pwd"
                            placeholder="Password"
                            type={passwordVisible ? "text" : "password"}
                            onChange={handlePasswordChange}
                            style={{
                                outline: errorMessage ? "2px solid red" : "none",
                            }}
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
                        <button className="submit" onClick={() => {
                            handleSignUp();
                        }}
                            type="button">Sign Up</button>
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