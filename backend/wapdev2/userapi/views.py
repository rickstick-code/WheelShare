import re
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework import authentication, permissions
from rest_framework.serializers import ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import Group
from django.core.mail import send_mail
from django.core.files.base import ContentFile
from rest_framework.parsers import JSONParser
from userapi.models import User
from . import serializers

from wapdev2 import urls
from rest_framework import renderers
from yamod.models import Vehicle


class JPEGRenderer(renderers.BaseRenderer):
    media_type = 'image/jpeg'
    format = 'jpg'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


class PNGRenderer(renderers.BaseRenderer):
    media_type = 'image/png'
    format = 'png'
    charset = None
    render_style = 'binary'

    def render(self, data, media_type=None, renderer_context=None):
        return data


class ApiView(viewsets.ViewSet):

    def list(self, request):
        endpoints = []
        for pattern in urls.urlpatterns:
            endpoint = str(pattern.pattern)
            # Include only api/ views and include only top-level endpoints:
            if "api/" in endpoint and re.search("<.*>", endpoint) is None:
                endpoints.append("http://localhost:8000/%s" % endpoint)
        return Response(endpoints)


class UserViewSet(viewsets.ViewSet):
    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request):
        '''
        List all users in the database. If the current user is not a superuser,
        the address attribute and url is returned as an empty string.
        '''
        order_by = request.GET.get("order_dir")
        if request.GET.get("count") is not None:
            return Response({"count": User.objects.count()}, status=200)

        query = User.objects.all()
        if order_by is not None:
            if order_by == "ASC":
                query = query.order_by("username")
            elif order_by == "DESC":
                query = query.order_by("-username")

        results = []
        for user in query:
            user_data = {
                "pk": user.pk,
                "username": user.username,
                "email": user.email,
                "address": user.address if request.user.is_superuser else "",
                "phone_number": user.phone_number,
                "url": f"http://localhost:8000/api/users/{user.pk}" if request.user.is_superuser else "",
            }
            results.append(user_data)
        return Response(results)

    def _check_parameters(self, payload):
        for required in ["username", "password1", "password2", "email"]:
            if not (required) in payload:
                raise ValidationError("Missing argument in request: %s" % required)
        if User.objects.filter(username=payload["username"]).exists():
            raise ValidationError("Username already exists.")
        if payload["password1"] != payload["password2"]:
            raise ValidationError("Password do not match")

    def _check_parameters(self, payload, single_password=False):
        required_fields = ["username"]  # Common required fields
        if single_password:
            required_fields.append("password")
        else:
            required_fields.extend(["password1", "password2"])

        for required in required_fields:
            if required not in payload:
                raise ValidationError(f"Missing argument in request: {required}")

        if not single_password and payload["password1"] != payload["password2"]:
            raise ValidationError("Passwords do not match")

        if User.objects.filter(username=payload["username"]).exists():
            raise ValidationError("Username already exists.")

    def create(self, request):
        payload = request.data
        single_password = "password" in payload and not ("password1" in payload or "password2" in payload)

        self._check_parameters(payload, single_password=single_password)

        user = User.objects.create(
            username=payload["username"],
            email=payload.get("email", ""),
            address=payload.get("address", ""),
            phone_number=payload.get("phone_number", ""),
            is_active=True
        )

        if single_password:
            user.set_password(payload["password"])
        else:
            user.set_password(payload["password1"])

        user.save()
        return Response({
            "username": user.username,
            "email": user.email,
            "address": user.address,
            "phone_number": user.phone_number
        }, status=201)

    def retrieve(self, request, pk):
        '''
        Retrieve details for user with given primary key. If the current user is not
        a superuser or the user itself, the address attribute is returned as an empty string.
        '''
        user = get_object_or_404(User, pk=pk)
        is_authorized = request.user.is_superuser or request.user.pk == user.pk

        user_data = {
            "id": user.pk,
            "username": user.username,
            "email": user.email,
            "address": user.address if is_authorized else "",
            "phone_number": user.phone_number,
            "is_active": user.is_active,
            "gender": user.gender if is_authorized else "",
            "groups": f"http://localhost:8000/api/users/{user.pk}/groups" if is_authorized else "",
            "security": f"http://localhost:8000/api/users/{user.pk}/security" if is_authorized else "",
        }
        return Response(user_data)

    def update(self, request, pk=None):
        '''
        Updates user with primary key pk.
        '''
        user = get_object_or_404(User, pk=pk)
        if request.user.is_superuser or request.user.pk == user.pk:
            payload = request.data
            user.username = payload["username"]
            user.email = payload["email"]
            user.address = payload["address"]
            user.phone_number = payload["phone_number"]
            user.save()
            return Response(payload, status=200)
        else:
            return Response({"error": "You must be superuser to access this endpoint OR be the owner of user object."},
                            status=403)

    def destroy(self, request, pk=None):
        '''
        Deletes user with primary key pk and removes this user from all associated vehicles' owners.
        '''
        if request.user.is_superuser:
            try:
                # Attempt to get the user to be deleted
                user_to_delete = User.objects.get(pk=pk)

                # Iterate over all vehicles and remove the user from their 'owner' field
                vehicles = Vehicle.objects.filter(owner=user_to_delete)
                for vehicle in vehicles:
                    vehicle.delete()  # Remove the user from the 'owner' field

                # After updating vehicles, delete the user
                user_to_delete.delete()
                return Response(status=204)
            except User.DoesNotExist:
                return Response({"error": "User not found."}, status=404)
        else:
            return Response({"error": "You must be superuser to delete user accounts."}, status=403)


    @action(detail=False, methods=['get'])
    def check_username(self, request):
        """
        Check if a username exists in the database.
        """
        username = request.query_params.get('username', None)
        if username is None:
            return Response({"error": "Username parameter is required."}, status=400)

        exists = User.objects.filter(username=username).exists()
        return Response({"exists": exists}, status=200)

