@echo off
call .\venv_wapdev2\Scripts\activate
python .\wapdev2\manage.py createsuperuser
pause
