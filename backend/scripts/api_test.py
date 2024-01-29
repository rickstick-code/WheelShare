import requests

# request token
tokens = requests.post("http://localhost:8000/api/token/",
                         json={"username":"root","password":"12345"}).json()
# should not work, no token provided:
response = requests.post("http://localhost:8000/api/genres/",
                         json={"name":"Any genre"})
print(response.status_code)
# should work, we provide the access token
# We add the access token in to the header
headers={"Authorization":"Bearer %s" % tokens["access"]}
# Execute the request
response = requests.post("http://localhost:8000/api/genres/",
                         json={"name":"Any genre"},
                         headers=headers)
print(headers)
print(response)

