from rest_framework import serializers
from .models import Weather

class WeatherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weather
        fields = ['id','city','description' ,'temp', 'humidity', 'clouds', 'speed', 'recorded_at']

class CitySerializer(serializers.Serializer):
    city = serializers.CharField(max_length=100)