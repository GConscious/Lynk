import React, { useState } from "react";
import { Camera } from "lucide-react";
import { auth } from "./firebase-config"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const BusinessSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "",
    password: "",
    serviceType: "",
    location: "",
    personalStatement: "",
    businessImage: null,
    email: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const db = getFirestore();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      businessImage: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const userData = {
        businessName: formData.businessName,
        serviceType: formData.serviceType,
        location: formData.location,
        personalStatement: formData.personalStatement,
        email: formData.email,
        createdAt: new Date().toISOString(),
        businessImage: formData.businessImage ? formData.businessImage.name : null,
      };

      const userDocRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userDocRef, userData);

      console.log("User created successfully:", userCredential.user.uid);
      alert("Signup successful!");
      navigate("/events");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message.includes("auth") 
        ? "Error creating account. Please check your email and password." 
        : "Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div
          className="card-header text-white text-center"
          style={{ backgroundColor: "#008000" }}
        >
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
                minLength="6"
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
            <button
              type="submit"
              className="btn w-100"
              style={{ backgroundColor: "#008000", color: "white" }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing Up...
                </>
              ) : (
                'Sign Up'
              )}
            </button>
            {error && <p className="text-danger mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;