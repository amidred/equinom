import requests
import sqlite3
from datetime import datetime
import geonamescache
# from dotenv import load_dotenv
# import os


# # Load environment variables from .env file
# load_dotenv()

# Replace with your API key and endpoint
API_KEY = '31e3e554bcb1bf7390b259c8667a8c16'
WEATHER_API_URL = f'http://api.openweathermap.org/data/2.5/weather' 

def get_geolocation():
    try:
        # Call the ipinfo.io API
        response = requests.get('https://ipinfo.io/')
        
        # Raise an exception if the request was unsuccessful
        response.raise_for_status()

        # Parse the JSON response
        data = response.json()
        
        # Extract the location information
        location = data.get('city')
        # location = data.get('loc', None)
        if location:
            # latitude, longitude = location.split(',')
            # print(f"Latitude: {latitude}, Longitude: {longitude}")
            print(f"city: {location}")
        else:
            print("Location not found in the response.")
    
        return location

    except requests.exceptions.RequestException as e:
        print(f"Error retrieving geolocation: {e}")

def fetch_weather_data(name):
    print(f"fetch_weather_data city: {name}")
    """Fetches weather data from the API."""
    response = requests.get( f'{WEATHER_API_URL}?q={name}&appid={API_KEY}&units=metric')
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch data. Status code: {response.status_code}")
        return None

def transform_data(data):
    """Transforms the API response into a format suitable for SQLite."""
    if data:
        transformed_data = {
            'city': data.get('name'),
            'temperature': data['main']['temp'],
            'humidity': data['main']['humidity'],
            'pressure': data['main']['pressure'],
            'weather': data['weather'][0]['description'],
            'date_time': data['dt']
            # 'date_time': datetime.utcfromtimestamp(data['dt']).strftime('%Y-%m-%d %H:%M:%S')
        }
        return transformed_data
    return None

def load_data_to_db(data):
    """Loads the transformed data into the SQLite database."""
    connection = sqlite3.connect('/app/db/weather_data.db')
    cursor = connection.cursor()
    
    # Create table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS Weather (
        id INTEGER PRIMARY KEY,
        city TEXT,
        temperature REAL,
        humidity INTEGER,
        pressure INTEGER,
        weather TEXT,
        date_time DATETIME
    )
    ''')

    # Insert data into the table
    cursor.execute('''
    INSERT INTO Weather (city, temperature, humidity, pressure,  weather, date_time)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', (data['city'], data['temperature'], data['humidity'], data['pressure'], data['weather'], data['date_time']))

    connection.commit()
    connection.close()
    print("Data loaded to database successfully.")

def etl_process():
    """Runs the ETL process."""
    # city = get_geolocation()
    # print(city)

    cities = ["New York", "London", "Tokyo", "Sydney", "Jerusalem"]
    for city in cities:
        print(city)
        weather_data = fetch_weather_data(city)
        # print(weather_data)
        transformed_data = transform_data(weather_data)
        if transformed_data:
            load_data_to_db(transformed_data)

    # weather_data = fetch_weather_data(city)
    # if weather_data:
    #     transformed_data = transform_data(weather_data)
    #     if transformed_data:
    #         load_data_to_db(transformed_data)

if __name__ == "__main__":
    etl_process()
