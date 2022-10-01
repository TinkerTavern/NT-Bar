cd ../../venv/Scripts
run activate.bat
cd ../../
mkdir client_build
cd client_build
python -m PyInstaller --onefile --add-data "C:\Users\tomla\PycharmProjects\nt-bar\src\client\static;static" --add-data "C:\Users\tomla\PycharmProjects\nt-bar\src\client\templates;templates" ../src/client/app.py