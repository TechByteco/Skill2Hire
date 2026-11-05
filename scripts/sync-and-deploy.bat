@echo off
setlocal enabledelayedexpansion
echo =========================================================================
echo Skill2Hire - 1-Click Complete Sync & Production Deployment
echo Author: Saalimin N
echo Tagline: For students who are working towards their first opportunity.
echo GitHub: https://github.com/TechByteco/Skill2Hire
echo Vercel Scope: saali (team_OqcvxzhUNaqUixv36BcL5Zfn)
echo =========================================================================
echo.
cd /d "%~dp0\.."

set "GH_EXE=C:\Users\saali\AppData\Local\Programs\gh\bin\gh.exe"

echo [1/4] Ensuring Git Identity...
git config user.name "Saalimin N"
git config user.email "TechByteco@users.noreply.github.com"
echo Configured: Saalimin N ^<TechByteco@users.noreply.github.com^>

echo.
echo [2/4] Staging and Committing Changes...
git add -A
git commit -m "feat: author attribution Saalimin N - For students who are working towards their first opportunity"
if errorlevel 1 (
    echo Note: No new local uncommitted file changes detected.
) else (
    echo Successfully committed all updates.
)

echo.
echo [3/4] Pushing to GitHub (origin main)...
git push -u origin main
if errorlevel 1 (
    echo Push failed, checking repository setup...
    call "%GH_EXE%" repo create Skill2Hire --public --source=. --remote=origin --push
) else (
    echo GitHub repository updated successfully!
)

echo.
echo [4/4] Deploying directly to Vercel Production...
call npx vercel link --project skill2hire --yes --scope saali
call npx vercel --prod --yes --scope saali

echo.
echo =========================================================================
echo Deployment and Synchronization Complete!
echo Live Website: https://skill2hire.vercel.app
echo =========================================================================
pause
