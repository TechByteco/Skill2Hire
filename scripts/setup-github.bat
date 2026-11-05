@echo off
setlocal enabledelayedexpansion
echo ========================================================
echo Skill2Hire - Automated GitHub Setup & Push
echo Account: TechByteco
echo Author: Saalimin N
echo Dedication: For students who are working towards their first opportunity.
echo ========================================================
echo.
cd /d "%~dp0\.."

set "GH_EXE=C:\Users\saali\AppData\Local\Programs\gh\bin\gh.exe"

echo Step 1: Checking Git identity...
git config user.name "Saalimin N"
git config user.email "TechByteco@users.noreply.github.com"
echo Git user configured: Saalimin N ^<TechByteco@users.noreply.github.com^>

echo.
echo Step 2: Initializing Git repository...
if not exist ".git" (
    git init
    git branch -M main
) else (
    echo Git repo already initialized.
    git branch -M main
)

echo.
echo Step 3: Staging all files...
git add -A

echo.
echo Step 4: Creating commit...
git commit -m "feat: author Saalimin N - For students who are working towards their first opportunity"

echo.
echo Step 5: Checking GitHub remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo No remote origin detected. Creating GitHub repository via gh CLI...
    call "%GH_EXE%" repo create Skill2Hire --public --source=. --remote=origin --push
) else (
    echo Remote origin already configured. Pushing changes to main...
    git push -u origin main
)

echo.
echo ========================================================
echo Setup and push completed!
echo ========================================================
pause
