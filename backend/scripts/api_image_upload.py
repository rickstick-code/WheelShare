import requests

with open('avatar.png', 'rb') as f:
    r = requests.post("http://localhost:8000/api/users/1/image", files={'profile_image': f})