class SecurityViewSet(viewsets.ViewSet):
    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request, user_pk):
        '''
        List active state of user and date of last login.
        '''
        user = get_object_or_404(User, pk=user_pk)
        return Response({"is_active": user.is_active, "last_login": user.last_login})

    def update(self, request, user_pk):
        '''
        Updates the user password of given user.
        '''
        if request.user.is_superuser or request.user.pk == user_pk:
            payload = request.data
            user = get_object_or_404(User, pk=user_pk)
            if not ("password1" in payload) or not ("password2" in payload):
                raise ValidationError("Passwords did not match.")
            user.set_password(payload["password1"])
            if "is_active" in payload:
                user.is_active = payload["is_active"]
            user.save()
            return Response({"message": "Password updated."}, status=200)
        else:
            return Response({"error": "You must be superuser to access this endpoint OR be the owner of user object."},
                            status=403)


class UserGroupViewSet(viewsets.ViewSet):
    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request, user_pk):
        '''
        Lists all groups of the given user.
        '''
        user = get_object_or_404(User, pk=user_pk)
        return Response(
            [{"name": group.name, "url": "http://localhost:8000/api/users/%s/groups/%s" % (user.pk, group.pk)}
             for group in user.groups.all()])

    def retrieve(self, request, user_pk, group_pk):
        '''
        Shows details of an assigned group
        '''
        user = get_object_or_404(User, pk=user_pk)
        group = get_object_or_404(Group, pk=group_pk)
        return Response(
            {"name": group.name}
        )

    def destroy(self, request, user_pk, group_pk):
        '''
        Deletes user group assignment (not the group itself)
        '''
        user = get_object_or_404(User, pk=user_pk)
        group = get_object_or_404(Group, pk=group_pk)
        user.groups.remove(group)
        return Response(status=204)

    def create(self, request, user_pk):
        '''
        Creates new group assignment for a given user.
        '''
        user = get_object_or_404(User, pk=user_pk)
        payload = request.data
        if not ("groups" in payload):
            raise ValidationError("Missing property 'groups' - should be a list.")
        for group_name in payload["groups"]:
            group = get_object_or_404(Group, pk=user_pk)
            user.groups.add(group)
        return Response(payload, status=201)


class GroupViewSet(viewsets.ViewSet):
    # We only allow JSON to be submitted:
    parser_classes = [JSONParser]

    def list(self, request):
        '''
        Lists all groups in the database
        '''
        # Pass the query to the serializer. It will automatically convert every
        # entry in the query to a JSON object - many=True will pack the result
        # in a list:
        serializer = serializers.GroupSerializer(Group.objects.all(), many=True)
        return Response(serializer.data)

    def create(self, request):
        '''
        Creates a new group in the database.
        '''
        if not (request.user.is_superuser):
            return Response({"error": "You need to be super user to perform this action."}, status=403)
        # Pass the request data to the serializer, it will take
        # care of the validation
        serializer = serializers.GroupSerializer(data=request.data)
        # Test, if the input data is correct. The raise_exception argument
        # tells the Django Rest Framework to automatically create an error
        # message and return a HTTP 400 Bad Request Error
        if serializer.is_valid(raise_exception=True):
            # This will invoke the "create" method of the serializer
            serializer.save()
        # Return a proper response:
        return Response(serializer.data, status=201)

    def retrieve(self, request, group_pk):
        '''
        Retrieves a group from the database.
        '''
        group = get_object_or_404(Group, pk=group_pk)
        serializer = serializers.GroupSerializer(group)
        return Response(serializer.data)

    def update(self, request, group_pk):
        '''
        Updates a group in the database.
        '''
        if request.user.is_superuser:
            group = get_object_or_404(Group, pk=group_pk)
            serializer = serializers.GroupSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                serializer.save()
            return Response({"status": "updated"}, status=200)
        return Response({"error": "You must be superuser to delete user accounts."}, status=403)

    def destroy(self, request, group_pk):
        '''
        Deletes a group from the database
        '''
        if request.user.is_superuser:
            User.objects.filter(pk=group_pk).delete()
            return Response(status=204)
        return Response({"error": "You must be superuser to delete user accounts."}, status=403)


class ImageProfileViewSet(viewsets.ViewSet):
    # We want to return the image directly, instead of embedding
    # it into an JSON object, thus we provide the custom renderers
    # here, one for JPEG and one for PNG renderes
    renderer_classes = [JPEGRenderer, PNGRenderer]

    # We use form parser and multipart parsers for incoming data,
    # we do not expect JSON that includes images:
    parser_classes = [MultiPartParser, FormParser]

    def retrieve(self, request, user_pk):
        user = get_object_or_404(User, pk=user_pk)
        # the "profile_image" is a reference to a file in the file system.
        # DRF requires us to return a link to an open file object (thus calling open):
        return Response(user.profile_image.open(), status=200)

    def create(self, request, user_pk):
        user = get_object_or_404(User, pk=user_pk)
        if user.profile_image is not None:
            # delete old image
            user.profile_image.delete()
        user.profile_image = request.FILES.get("profile_image")
        # user.profile_image.save()
        user.save()
        return Response({"status": "Image successfully uploaded."}, status=200)
