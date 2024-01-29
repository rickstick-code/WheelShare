@echo off
setlocal EnableDelayedExpansion

set API_URL=http://localhost:8000/api/users/
set DATA_FORMAT=application/json

:: User 1
set DATA={\"username\":\"Lukas Meier\",\"password1\":\"test\",\"password2\":\"test\",\"email\":\"lukas.meier@beispiel.at\",\"address\":\"Herrengasse 10, 8010 Graz\",\"phone_number\":\"06991234567\"}
curl -X POST %API_URL% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"

:: User 2
set DATA={\"username\":\"Sophie Baumgartner\",\"password1\":\"test\",\"password2\":\"test\",\"email\":\"sophie.baumgartner@beispiel.at\",\"address\":\"Kaiserfeldgasse 19, 8010 Graz\",\"phone_number\":\"06601234567\"}
curl -X POST %API_URL% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"

:: User 3
set DATA={\"username\":\"Max Klein\",\"password1\":\"test\",\"password2\":\"test\",\"email\":\"max.klein@beispiel.at\",\"address\":\"Schmiedgasse 26, 8010 Graz\",\"phone_number\":\"06991123456\"}
curl -X POST %API_URL% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"

:: User 4
set DATA={\"username\":\"Eva Gruber\",\"password1\":\"test\",\"password2\":\"test\",\"email\":\"eva.gruber@beispiel.at\",\"address\":\"Getreidegasse 9, 5020 Salzburg\",\"phone_number\":\"06601122334\"}
curl -X POST %API_URL% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"

:: User 5
set DATA={\"username\":\"Felix Schmidt\",\"password1\":\"test\",\"password2\":\"test\",\"email\":\"felix.schmidt@beispiel.at\",\"address\":\"Maria-Theresien-Strasse 18, 6020 Innsbruck\",\"phone_number\":\"06998877665\"}
curl -X POST %API_URL% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"



set API_URL2=http://localhost:8000/api/types/

:: Define 10 vehicle types
set TYPES=("Bike" "Car" "E-Car" "Motorcycle" "Scooter" "Truck" "Van" "Bus" "Bicycle" "Tractor")

:: Create each type
for %%T in %TYPES% do (
    set DATA={\"name\":\"%%~T\"}
    curl -X POST %API_URL2% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"
)

set API_URL3=http://localhost:8000/api/vehicles/

:: Define vehicle data (model, seats, vignette, owner, type, latitude, longitude, comment)
:: Replace with actual values
set "VEHICLE1=BMW 3 Series,5,false,1,Car,47.06724361421706,15.442355934715009,Smooth and comfortable ride"
set "VEHICLE2=Giant Propel,1,false,2,Bike,47.070867,15.439504, - "
set "VEHICLE3=Tesla Model S,4,true,3,E-Car,47.069014,15.438624,Sleek design with autopilot"
set "VEHICLE4=Yamaha YZF-R1,2,false,1,Motorcycle,47.072635,15.434786, - "
set "VEHICLE5=Peugeot Speedfight,2,false,2,Scooter,47.075123,15.437890, - "
set "VEHICLE6=MAN TGS,3,false,3,Truck,47.071234,15.440987, - "
set "VEHICLE7=Ford Transit,8,false,4,Van,47.068765,15.442345, - "
set "VEHICLE8=Mercedes-Benz Tourismo,50,false,5,Bus,47.069876,15.441234, - "
set "VEHICLE9=Trek Domane,1,false,1,Bicycle,47.070001,15.444456, - "
set "VEHICLE10=John Deere 6120M,1,false,2,Tractor,47.072200,15.438500, - "
set "VEHICLE11=Chevrolet Impala,5,false,3,Car,47.067890,15.440321, - "
set "VEHICLE12=Nissan Leaf,4,true,4,E-Car,47.065432,15.437213, - "
set "VEHICLE13=Hyundai Sonata,5,false,5,Car,47.069321,15.435678,Comfortable and affordable"
set "VEHICLE14=Mazda CX-5,5,false,1,Car,47.068210,15.439654, - "
set "VEHICLE15=Kia Optima,5,false,2,Car,47.071234,15.432123, - "

:: Create each vehicle
for /l %%i in (1,1,15) do (
    set VEHICLE=!VEHICLE%%i!
    if not "!VEHICLE!"=="" (
        for /f "tokens=1-8 delims=," %%a in ("!VEHICLE!") do (
            set MODEL=%%a
            set SEATS=%%b
            set VIGNETTE=%%c
            set OWNER=%%d
            set TYPE=%%e
            set LAT=%%f
            set LON=%%g
            set COMMENT=%%h
            set DATA={\"model\":\"!MODEL!\",\"number_of_seats\":!SEATS!,\"vignette\":!VIGNETTE!,\"type\":[{\"name\":\"!TYPE!\"}],\"comment\":\"!COMMENT!\",\"owner\":[!OWNER!],\"lan\":!LAT!,\"lon\":!LON!}
            curl -X POST %API_URL3% -H "Content-Type: %DATA_FORMAT%" -d "!DATA!"
        )
    )
)


endlocal
