import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

const BusinessProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchUserData = async (user) => {
      try {
        setLoading(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const formattedData = {
            businessName: data.businessName || "N/A",
            email: data.email || "N/A",
            location: data.location || "N/A",
            personalStatement: data.personalStatement || "N/A",
            serviceType: data.serviceType || "N/A",
            businessImage: data.businessImage || null,
          };
          setUserData(formattedData);
          setEditedData(formattedData);
          setError(null);
        } else {
          setError("No user data found!");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setUpdateLoading(true);
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      const docRef = doc(db, "users", user.uid);
      await updateDoc(docRef, {
        businessName: editedData.businessName,
        email: editedData.email,
        Location: editedData.location,
        personalStatement: editedData.personalStatement,
        serviceType: editedData.serviceType,
      });

      setUserData(editedData);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Error updating profile: " + error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData(userData);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-warning" role="alert">
          Please log in to view your business profile.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid min-vh-100 bg-light py-5">
      <div className="container">
        <div className="d-flex justify-content-end mb-4">
          {!isEditing ? (
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <div className="btn-group">
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleCancel}
                disabled={updateLoading}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-md-4 text-center mb-4 mb-md-0">
            {userData.businessImage ? (
              <img
                src={userData.businessImage}
                alt={userData.businessName}
                className="img-fluid rounded-circle mb-3"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{ width: "200px", height: "200px" }}
              >
                <i className="bi bi-building fs-1 text-white"></i>
              </div>
            )}
          </div>

          <div className="col-md-8">
            {isEditing ? (
              <div className="mb-4">
                <label className="form-label">Business Name</label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  name="businessName"
                  value={editedData.businessName}
                  onChange={handleInputChange}
                />
              </div>
            ) : (
              <h1 className="display-4 mb-4">{userData.businessName}</h1>
            )}

            <div className="mb-4">
              <h3 className="text-primary mb-3">About Us</h3>
              {isEditing ? (
                <textarea
                  className="form-control"
                  name="personalStatement"
                  value={editedData.personalStatement}
                  onChange={handleInputChange}
                  rows="4"
                />
              ) : (
                <p className="lead">{userData.personalStatement}</p>
              )}
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-4">
                  <h3 className="text-primary mb-3">Service Type</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="serviceType"
                      value={editedData.serviceType}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="lead text-capitalize">
                      {userData.serviceType}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <h3 className="text-primary mb-3">Location</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      className="form-control"
                      name="location"
                      value={editedData.location}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="lead">{userData.location}</p>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-4">
                  <h3 className="text-primary mb-3">Contact</h3>
                  {isEditing ? (
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={editedData.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p className="lead">
                      <i className="bi bi-envelope me-2"></i>
                      <a
                        href={`mailto:${userData.email}`}
                        className="text-decoration-none"
                      >
                        {userData.email}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
