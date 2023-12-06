REM Activate the Python environment
call Python\Environments\wheelshare\Scripts\activate

REM flush data
python Django\wheelshare\manage.py flush

REM flush data
python Django\wheelshare\manage.py makemigrations

REM Run the "example_data" command
python Django\wheelshare\manage.py example_data

REM Run the Django development server
python Django\wheelshare\manage.py runserver

REM Deactivate the Python environment (optional, depending on your needs)

pause