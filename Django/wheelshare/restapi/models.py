from django.db import models

# Vehicle Type Entity
class VehicleType(models.Model):
    name = models.TextField()

# Vehicle Entity
class Vehicle(models.Model):
    typ = models.ForeignKey(VehicleType, on_delete=models.CASCADE)
    brand = models.TextField()
    model = models.TextField()
    year = models.IntegerField()
    horsepower = models.IntegerField()
    number_of_seats = models.IntegerField()
    automatic = models.BooleanField(null=True)
    vignette = models.BooleanField(null=True)
    comments = models.TextField(null=True)
    active = models.BooleanField(default=True)

# Offer Location
class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()

# Offer Entity
class Offering(models.Model):
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE)
    start = models.DateTimeField()
    end = models.DateTimeField()
    price = models.FloatField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    comments = models.TextField(null=True)
    active = models.BooleanField(default=True)
