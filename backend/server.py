from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

# Load the event data
data_path = r"C:\Users\vvaib\Documents\ProjectLynk\Lynk\backend\data.csv"

# Load the data into a DataFrame
events_df = pd.read_csv(data_path)

# Helper function to recommend events based on title or description
def recommend_similar_events(input_title, num_recommendations=5):
    tfidf = TfidfVectorizer(stop_words='english')
    
    # Combine title and description for better relevance
    combined_text = events_df['title'] + " " + events_df['description']
    
    # Fit TF-IDF on the combined text
    tfidf_matrix = tfidf.fit_transform(combined_text)
    
    # Compute similarity matrix
    similarity_matrix = cosine_similarity(tfidf_matrix)
    
    # Find the index of the input title
    input_index = events_df[events_df['title'] == input_title].index[0]
    
    # Get similarities for the input title
    similarities = similarity_matrix[input_index]
    
    # Sort the similarities and get top recommendations
    similar_indices = similarities.argsort()[-(num_recommendations + 1):-1][::-1]
    
    recommendations = []
    for idx in similar_indices:
        recommendations.append({
            'title': events_df.iloc[idx]['title'],
            'date': events_df.iloc[idx]['date'],
            'location': events_df.iloc[idx]['location'],
            'attendees': events_df.iloc[idx]['attendees'],
            'description': events_df.iloc[idx]['description'],
            'url': events_df.iloc[idx]['contactEmail'],  # For demo, using email as URL (you can modify as needed)
        })
    
    return recommendations

# Search route (search by title or description)
@app.route("/search", methods=["GET"])
def search():
    try:
        query_text = request.args.get('query', '')
        if not query_text:
            return jsonify({"error": "Query parameter is required"}), 400

        # Perform TF-IDF search using title and description
        tfidf = TfidfVectorizer(stop_words='english')
        combined_text = events_df['title'] + " " + events_df['description']
        tfidf_matrix = tfidf.fit_transform(combined_text)
        
        query_vec = tfidf.transform([query_text])
        cosine_similarities = cosine_similarity(query_vec, tfidf_matrix).flatten()
        
        # Get top 10 most similar events
        similar_indices = cosine_similarities.argsort()[-10:][::-1]
        
        search_results = []
        for idx in similar_indices:
            search_results.append({
                'title': events_df.iloc[idx]['title'],
                'date': events_df.iloc[idx]['date'],
                'location': events_df.iloc[idx]['location'],
                'attendees': events_df.iloc[idx]['attendees'],
                'description': events_df.iloc[idx]['description'],
                'url': events_df.iloc[idx]['contactEmail'],  # For demo, using email as URL
            })

        return jsonify({"results": search_results})

    except Exception as e:
        print(f"Error processing search request: {str(e)}")  # Server-side logging
        return jsonify({"error": "Internal server error"}), 500

# Recommendation route (recommend similar events based on selected event)
@app.route("/recommend", methods=["GET"])
def recommend():
    try:
        input_title = request.args.get('title', '')
        if not input_title:
            return jsonify({"error": "Title parameter is required for recommendations"}), 400

        recommendations = recommend_similar_events(input_title)
        
        return jsonify({
            "message": "Recommended events based on your selected event.",
            "recommendations": recommendations
        })
    
    except Exception as e:
        print(f"Error processing recommendation request: {str(e)}")  # Server-side logging
        return jsonify({"error": "Internal server error"}), 500

if __name__ == "__main__":
    app.run(debug=True)
