from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, CreateAPIView
from .models import Weather
import requests
from rest_framework import status
from .serializer import WeatherSerializer, CitySerializer
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.dateparse import parse_datetime
from datetime import datetime

class WeatherListCreateView(ListCreateAPIView):
    queryset = Weather.objects.all().order_by('-recorded_at')
    serializer_class = WeatherSerializer
 
class WeatherRetrieveUpdateDestroyView(RetrieveUpdateDestroyAPIView):
    queryset = Weather.objects.all()
    serializer_class = WeatherSerializer

class WeatherFilter(ListCreateAPIView):
    queryset = Weather.objects.all()
    serializer_class = WeatherSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['city']

class WeatherByCityDateView(ListCreateAPIView):
    serializer_class = WeatherSerializer

    def get_queryset(self):
        city = self.request.query_params.get('city')
        date_str = self.request.query_params.get('date')
        if city and date_str:
            date = parse_datetime(date_str)
            return Weather.objects.filter(city__iexact=city, recorded_at__date=date)
        return Weather.objects.none()

class WeatherView(CreateAPIView):
    serializer_class = CitySerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            city = serializer.validated_data['city']

            api_key = 'd1845658f92b31c64bd94f06f7188c9c'
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric"
            response = requests.get(url)

            if response.status_code == 200:
                weather_data = response.json()

                today = datetime.now().date()
                # Check if weather data already exists for the same city and date
                if Weather.objects.filter(city=city, recorded_at__date=today).exists():
                    return Response(
                        {"message": "Weather data for this city already exists for today."},
                        status=status.HTTP_200_OK
                    )

                # Create new weather record
                weather = Weather.objects.create(
                    city=city,
                    description=weather_data["weather"][0]["description"],
                    temp=weather_data["main"]["temp"],
                    humidity=weather_data["main"]["humidity"],
                    clouds=weather_data["clouds"]["all"],
                    speed=weather_data["wind"]["speed"],
                    recorded_at=datetime.now()
                )
                return Response(WeatherSerializer(weather).data, status=status.HTTP_201_CREATED)
            else:
                return Response(
                    {"error": f"Failed to fetch weather data: {response.text}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
