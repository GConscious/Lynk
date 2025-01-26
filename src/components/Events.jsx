import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { getFirestore, collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";

const Events = ({ user }) => {
  const [savedEvents, setSavedEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageData, setMessageData] = useState({
    message: "",
    businessName: "",
    contactEmail: "",
  });
  const db = getFirestore();

  const eventsData = [
    {
      id: 1,
      title: "iSchool Hackathon 2025",
      organization: "Code Club UW",
      date: "March 15-16, 2025",
      location: "Mary Gates Hall",
      attendees: 200,
      budget: "$2000-3000",
      contactEmail: "hackathon@codeclub.edu",
    },
    {
      id: 2,
      title: "Spring Cultural Festival",
      organization: "International Student Society",
      date: "April 20, 2025",
      location: "University Square",
      attendees: 500,
      budget: "$5000-7000",
      contactEmail: "culturalfest@university.edu",
    },
    {
      id: 3,
      title: "Engineering Career Fair",
      organization: "College of Engineering",
      date: "May 5, 2025",
      location: "Engineering Hall",
      attendees: 300,
      budget: "$3000-4000",
      contactEmail: "careerfair@eng.edu",
    },
  ];

  useEffect(() => {
    const fetchSavedEvents = async () => {
      if (!user) return;

      try {
        const savedEventsRef = collection(db, `users/${user.uid}/savedEvents`);
        const querySnapshot = await getDocs(savedEventsRef);

        const savedEventIds = querySnapshot.docs.map((doc) => doc.id); // Store only IDs
        setSavedEvents(savedEventIds);
      } catch (error) {
        console.error("Error fetching saved events:", error);
      }
    };

    fetchSavedEvents();
  }, [user, db]);

  const handleSaveEvent = async (event) => {
    if (!user) {
      alert("Please log in to save events.");
      return;
    }

    try {
      const eventRef = doc(db, `users/${user.uid}/savedEvents`, event.id.toString());
      await setDoc(eventRef, event); // Save the event
      setSavedEvents((prev) => [...prev, event.id]); // Update local state
      alert("Event saved!");
    } catch (error) {
      console.error("Error saving event:", error);
      alert("Failed to save the event. Please try again.");
    }
  };

  const handleUndoSaveEvent = async (eventId) => {
    if (!user) {
      alert("Please log in to undo saved events.");
      return;
    }

    try {
      const eventRef = doc(db, `users/${user.uid}/savedEvents`, eventId.toString());
      await deleteDoc(eventRef); // Remove the event
      setSavedEvents((prev) => prev.filter((id) => id !== eventId)); // Update local state
      alert("Event unsaved.");
    } catch (error) {
      console.error("Error unsaving event:", error);
      alert("Failed to unsave the event. Please try again.");
    }
  };

  const isEventSaved = (eventId) => savedEvents.includes(eventId);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Message sent:", messageData);
    alert("Message sent successfully!");
    setShowContactModal(false);
    setMessageData((prev) => ({ ...prev, message: "" }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Left Panel - Event Cards */}
        <div className="col-5 p-4 border-end overflow-auto bg-light">
          <h2 className="fw-bold">Event Opportunities</h2>
          {eventsData.map((event) => (
            <div
              key={event.id}
              className="card mb-3"
              onClick={() => setSelectedEvent(event)}
              style={{ cursor: "pointer" }}
            >
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{event.organization}</h6>
                <p className="text-muted">
                  <Calendar className="me-2" size={16} />
                  {event.date}
                </p>
                <p className="text-muted">
                  <MapPin className="me-2" size={16} />
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Event Details */}
        <div className="col-7 p-4 overflow-auto">
          {selectedEvent ? (
            <div>
              <h1 className="fw-bold">{selectedEvent.title}</h1>
              <p className="fs-5 text-muted mb-4">{selectedEvent.organization}</p>
              <div className="row row-cols-2 g-4 mb-4">
                <div className="col">
                  <p className="text-muted">
                    <Calendar className="me-2" size={20} />
                    {selectedEvent.date}
                  </p>
                </div>
                <div className="col">
                  <p className="text-muted">
                    <MapPin className="me-2" size={20} />
                    {selectedEvent.location}
                  </p>
                </div>
                <div className="col">
                  <p className="text-muted">
                    <Users className="me-2" size={20} />
                    {selectedEvent.attendees} Attendees
                  </p>
                </div>
                <div className="col">
                  <p className="text-muted">
                    <DollarSign className="me-2" size={20} />
                    Budget: {selectedEvent.budget}
                  </p>
                </div>
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-primary flex-grow-1"
                  onClick={() => setShowContactModal(true)}
                >
                  Contact Organizer
                </button>
                {isEventSaved(selectedEvent.id) ? (
                  <button
                    className="btn btn-success flex-grow-1"
                    onClick={() => handleUndoSaveEvent(selectedEvent.id)}
                  >
                    Saved
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-primary flex-grow-1"
                    onClick={() => handleSaveEvent(selectedEvent)}
                  >
                    Save Event
                  </button>
                )}
              </div>

              {/* Contact Modal */}
              {showContactModal && (
                <div
                  className="modal fade show"
                  style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Contact Event Organizer</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowContactModal(false)}
                        ></button>
                      </div>
                      <form onSubmit={handleContactSubmit}>
                        <div className="modal-body">
                          <div className="mb-3">
                            <label className="form-label">Your Message</label>
                            <textarea
                              className="form-control"
                              name="message"
                              value={messageData.message}
                              onChange={handleInputChange}
                              rows="5"
                              placeholder="Introduce yourself and explain your interest in the event..."
                              required
                            />
                          </div>
                          <p className="text-muted">
                            This message will be sent to: {selectedEvent.contactEmail}
                          </p>
                        </div>
                        <div className="modal-footer">
                          <button type="button" className="btn btn-secondary" onClick={() => setShowContactModal(false)}>
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Send Message
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-muted">Select an event to view details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;