import React, { useState } from "react";
import { Camera } from "lucide-react";
import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// form for businesses to signup and create their account
const BusinessSignup = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    password: "",
    serviceType: "",
    location: "",
    personalStatement: "",
    businessImage: null,
    email: "",
  });

  const [error, setError] = useState(""); // To handle and display errors
  const db = getFirestore();

  // change in a field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // handles uploading of an image
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      businessImage: file,
    }));
  };

  // handles the submit of the form
  // creates auth for the user that is signing up
  // creates firebase db with users data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        businessName: formData.businessName,
        serviceType: formData.serviceType,
        location: formData.location,
        personalStatement: formData.personalStatement,
        businessImage: formData.businessImage,
        email: formData.email,
      });

      console.log("User created:", user.uid);
      alert("Signup successful!");
    } catch (err) {
      setError(err.message);
      console.error("Signup error:", err.message);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-header text-white text-center" style={{ backgroundColor: "#008000" }}>
          <h2 className="my-2">Business Signup</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="businessName" className="form-label">
                Business Name
              </label>
              <input
                type="text"
                className="form-control"
                id="businessName"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
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
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="serviceType" className="form-label">
                Service Type
              </label>
              <input
                type="text"
                className="form-control"
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="personalStatement" className="form-label">
                Business Bio
                <p>
                  <small>
                    What kind of business are you? What values are important to
                    you? What kind of services do you offer?
                  </small>
                </p>
              </label>
              <textarea
                className="form-control"
                id="personalStatement"
                name="personalStatement"
                value={formData.personalStatement}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="businessImage" className="form-label">
                Business Image
              </label>
              <div className="input-group">
                <input
                  type="file"
                  className="form-control d-none"
                  id="businessImageUpload"
                  name="businessImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="businessImageUpload"
                  className="btn btn-outline-secondary d-flex align-items-center"
                >
                  <Camera className="me-2" /> Upload Image
                </label>
              </div>
              {formData.businessImage && (
                <div className="mt-2 text-muted small">
                  {formData.businessImage.name}
                </div>
              )}
            </div>
            <button type="submit" className="btn" style={{ backgroundColor: "#008000", color: "white" }}>
              Sign Up
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}{" "}
            {/* Display error message */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;
