import React, { useState } from "react";
import { Camera } from "lucide-react";

const BusinessSignup = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    username: "",
    password: "",
    serviceType: "",
    location: "",
    personalStatement: "",
    businessImage: null,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add submission logic here
    console.log(formData);
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center justify-content-center p-4">
      <div
        className="card shadow-sm"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <div className="card-header bg-primary text-white text-center">
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
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
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
              <select
                className="form-select"
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
              >
                <option value="">Select Service Type</option>
                <option value="food">Food</option>
                <option value="product">Product</option>
              </select>
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
              </label>
              <textarea
                className="form-control"
                id="personalStatement"
                name="personalStatement"
                value={formData.personalStatement}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
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

            <button type="submit" className="btn btn-primary w-100">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;
