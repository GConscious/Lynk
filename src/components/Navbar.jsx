import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar({ user }) {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/events">
            <img
              src="lynk.png"
              className="logo"
              style={{ height: "40px" }}
            />
          </Link>

          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link 
                      className="nav-link fs-5" 
                      to="/events" 
                      style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}
                    >
                      Events
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link 
                      className="nav-link fs-5" 
                      to="/recommendations" 
                      style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}
                    >
                      Recommendations
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link 
                      className="nav-link fs-5" 
                      to="/profile" 
                      style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}
                    >
                      Profile
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="nav-link fs-5 btn btn-link" 
                      onClick={handleLogout}
                      style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link 
                      className="nav-link fs-5" 
                      to="/signup" 
                      style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}
                    >
                      Sign Up
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      className="nav-link fs-5" 
                      to="/login" 
                      style={{ color: '#008000', fontFamily: 'Trebuchet MS, sans-serif' }}
                    >
                      Login
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;