@echo off
call .\venv_wapdev2\Scripts\activate
python .\wapdev2\manage.py makemigrations
python .\wapdev2\manage.py migrate
pause
