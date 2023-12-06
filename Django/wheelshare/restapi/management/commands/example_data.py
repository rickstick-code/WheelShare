from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from restapi.models import *
from datetime import datetime, timedelta

class Command(BaseCommand):
    help = 'Populate the database with example data'

    def handle(self, *args, **options):
        # Delete existing data
        self.stdout.write(self.style.SUCCESS('Deleting existing data...'))
        User.objects.all().delete()
        Group.objects.all().delete()
        Vehicle.objects.all().delete()
        VehicleType.objects.all().delete()
        Location.objects.all().delete()
        Offering.objects.all().delete()

        # Create example data
        self.stdout.write(self.style.SUCCESS('Creating example data...'))

        # Create admin user
        admin_user = User.objects.create_superuser('admin', 'admin@example.com', 'admin')

        # Create 3 users
        user1 = User.objects.create_user('Max', 'user1@example.com', 'user')
        user2 = User.objects.create_user('Lukas', 'user2@example.com', 'user')
        user3 = User.objects.create_user('Heinz', 'user3@example.com', 'user')

        # Create vehicle types
        type1 = VehicleType.objects.create(name='Car')
        type2 = VehicleType.objects.create(name='Bicycle')
        type3 = VehicleType.objects.create(name='Scooter')
        type4 = VehicleType.objects.create(name='Motorcycle')

        # Create vehicles
        Vehicle.objects.create(
            typ=type1,
            brand='Toyota',
            model='Camry',
            year=2020,
            horsepower=180,
            number_of_seats=5,
            automatic=True,
            vignette=True,
            comments='Comments for Vehicle 1',
            active=True
        )

        Vehicle.objects.create(
            typ=type2,
            brand='Schwinn',
            model='Mountain Bike',
            year=2021,
            horsepower=50,
            number_of_seats=1,
            automatic=False,
            vignette=False,
            comments='Comments for Vehicle 2',
            active=True
        )

        Vehicle.objects.create(
            typ=type3,
            brand='Xiaomi',
            model='Mi Electric Scooter',
            year=2022,
            horsepower=50,
            number_of_seats=1,
            automatic=True,
            vignette=False,
            comments='Comments for Vehicle 3',
            active=True
        )

        Vehicle.objects.create(
            typ=type4,
            brand='Harley-Davidson',
            model='Sportster',
            year=2019,
            horsepower=120,
            number_of_seats=2,
            automatic=False,
            vignette=True,
            comments='Comments for Vehicle 4',
            active=True
        )

        # Create locations
        Location.objects.create(latitude=37.7749, longitude=-122.4194)  # San Francisco, CA
        Location.objects.create(latitude=34.0522, longitude=-118.2437)  # Los Angeles, CA
        Location.objects.create(latitude=40.7128, longitude=-74.0060)   # New York, NY
        Location.objects.create(latitude=41.8781, longitude=-87.6298)   # Chicago, IL

        # Create offerings
        Offering.objects.create(
            vehicle=Vehicle.objects.get(id=1),
            start=datetime.now() + timedelta(days=1),
            end=datetime.now() + timedelta(days=7),
            price=60.0,
            location=Location.objects.get(id=1),
            comments='Offering 1',
            active=True
        )

        Offering.objects.create(
            vehicle=Vehicle.objects.get(id=2),
            start=datetime.now() + timedelta(days=2),
            end=datetime.now() + timedelta(days=8),
            price=40.0,
            location=Location.objects.get(id=2),
            comments='Offering 2',
            active=True
        )

        Offering.objects.create(
            vehicle=Vehicle.objects.get(id=3),
            start=datetime.now() + timedelta(days=3),
            end=datetime.now() + timedelta(days=9),
            price=30.0,
            location=Location.objects.get(id=3),
            comments='Offering 3',
            active=True
        )

        Offering.objects.create(
            vehicle=Vehicle.objects.get(id=4),
            start=datetime.now() + timedelta(days=4),
            end=datetime.now() + timedelta(days=10),
            price=80.0,
            location=Location.objects.get(id=4),
            comments='Offering 4',
            active=True
        )

        self.stdout.write(self.style.SUCCESS('Example data created successfully.'))
