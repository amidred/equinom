import schedule
import time
from etl_weather import etl_process

def job():
    print("Running scheduled task...")
    etl_process()

# Schedule the job every 5 minutes
schedule.every(5).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)  # Wait a bit before checking again
