from flask import Flask, request, jsonify
import firebase_admin
from firebase_admin import credentials, firestore
from flask_cors import CORS
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

# Initialize Firebase Admin
cred = credentials.Certificate("./lynk-fc6d7-firebase-adminsdk-fbsvc-ffa7ac6fdc.json")  # You'll need to add your Firebase credentials
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_business_data(user_id):
    """Fetch business data from Firebase"""
    try:
        doc_ref = db.collection('users').document(user_id)
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        return None
    except Exception as e:
        print(f"Error fetching business data: {str(e)}")
        return None

def get_all_events():
    """Fetch all events from Firebase"""
    try:
        events_ref = db.collection('events')
        events = events_ref.stream()
        events_list = []
        for event in events:
            event_data = event.to_dict()
            event_data['id'] = event.id
            events_list.append(event_data)
        return events_list
    except Exception as e:
        print(f"Error fetching events: {str(e)}")
        return []

def calculate_event_relevance(business_type, event_needs):
    """Calculate relevance score between business type and event needs"""
    business_type = business_type.lower()
    needs = [need.lower() for need in event_needs]
    
    # Direct match
    if business_type in needs:
        return 1.0
    
    # Define related service types and their relevant needs
    service_mappings = {
        'catering': ['food', 'beverages', 'snacks', 'lunch', 'dinner', 'refreshments'],
        'photography': ['photo', 'pictures', 'documentation', 'media'],
        'food': ['catering', 'snacks', 'beverages', 'refreshments'],
        'entertainment': ['music', 'performance', 'shows', 'activities'],
        'security': ['safety', 'crowd control', 'monitoring'],
        'tech': ['av equipment', 'technical support', 'audio', 'video'],
        'staffing': ['volunteers', 'event staff', 'support staff']
    }
    
    # Check for related matches
    if business_type in service_mappings:
        related_terms = service_mappings[business_type]
        matches = sum(1 for need in needs if any(term in need for term in related_terms))
        if matches > 0:
            return matches / len(needs)
    
    return 0.0

@app.route("/business-recommendations", methods=["GET"])
def get_business_recommendations():
    try:
        user_id = request.args.get('userId')
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400
            
        # Get business data
        business_data = get_business_data(user_id)
        if not business_data:
            return jsonify({"error": "Business not found"}), 404
            
        business_type = business_data.get('serviceType')
        if not business_type:
            return jsonify({"error": "Business service type not found"}), 400
            
        # Get all events
        events = get_all_events()
        
        # Calculate relevance scores for each event
        scored_events = []
        for event in events:
            relevance_score = calculate_event_relevance(business_type, event.get('needs', []))
            if relevance_score > 0:  # Only include relevant events
                scored_events.append({
                    'event': event,
                    'relevance_score': relevance_score
                })
        
        # Sort by relevance score
        scored_events.sort(key=lambda x: x['relevance_score'], reverse=True)
        
        # Return top 5 most relevant events
        recommendations = [event['event'] for event in scored_events[:5]]
        
        return jsonify({
            "message": f"Recommended events for {business_data['businessName']}",
            "businessType": business_type,
            "recommendations": recommendations
        })
        
    except Exception as e:
        print(f"Error processing recommendation request: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)