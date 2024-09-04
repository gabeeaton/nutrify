import "./login.css";
import React, { useState } from "react";
import Navbar from "./navbar";
import axios from "axios";

export function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisible = () => {
    setPasswordVisible(!passwordVisible);
  };

  function handleSubmit(event) {
    event.preventDefault();
    axios
      .post("http://localhost:3000/login", { email, password })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <Navbar />
      <div className="main-container">
      <div className="login-container">
        <form className="form" onSubmit={handleSubmit}>
          <p className="form-title">Sign in to your account</p>
          <div className="input-container">
            <input
              placeholder="Enter email"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-container">
            <input
              placeholder="Enter password"
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
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
                  strokeLineJoin="round"
                  strokeLineCap="round"
                ></path>
                <path
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  strokeWidth="2"
                  strokeLineJoin="round"
                  strokeLineCap="round"
                ></path>
              </svg>
            </span>
          </div>
          <button className="submit" type="submit">
            Sign in
          </button>
          <p className="signup-link">
            No account? <a href="/sign-up">Sign up</a>
          </p>
        </form>
      </div>
      </div>
    </>
  );
}
