# Skill2Hire — Intelligent Campus Placement & Skill Verification Platform

**Skill2Hire** is an AI-powered enterprise platform closing the critical gap between academic curricula and industry hiring demands. It equips students with AI-verified skill credentials, offers universities real-time syllabus gap heatmaps, and provides enterprise recruiters with pre-vetted campus talent.

**Author / Creator**: Built by **Saalimin N**  
*For students who are working towards their first opportunity.*

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
`ash
npm install
`

### 2. Configure Environment Variables
Copy .env.example to .env.local:
`ash
cp .env.example .env.local
`
Key parameters:
- PORT=9000
- NEXT_PUBLIC_APP_URL=http://localhost:9000
- JWT_SECRET=your_jwt_secret_here
- GEMINI_API_KEY=optional_gemini_api_key (Enables frontier LLM evaluation for interview coaching and resume analysis)

### 3. Run Development Server
`ash
npm run dev -- -p 9000
`
Open **[http://localhost:9000](http://localhost:9000)** in your browser.

---

## 🐳 Docker Deployment

Run the complete production build with Docker Compose:
`ash
docker compose up --build -d
`
Access the application on port 9000.

---

## 🔑 Key Personas & Features

### 🎓 For Students
- **Verified Skill Radar**: Take structured verification assessments to earn cryptographic skill badges.
- **Live Coding Arena**: Practice problems in Python, JavaScript, C++, and Java executed in secure sandboxes (Node VM & Piston API).
- **AI Interview Coach**: Practice technical and behavioral questions evaluated across technical correctness, relevance, structure, and communication.
- **AI Resume Matcher**: Analyze resume text against job requirements to receive a match percentage, skill gap breakdown, and recommended capstone projects.

### 🏫 For Colleges & Universities (TPO)
- **Curriculum Gap Intelligence**: Cross-reference academic syllabi against active industry demand to pinpoint critical gaps.
- **Cohort Readiness Heatmap**: Inspect batch proficiency percentages across Computer Science, Data Science, and IT departments.
- **Placement Drive Coordination**: Manage on-campus and virtual recruitment drives directly with corporate partners.

### 🏢 For Recruiters & Enterprises
- **Pre-Vetted Candidate Pipeline**: Filter candidates by verified skills, minimum CGPA, and specific technical milestones.
- **Demand Signals**: Publish upcoming hiring quotas and skill requirements to partner universities.
- **Real-Time Applications**: Review applicant portfolios, verified assessment scores, and AI match scores.

---

## 🛡️ Security Architecture
- **Cryptographic JWT Verification**: Edge middleware enforces HMAC-SHA256 signature verification via the native Web Crypto API (crypto.subtle).
- **Role-Based Access Control**: Strict page and API route guards for /student, /college, /recruiter, and /admin.
- **Sandboxed Code Execution**: Dual-tier execution engine using isolated Node VM environments and containerized execution APIs.
