# Python Dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .
# COPY weather_data.db /data/
# COPY weather_data.db /app/db/weather_data.db

# Command to run the Python program (adjust as needed)
CMD ["python", "etl_weather.py"]

