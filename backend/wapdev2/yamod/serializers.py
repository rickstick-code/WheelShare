from django.contrib.auth import get_user_model
from rest_framework import serializers
import logging

from . import models

logger = logging.getLogger(__name__)


class TypeSerializer(serializers.ModelSerializer):
    pk = serializers.IntegerField(read_only=True)  # Explicitly define a 'pk' field

    class Meta:
        model = models.Type
        fields = ['pk', 'name']


class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Bookings
        fields = '__all__'


class VehicleSerializer(serializers.ModelSerializer):
    # we send the owner as pk and the type as whole object because we might want to dynamically add types later on
    type = TypeSerializer(many=True)
    owner = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=get_user_model().objects.all()
    )

    class Meta:
        model = models.Vehicle
        fields = ['model', 'number_of_seats', 'vignette', 'comment', 'type', 'owner', 'lon', 'lan']

    def create(self, validated_data):
        types_data = validated_data.pop('type')
        owners_pks = validated_data.pop('owner', [])
        vehicle = models.Vehicle.objects.create(**validated_data)
        for type_data in types_data:
            type_instance, created = models.Type.objects.get_or_create(**type_data)
            vehicle.type.add(type_instance)

        for pk in owners_pks:
            vehicle.owner.add(pk)

        return vehicle

    def update(self, instance, validated_data):
        types_data = validated_data.pop('type', [])
        owners_pks = validated_data.pop('owner', [])
        instance.model = validated_data.get('model', instance.model)
        instance.number_of_seats = validated_data.get('number_of_seats', instance.number_of_seats)
        instance.vignette = validated_data.get('vignette', instance.vignette)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.lon = validated_data.get('lon', instance.lon)
        instance.lan = validated_data.get('lan', instance.lan)

        # Update or create Type instances
        if types_data:
            instance.type.clear()
            for type_data in types_data:
                type_instance, created = models.Type.objects.get_or_create(**type_data)
                instance.type.add(type_instance)

        if owners_pks:
            instance.owner.set(owners_pks)

        instance.save()
        return instance



class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Genre
        fields = '__all__'


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Person
        fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
    # name = serializers.StringRelatedField(source='person')
    # Return list of names ['..'] instead a list of objects {name: '...'}
    def to_representation(self, obj):
        return obj.person.credited_name

    def to_internal_value(self, data):
        role = {
            "person_id": data
        }
        return role

    class Meta:
        model = models.Role

        fields = ['person']


class Country:
    pass


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class MovieSerializer(serializers.ModelSerializer):

    class Meta:
        model = models.Movie
        fields = '__all__'

    def create(self, validated_data):
        genre_data = validated_data.pop('genres')
        movie = models.Movie.objects.create(**validated_data)
        for genre in genre_data:
            movie.genres.add(genre.pk)
        return movie

    def update(self, instance, validated_data):
        print(validated_data)
        genre_data = validated_data.pop('genres')
        instance.movie_title = validated_data.get('movie_title', instance.movie_title)
        instance.runtime = validated_data.get('runtime', instance.runtime)
        instance.released = validated_data.get('released', instance.released)
        instance.rating = validated_data.get('rating', instance.rating)
        instance.country = validated_data.get('country', instance.country)
        instance.save()

        instance.genres.clear()

        for genre in genre_data:
            print(genre)
            instance.genres.add(genre.pk)

        return instance


