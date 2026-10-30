@echo off
echo ========================================================
echo Skill2Hire - Vercel Automated Production Deployment
echo Team: saali (team_OqcvxzhUNaqUixv36BcL5Zfn)
echo Project: skill2hire
echo ========================================================
echo.
cd /d "%~dp0\.."

echo Step 1: Linking project 'skill2hire' under scope 'saali'...
call npx vercel link --project skill2hire --yes --scope saali

echo.
echo Step 2: Deploying to Production...
call npx vercel --prod --yes --scope saali

echo.
echo ========================================================
echo Deployment process completed!
echo ========================================================
pause
