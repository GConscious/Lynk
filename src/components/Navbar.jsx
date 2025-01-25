import React from 'react';
import { Link } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">

        {/* Logo and redirect to events page */}
          <Link className="navbar-brand" to="/events">
            <img
              src="lynk.png"
              alt="Lynk Logo"
              className="logo"
              style={{ height: "40px" }}
            />
          </Link>

        {/* Links to the other pages */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link fs-5 " to="/events" style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}>
                  Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/signup" style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}>
                  Sign Up
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link fs-5" to="/login" style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}>
                  Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;