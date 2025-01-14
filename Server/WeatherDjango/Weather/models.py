from django.db import models
from django.db.models import UniqueConstraint, Q
from django.db.models.functions import TruncDate

class Weather(models.Model):
    city = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    temp = models.FloatField()
    humidity = models.IntegerField()
    clouds = models.CharField(max_length=50)
    speed = models.FloatField()
    recorded_at = models.DateTimeField()

    class Meta:
        constraints = [
            UniqueConstraint(fields=['city'], name='unique_city_date', condition=Q(recorded_at=TruncDate('recorded_at')))
        ]

    def __str__(self):
        return f"Weather in {self.city} at {self.recorded_at}"