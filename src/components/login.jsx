import React, { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";
import "./index.css";
import { Navigate } from "react-router-dom";
import axios from "axios";


export function Login({ user }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSignUpActive, setIsSignUpActive] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const url = import.meta.env.VITE_RENDER_URL;

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
            <div className="rounded-[20px] flex justify-center items-center h-screen w-screen">
                <div className="bg-white block p-[60px] rounded-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] h-full w-full flex justify-center items-center flex-col min-w-[300px] h-[80vh] w-[80vw] max-[450px]:h-[70%]">
                    {isSignUpActive && <p className="text-xl leading-7 font-semibold text-center text-black">Create an account</p>}
                    {!isSignUpActive && <p className="text-xl leading-7 font-semibold text-center text-black">Login to your account</p>}
                    {errorMessage && <p className="text-red-500 text-xs mt-[5px] block" style={{ color: "red" }}>{errorMessage}</p>}
                    <div className="relative w-full">
                        <input
                            className="w-full outline-none border border-gray-300 my-2 bg-white p-4 pr-12 text-sm leading-5 w-full rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                            placeholder="Email"
                            type="email"
                            onChange={handleEmailChange}
                            style={{
                                outline: errorMessage ? "2px solid red" : "none",
                            }}
                        />
                    </div>
                    <div className="relative w-full">
                        <input
                            className="w-full outline-none border border-gray-300 my-2 bg-white p-4 pr-12 text-sm leading-5 w-full rounded-lg shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
                            placeholder="Password"
                            type={passwordVisible ? "text" : "password"}
                            onChange={handlePasswordChange}
                            style={{
                                outline: errorMessage ? "2px solid red" : "none",
                            }}
                        />
                        <span onClick={toggleVisible} style={{ cursor: "pointer" }} className="grid absolute top-0 bottom-0 right-0 pl-4 pr-4 place-content-center">
                            <svg
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="text-gray-400 w-4 h-4"
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
                        <button className="block py-3 px-5 bg-gradient-to-br from-[#f3d2af] to-[#ff9e4a] hover:bg-gradient-to-br hover:from-[#f0c9a0] hover:to-[#ff7c29] text-white text-sm leading-5 font-medium w-full rounded-lg uppercase outline-none border border-gray-300 my-2" onClick={() => {
                            handleSignUp();
                        }}
                            type="button">Sign Up</button>
                    ) : (
                        <button className="block py-3 px-5 bg-gradient-to-br from-[#f3d2af] to-[#ff9e4a] hover:bg-gradient-to-br hover:from-[#f0c9a0] hover:to-[#ff7c29] text-white text-sm leading-5 font-medium w-full rounded-lg uppercase outline-none border border-gray-300 my-2" type="button" onClick={handleSignIn}>Sign In</button>
                    )}

                    {isSignUpActive ? (
                        <p className="text-gray-500 text-sm leading-5 text-center mt-5">
                            Already have an account?{" "}
                            <a href="/login" onClick={handleMethodChange} className="underline">
                                Login
                            </a>
                        </p>
                    ) : (
                        <p className="text-gray-500 text-sm leading-5 text-center mt-5">
                            Don't have an account?{" "}
                            <a href="" onClick={handleMethodChange} className="underline">
                                Sign Up
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}


export default Login;