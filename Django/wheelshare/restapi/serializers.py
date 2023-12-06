from django.contrib.auth.models import Group, User
from rest_framework import serializers
from restapi.models import *


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'groups']


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']


class VehicleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vehicle
        fields = ['typ', 'brand', 'model', 'year', 'horsepower', 'number_of_seats', 'automatic', 'vignette', 'comments', 'active']


class VehicleTypeSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = VehicleType
        fields = ['name']


class LocationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Location
        fields = ['latitude', 'longitude']


class OfferingSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Offering
        fields = ['vehicle', 'start', 'end', 'price', 'location', 'comments', 'active']