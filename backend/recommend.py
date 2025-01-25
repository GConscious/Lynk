import requests
import json
import csv
from datetime import datetime
import re

class UWCalendarScraper:
    def __init__(self):
        """Initialize the scraper with necessary URLs and headers"""
        self.base_url = "https://25livepub.collegenet.com/calendars/events-calendar.json"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/json',
            'Referer': 'https://www.washington.edu/calendar/'
        }

    def clean_text(self, text):
        """Clean HTML and normalize whitespace"""
        if not text:
            return ""
        text = re.sub(r'<[^>]+>', ' ', text)
        text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
        return ' '.join(text.split()).strip()

    def extract_needs(self, description):
        """Get needs from description"""
        needs = []
        keywords = ['catering', 'food', 'beverages', 'snacks', 'equipment', 'volunteers', 'sponsors']
        for keyword in keywords:
            if keyword in description.lower():
                needs.append(keyword.title())
        return needs if needs else ['Not specified']

    def extract_budget(self, description):
        """Get budget information from description"""
        budget_pattern = r'\$\d+(?:,\d+)?(?:\s*-\s*\$?\d+(?:,\d+)?)?'
        match = re.search(budget_pattern, description)
        return match.group(0) if match else 'Not specified'

    def get_events(self):
        """Get events using the calendar API"""
        try:
            response = requests.get(self.base_url, headers=self.headers)
            response.raise_for_status()
            
            data = response.json()
            events = []
            
            if isinstance(data, list):
                raw_events = data
            elif isinstance(data, dict):
                raw_events = data.get('events', [])
            else:
                print(f"Unexpected data type: {type(data)}")
                return []
            
            for idx, event in enumerate(raw_events, 1):
                try:
                    description = self.clean_text(event.get('description', ''))
                    
                    # Get organization details from title or description
                    org_type = "Student Organization" if "student" in description.lower() else "Department Event"
                    organization = event.get('sponsor', event.get('organization', 'Not specified'))
                    
                    # Get or estimate attendees from description
                    attendees_match = re.search(r'(\d+)\s*(?:people|participants|attendees)', description)
                    attendees = int(attendees_match.group(1)) if attendees_match else 0
                    
                    # Get contact email
                    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', description)
                    contact_email = email_match.group(0) if email_match else 'Not specified'
                    
                    # Get requirements
                    requirements = next((s for s in description.split('.') if 'require' in s.lower()), 'Not specified')
                    
                    event_details = {
                        'id': event.get('id', idx),
                        'title': event.get('title', 'No Title'),
                        'organizationType': org_type,
                        'organization': organization,
                        'date': event.get('startDateTime', event.get('start', '')),
                        'location': event.get('location', {}).get('name', '') if isinstance(event.get('location'), dict) else event.get('location', ''),
                        'attendees': attendees,
                        'needs': self.extract_needs(description),
                        'budget': self.extract_budget(description),
                        'description': description,
                        'requirements': requirements.strip(),
                        'contactEmail': contact_email,
                        'url': event.get('url', event.get('detailsUrl', '')),
                    }
                    
                    events.append(event_details)
                    
                except Exception as e:
                    print(f"Error parsing event: {e}")
                    continue
            
            return events
            
        except requests.exceptions.RequestException as e:
            print(f"Error fetching events: {e}")
            return []
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON response: {e}")
            return []

def save_events_to_json(events, filename='uw_events.json'):
    """Save scraped events to a JSON file"""
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(events, f, indent=2, ensure_ascii=False)

def save_events_to_csv(events, filename='uw_events.csv'):
    """Save scraped events to a CSV file"""
    fieldnames = [
        'id', 'title', 'organizationType', 'organization', 'date', 
        'location', 'attendees', 'needs', 'budget', 'description', 
        'requirements', 'contactEmail', 'url'
    ]
    
    with open(filename, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        
        for event in events:
            event_row = event.copy()
            event_row['needs'] = ', '.join(event['needs'])
            writer.writerow(event_row)

def format_date(date_str):
    """Format date string for display"""
    try:
        for fmt in ["%Y-%m-%dT%H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y-%m-%d"]:
            try:
                date = datetime.strptime(date_str, fmt)
                return date.strftime("%B %d, %Y at %I:%M %p")
            except ValueError:
                continue
        return date_str
    except:
        return date_str

def main():
    scraper = UWCalendarScraper()
    
    print("Fetching events...")
    events = scraper.get_events()
    
    # Save events to both JSON and CSV files
    save_events_to_json(events)
    save_events_to_csv(events)
    
    print(f"\nSuccessfully scraped {len(events)} events")
    print("Events have been saved to 'uw_events.json' and 'uw_events.csv'")
    print("\nSample of first 5 events:")
    
    for event in events[:5]:
        print(f"\nEvent ID: {event['id']}")
        print(f"Title: {event['title']}")
        print(f"Organization: {event['organization']} ({event['organizationType']})")
        print(f"Date: {event['date']}")
        print(f"Location: {event['location']}")
        print(f"Attendees: {event['attendees']}")
        print(f"Needs: {', '.join(event['needs'])}")
        print(f"Budget: {event['budget']}")
        print(f"Requirements: {event['requirements']}")
        print(f"Contact: {event['contactEmail']}")
        print(f"Description: {event['description'][:200]}..." if len(event['description']) > 200 else f"Description: {event['description']}")
        print("-" * 50)

if __name__ == "__main__":
    main()