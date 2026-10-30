# Skill2Hire — Vercel Deployment Guide

This guide covers how to deploy Skill2Hire to **Vercel** with zero configuration issues.

---

## Method 1: Deploy via Vercel Dashboard & GitHub (Recommended)

This is the standard and most reliable method:

1. **Push your code to GitHub**:
   If not already pushed, initialize or commit your latest changes to your GitHub repository:
   ```bash
   git add .
   git commit -m "feat: vercel deployment preparation and serverless compatibility"
   git push origin main
   ```

2. **Open Vercel**:
   Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.

3. **Import Project**:
   - Find your **Skill2Hire** repository and click **Import**.
   - **Framework Preset**: Vercel will automatically detect `Next.js`.
   - **Root Directory**: `./` (leave default).

4. **Configure Environment Variables** (Optional but recommended):
   Expand the **Environment Variables** section and add:

   | Key | Example Value | Description |
   |---|---|---|
   | `JWT_SECRET` | `skill2hire_super_secret_session_token_2026` | Token encryption secret |
   | `NEXTAUTH_SECRET` | `skill2hire_auth_master_key_2026` | Auth session key |
   | `NEXT_PUBLIC_APP_URL` | `https://your-app-name.vercel.app` | Production public URL |
   | `RESEND_API_KEY` | *(optional)* `re_...` | For live transactional emails |
   | `TWILIO_ACCOUNT_SID` | *(optional)* `AC...` | For live SMS verification |

   *(Note: The codebase includes default fallbacks so your build will succeed even before you set custom keys).*

5. **Deploy**:
   Click **Deploy**.
   Vercel will run `next build`, bundle all serverless functions and vector SVG assets, and output your live URL (e.g. `https://skill2hire.vercel.app`).

---

## Method 2: Deploy via Vercel CLI (Direct from Terminal)

You can also deploy directly from your local terminal using the official Vercel CLI:

1. Open **Command Prompt** or **PowerShell** inside `C:\Users\saali\Skill2Hire`:
   ```powershell
   cd C:\Users\saali\Skill2Hire
   ```

2. Run the Vercel deployment command:
   ```powershell
   npx vercel link --project skill2hire --yes --scope saali
   npx vercel --prod --yes --scope saali
   ```

   *(Or simply run `scripts\deploy-vercel.bat`)*

3. Follow the quick interactive prompts:
   - **Set up and deploy?** Press `y` and Enter.
   - **Which scope do you want to deploy to?** Select your personal account or team.
   - **Link to existing project?** Type `n` (or `y` if you previously linked it).
   - **What's your project's name?** `skill2hire` (or press Enter).
   - **In which directory is your code located?** `./` (press Enter).
   - **Want to modify build settings?** Type `n` (default `next build` is used).

4. Deploy to Production:
   Once the preview deployment completes, promote it to production with:
   ```powershell
   npx vercel --prod
   ```

---

## Serverless Optimizations Applied

The codebase has been pre-configured with the following Vercel-ready optimizations:
- **Serverless-Safe Database (`lib/db.ts`)**: File operations catch read-only Lambda restrictions and automatically fall back to `/tmp/skill2hire_db.json` and in-memory caching.
- **Resilient Build Authentication (`lib/authMiddleware.ts`)**: Avoids fatal build-time crashes if `JWT_SECRET` is not immediately configured in the dashboard.
- **Output File Tracing (`next.config.mjs`)**: Configured `outputFileTracingIncludes` to ensure `data/db.json` and all local course thumbnails & brand SVGs are bundled into serverless functions.
- **Production Asset Caching (`vercel.json`)**: Configured immutable caching headers for all local vector assets.
