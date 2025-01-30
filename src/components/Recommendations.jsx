import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { getFirestore, doc, getDoc } from "firebase/firestore";

const Recommendations = ({ user }) => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [businessType, setBusinessType] = useState('');
    const db = getFirestore();

    useEffect(() => {
        const fetchBusinessAndRecommendations = async () => {
            if (!user) return;
            
            try {
                setLoading(true);
                // Fetch business data to get service type
                const businessDoc = await getDoc(doc(db, "users", user.uid));
                if (!businessDoc.exists()) {
                    throw new Error('Business data not found');
                }

                const businessData = businessDoc.data();
                setBusinessType(businessData.serviceType);

                // Fetch recommendations
                const response = await fetch(`http://localhost:5000/business-recommendations?userId=${user.uid}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch recommendations');
                }

                const data = await response.json();
                setRecommendations(data.recommendations);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessAndRecommendations();
    }, [user, db]);

    if (loading) {
        return (
            <div className="p-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-danger m-4" role="alert">
                Error loading recommendations: {error}
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto mt-8 px-4">
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Recommended Events for {businessType} Services
                </h2>
                <p className="text-gray-600 mt-2">
                    Events that match your business type and services
                </p>
            </div>

            {recommendations && recommendations.length > 0 ? (
                <div className="space-y-4">
                    {recommendations.map((item, index) => (
                        <div 
                            key={index}
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                            
                            <div className="flex flex-col space-y-2 text-gray-600 mb-3">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2" />
                                    {item.date}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {item.location}
                                </div>
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    {item.attendees} Expected Attendees
                                </div>
                            </div>

                            <div className="mb-3">
                                <div className="text-sm font-semibold mb-1">Services Needed:</div>
                                <div className="flex flex-wrap gap-2">
                                    {item.needs.map((need, i) => (
                                        <span 
                                            key={i}
                                            className={`px-2 py-1 rounded-full text-xs
                                                ${need.toLowerCase().includes(businessType.toLowerCase())
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'}`}
                                        >
                                            {need}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-gray-700 text-sm mb-3">
                                {item.description}
                            </p>

                            <button 
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                                onClick={() => window.location.href = `/events/${item.id}`}
                            >
                                View Details →
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <p className="text-gray-600 text-center">
                        No recommendations found for your business type at this time.
                    </p>
                </div>
            )}
        </div>
    );
};

export default Recommendations;