@echo off
:start
set CURRENT_TIME=%DATE% %TIME%
git add .
git commit -m "Auto commit from GitHub Actions at %CURRENT_TIME%"
git push
timeout /t 20
goto start
