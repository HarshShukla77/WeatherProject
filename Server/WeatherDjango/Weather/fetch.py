import requests
from . models import Weather

def fetch_and_save_weather(city):
    api_key = 'YOUR_OPENWEATHER_API_KEY'
    url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
    
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        Weather.objects.create(
            temp=weather_data["main"]["temp"],
            humidity=weather_data["main"]["humidity"],
            clouds=weather_data["weather"][0]["description"],
            speed=weather_data["wind"]["speed"]
        )
    else:
        print("Failed to fetch data")
