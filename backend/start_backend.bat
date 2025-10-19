@echo off
echo ====================================
echo TechCommunity Backend Server
echo ====================================
echo.

cd /d "%~dp0"

REM Проверяем наличие виртуального окружения
if not exist "venv\" (
    echo Создаем виртуальное окружение...
    python -m venv venv
    echo.
)

REM Активируем виртуальное окружение
echo Активируем виртуальное окружение...
call venv\Scripts\activate.bat

REM Проверяем установлены ли зависимости
echo Проверяем зависимости...
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo Устанавливаем зависимости...
    pip install -r requirements.txt
    echo.
)

REM Запускаем сервер
echo Запускаем backend сервер...
echo Backend будет доступен по адресу: http://localhost:8000
echo API документация: http://localhost:8000/docs
echo.
echo Для остановки нажмите Ctrl+C
echo.

python main.py

pause
