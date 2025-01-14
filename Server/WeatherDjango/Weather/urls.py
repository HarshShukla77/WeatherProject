from django.urls import path
from .views import WeatherListCreateView ,WeatherRetrieveUpdateDestroyView,WeatherFilter,WeatherView,WeatherByCityDateView

urlpatterns = [
    path('weather/', WeatherListCreateView.as_view(), name='weather-list-create'),
    path('weather/<int:pk>/', WeatherRetrieveUpdateDestroyView.as_view(), name='weather-retrieve-update-delete'),
    path('weather/filter', WeatherFilter.as_view(), name='weather-city'),
    path('weather/fetch', WeatherView.as_view(), name='weather-cityf'),
    path('weather/date', WeatherByCityDateView.as_view(), name='weather-cityfi'),
]