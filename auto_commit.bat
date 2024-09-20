@REM @echo off
@REM :start
@REM git add .
@REM git commit -m "Automated commit"
@REM git push
@REM timeout /t 60
@REM goto start


@echo off
:start
git add .
git commit -m "Automated commit"
git push
ping -n 1 -w 10 127.0.0.1 > nul
goto start
