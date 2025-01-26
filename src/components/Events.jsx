import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { getFirestore, doc, getDoc } from "firebase/firestore";
import eventData from "../data/uw-events.json"; 

const Events = ({ user }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [messageData, setMessageData] = useState({
    message: '',
    businessName: '',
    contactEmail: ''
  });
  const [businessData, setBusinessData] = useState(null);
  const [eventsData, setEventsData] = useState([]);

  const db = getFirestore();

  useEffect(() => {
    setEventsData(eventData.events);
  }, []);

  useEffect(() => {
    const fetchBusinessData = async () => {
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            setBusinessData(data);
            setMessageData(prev => ({
              ...prev,
              businessName: data.businessName || '',
              contactEmail: data.email || ''
            }));
          }
        } catch (error) {
          console.error("Error fetching business data:", error);
        }
      }
    };

    fetchBusinessData();
  }, [user, db]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Sending message:', {
        to: selectedEvent.contactEmail,
        from: businessData,
        message: messageData.message
      });
      
      setShowContactModal(false);
      setMessageData(prev => ({
        ...prev,
        message: ''
      }));
      
      alert('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMessageData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        {/* Left Panel - Event Cards */}
        <div className="col-5 p-4 border-end overflow-auto bg-light">
          <div className="mb-4">
            <h2 className="fw-bold">Event Opportunities</h2>
            <p className="text-muted">{eventsData.length} events found</p>
          </div>
          
          {eventsData.map((event) => (
            <div 
              key={event.id}
              className={`card mb-3 cursor-pointer ${
                selectedEvent?.id === event.id ? 'border-primary' : ''
              }`}
              onClick={() => handleEventClick(event)}
              style={{ cursor: 'pointer' }}
            >
              <div className="card-body">
                <h5 className="card-title">{event.title}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{event.organization}</h6>
                
                <div className="my-3">
                  <div className="d-flex align-items-center text-muted mb-2">
                    <Calendar className="me-2" size={16} />
                    {event.date}
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <MapPin className="me-2" size={16} />
                    {event.location}
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {event.needs.map((need, index) => (
                    <span key={index} className="badge bg-secondary">
                      {need}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Event Details */}
        <div className="col-7 p-4 overflow-auto">
          {selectedEvent ? (
            <div>
              <div className="mb-4">
                <h1 className="fw-bold">{selectedEvent.title}</h1>
                <p className="fs-5 text-muted mb-4">{selectedEvent.organization}</p>
                
                <div className="row row-cols-2 g-4 mb-4">
                  <div className="col">
                    <div className="d-flex align-items-center text-muted">
                      <Calendar className="me-2" size={20} />
                      {selectedEvent.date}
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center text-muted">
                      <MapPin className="me-2" size={20} />
                      {selectedEvent.location}
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center text-muted">
                      <Users className="me-2" size={20} />
                      {selectedEvent.attendees} Attendees
                    </div>
                  </div>
                  <div className="col">
                    <div className="d-flex align-items-center text-muted">
                      <DollarSign className="me-2" size={20} />
                      Budget: {selectedEvent.budget}
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Event Description</h5>
                  <p className="card-text text-muted">{selectedEvent.description}</p>
                </div>
              </div>

              <div className="card mb-4">
                <div className="card-body">
                  <h5 className="card-title mb-3">Requirements</h5>
                  <p className="card-text text-muted">{selectedEvent.requirements}</p>
                </div>
              </div>

              <div className="d-flex gap-3">
                <button 
                  className="btn btn-primary flex-grow-1"
                  onClick={() => setShowContactModal(true)}
                >
                  Contact Organizer
                </button>
                <button className="btn btn-outline-primary flex-grow-1">
                  Save Event
                </button>
              </div>

              {/* Contact Modal */}
              <div 
                className={`modal fade ${showContactModal ? 'show' : ''}`} 
                tabIndex="-1"
                role="dialog"
                style={{ 
                  display: showContactModal ? 'block' : 'none',
                  backgroundColor: 'rgba(0,0,0,0.5)'
                }}
              >
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Contact Event Organizer</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowContactModal(false)}
                        aria-label="Close"
                      ></button>
                    </div>
                    <form onSubmit={handleContactSubmit}>
                      <div className="modal-body">
                        <div className="mb-3">
                          <label htmlFor="businessName" className="form-label">Business Name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="businessName"
                            name="businessName"
                            value={messageData.businessName}
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="contactEmail" className="form-label">Contact Email</label>
                          <input
                            type="email"
                            className="form-control"
                            id="contactEmail"
                            name="contactEmail"
                            value={messageData.contactEmail}
                            readOnly
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="message" className="form-label">Message</label>
                          <textarea
                            className="form-control"
                            id="message"
                            name="message"
                            rows="5"
                            value={messageData.message}
                            onChange={handleInputChange}
                            placeholder="Introduce your business and explain how you can help with this event..."
                            required
                          ></textarea>
                        </div>
                        <div className="text-muted small">
                          Your message will be sent to: {selectedEvent.contactEmail}
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button 
                          type="button" 
                          className="btn btn-secondary" 
                          onClick={() => setShowContactModal(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                        >
                          Send Message
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Select an event to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;