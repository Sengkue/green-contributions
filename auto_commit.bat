@echo off
:start
git add .
git commit -m "Automated commit"
git push
timeout /t 60
goto start