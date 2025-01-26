import json
import csv
import pandas as pd

# Load JSON data into a DataFrame
df = pd.read_json(r'C:\Users\vvaib\Documents\ProjectLynk\Lynk\backend\uw-events.json')

# Convert the DataFrame to a CSV file
df.to_csv('data.csv', index=False)
