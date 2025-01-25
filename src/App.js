import React, { useState } from "react";
import BusinessSignup from "./components/BusinessSignup.jsx";
import Events from "./components/Events.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route } from "react-router-dom";
import BusinessLogin from "./components/BusinessLogin.jsx";
import BusinessProfile from "./components/BusinessProfile.jsx";


function App() {
  return (
    <Routes>
      <Route path="/signup" element={<BusinessSignup />} />
      <Route path="/events" element={<Events />} />
      <Route path="/login" element={<BusinessLogin />} />
      <Route path="/profile" element={<BusinessProfile />} />
    </Routes>
  );
}

export default App;
