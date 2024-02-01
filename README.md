# PROJECT WHEELSHARE - README

Project for the lecture "Web Application Development 2"
at the FH JOANNEUM University for Applied Science

Members:
- Franz Jeitler
- Jakob Schöllauf
- Frederick Van Bockryck
- Daria Karmakulova

## INSTALLATION & STARTUP:

**NOTE on scripts:**
Please note that the scripts mentioned below only work on Windows machines.

**NOTE on API-Key:**
This webapp uses the MapTiler-API (```https://www.maptiler.com/```).
The therefore required API-key is hardcoded into the TypeScript file.

Make sure you have installed all the required software, tools and frameworks before running the application:

- Python
- IntelliJ
- NodeJS
- Angular
- Django


To install all the libraries used in the project, run the following command in a cmd or PowerShell window with the path set to the backend folder:
```python -m pip install -r requirements.txt```

To install the proper version of Angular used in the project, run the following command in a cmd or PowerShell window:
```npm install -g @angular/cli@16.2.0```

Make sure to run the following command in a cmd or PowerShell window with the path set to the frontend folder:
```npm install```

Make sure to run the following command in a cmd or PowerShell window with the path set to the backend/wapdev2 folder:
```python create_secretkey.py```

To properly set up the database doubleclick ```Script_MakeMigrations.bat``` in the backend folder before starting the application.

To start the application, first doubleclick ```Script_RunServer.bat``` in the backend folder and make sure it succeeds.

If you start up the app for the first time, you may want to take the following steps. Otherwise you can just skip ahead to the last point.

To conveniently fill the database with some entries, doubleclick ```Script_CreateData.bat``` in the backend folder.
A few users as well as vehicles for renting will be created.

**NOTE on Script_CreateData:**
Please note that for this script to work, the REST-API has to be running already.
Be sure to successfully run ```Script_RunServer.bat``` before ```Script_CreateData.bat```.

To create a superuser, doubleclick ```Script_CreateSuperUser.bat``` in the backend folder.

Next, open the project folder in IntelliJ and make sure "npm" is selected in the Run/Debug Configurations and in the "Scripts" field "start" is selected. Now hit the Run button in IntelliJ. After the startup procedure has finished you can click the displayed hyperlink in the console within IntelliJ to open the application in your browser (```http://localhost:4200/```).

## FUNCTIONALITY:

The functionality and design of the app is slightly altered compared to how it is shown in the project proposal but basically the same.
Some "should have" and "nice to have" features shown in the proposal may not have been implemented, i.e. vehicle images, messaging.

On the landing/login page, you can either login to the application with an existing user or register a new user by clicking on register. Login by clicking the Let's Share button or register by clicking the Register button. Note that a check if the username you are typing is already taken, is being made while you type. It is shown below the Register button. A notification will be shown at the top of the page if you try to register with a username that already exists.

Upon logging into the application, you will be taken to the homepage, which consists of a fullscreen map view centered around your location. It can take a while to load the map. You can see available vehicles from other users marked by location pins.

If you move your mouse cursor near the top of the page, the menu bar will appear:
- By clicking on the calendar icon, you will get to the bookings overview. There are separate tables for vehicles others booked from you and vehicles you booked from others. You can approve or decline pending bookings of your vehicles by others. If a user or vehicle has been deleted, it shows as "Unknown" in the table. If a user decides to delete his account or is deleted by an admin, all of the vehicles associated with that account will be deleted as well.
- By clicking on the ID icon, you get to the bookings overview. Here you can add and edit information about yourself as well as delete your account. The payment options and the reset password button are only placeholders for now. You will be shown a respective notification if you click them.
- By clicking on the home icon, you will be returned to the map view.
- By clicking on the exit icon, you will be logged out of the application and returned to the landing/login page.

If you are logged in as an admin additional funcitonality becomes available to you:
- By clicking on the list icon, you will get to the users overview. Here you can view, edit and delete users and you can also create new user accounts.
- By clicking on the wheel icon, you will get to the vehicles overview. Here you can view, edit and delete all the vehicles of all the users.
