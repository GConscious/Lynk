import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

function SavedEvents() {
  const [user, setUser] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchSavedEvents = async (currentUser) => {
      try {
        setLoading(true);
        const savedEventsRef = collection(db, `users/${currentUser.uid}/savedEvents`);
        const querySnapshot = await getDocs(savedEventsRef);

        const events = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setSavedEvents(events);
        setError(null);
      } catch (err) {
        setError("Error fetching saved events: " + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchSavedEvents(currentUser);
      } else {
        setUser(null);
        setSavedEvents([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="alert alert-warning" role="alert">
          Please log in to view your saved events.
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

  return (
    <div className="container">
      <h1 className="display-4 mb-4" style={{ color: "#008000", fontFamily: 'Trebuchet MS, sans-serif' }}> Your Saved Events </h1>
      <div className="row">
        {savedEvents.length > 0 ? (
          savedEvents.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`} className="col-md-6 mb-4 text-decoration-none">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{event.title}</h5>
                  <p className="card-text">
                    <strong>Date:</strong> {event.date} <br />
                    <strong>Location:</strong> {event.location} <br />
                    <strong>Organization:</strong> {event.organization}
                  </p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p>No events are currently saved.</p>
        )}
      </div>
    </div>
  );
}

export default SavedEvents;