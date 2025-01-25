import React, { useState } from "react";
import { auth } from "./firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

// Storage of business info
const BusinessLogin = () => {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });

  // Error Message
  const [error, setError] = useState("");

  // Handles changes in field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Stores submission data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = info;
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Logged in with email:", user);
      alert("Login successful!");
    } catch (err) {
      setError("Login unsuccessful: Incorrect username or password");
      console.error("Login error: Incorrect username or password", err.message);
    }
  };

  // Login Layout
  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <div className="card-header bg-primary text-white text-center">
          <h2 className="my-2">Business Login</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={info.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={info.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessLogin;
