@echo off
echo Killing process on port 8081...

for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8081 "') do (
    echo Found PID: %%a
    taskkill /PID %%a /F
)

echo Done.
pause
