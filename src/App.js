import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "./components/Navbar.jsx";
import BusinessSignup from "./components/BusinessSignup.jsx";
import Events from "./components/Events.jsx";
import BusinessLogin from "./components/BusinessLogin.jsx";
import BusinessProfile from "./components/BusinessProfile.jsx";
import AuthRoute from "./components/AuthRoute.jsx";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/events"
          element={
            <AuthRoute>
              <Events user={user} />
            </AuthRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <AuthRoute>
              <BusinessProfile />
            </AuthRoute>
          }
        />
        <Route
          path="/signup"
          element={
            user ? <Navigate to="/events" replace /> : <BusinessSignup />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/events" replace /> : <BusinessLogin />}
        />
      </Routes>
    </>
  );
}

export default App;
