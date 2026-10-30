'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Zap,
  GraduationCap,
  Building2,
  Users,
  Layers,
  Award,
  Target,
  Code2,
  Search,
  BookOpen,
  Filter,
  BarChart3,
  HelpCircle,
  Terminal,
  Cpu,
  Check,
  X
} from 'lucide-react';

interface Competitor {
  id: string;
  name: string;
  category: 'mooc' | 'tech' | 'enterprise' | 'assessment';
  categoryLabel: string;
  features: string;
  targetUsers: string;
  strengths: string;
  weaknesses: string;
  whereSkill2HireWins: string;
  logoBadgeColor: string;
}

const COMPETITORS: Competitor[] = [
  {
    id: 'coursera',
    name: 'Coursera',
    category: 'mooc',
    categoryLabel: 'Global MOOC',
    features: 'University-accredited degrees, professional certificates, guided projects, and video lectures.',
    targetUsers: 'University students, career switchers, and corporate enterprise teams.',
    strengths: 'World-renowned university brand prestige (Stanford, Yale) and authoritative tech company credentials (Google, IBM).',
    weaknesses: 'Long, theoretical video modules with low course completion rates; disconnected from real-time corporate hiring pipelines; certificates do not verify proctored hands-on coding proficiency.',
    whereSkill2HireWins: 'Automated JD-to-Skill gap breakdown in seconds, instant in-browser code execution sandbox, and direct recruiter talent pipelines with verified readiness scores.',
    logoBadgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  {
    id: 'linkedin_learning',
    name: 'LinkedIn Learning',
    category: 'mooc',
    categoryLabel: 'Professional Video L&D',
    features: 'Bite-sized video lessons across business, technology, and creative domains with LinkedIn profile badges.',
    targetUsers: 'Corporate working professionals and job seekers with active LinkedIn accounts.',
    strengths: 'Deep integration into the world’s largest professional social network and vast video course repository.',
    weaknesses: 'Purely passive video watching with zero hands-on coding compilers; no diagnostic JD matching; profile completion certificates are unproctored and rarely trusted as proof of skill by engineering leads.',
    whereSkill2HireWins: 'Real proctored coding assessments with unit tests, verified cryptographic skill credentials, and personalized learning roadmaps tailored directly to specific open roles.',
    logoBadgeColor: 'bg-sky-100 text-sky-800 border-sky-200'
  },
  {
    id: 'udemy',
    name: 'Udemy',
    category: 'mooc',
    categoryLabel: 'Marketplace',
    features: 'Massive open marketplace of 200,000+ on-demand video tutorials uploaded by individual creators.',
    targetUsers: 'Self-directed learners, hobbyists, budget-conscious career switchers.',
    strengths: 'Extremely affordable pricing, rapid coverage of emerging tech topics, and massive instructor variety.',
    weaknesses: 'Zero quality control or standardization; widespread outdated tutorials; no standardized testing or proctoring; completion certificates carry almost zero employer hiring weight.',
    whereSkill2HireWins: 'Curated, university-standardized course curriculum, verified competency passports, and institutional alignment connecting college placement cells to verified employers.',
    logoBadgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  {
    id: 'edx',
    name: 'edX',
    category: 'mooc',
    categoryLabel: 'Academic MOOC',
    features: 'University-grade academic courses, MicroBachelors, MicroMasters, and executive education series.',
    targetUsers: 'Academically inclined learners, graduate students, and executive upskillers.',
    strengths: 'Elite academic rigor partnering with top institutions like Harvard, MIT, and Oxford.',
    weaknesses: 'High drop-out rates; rigid academic pacing with excessive academic theory; completely decoupled from practical, day-to-day corporate entry-level job descriptions.',
    whereSkill2HireWins: 'Agile role-specific modules with integrated compiler practice, lightweight beginner-friendly roadmaps for internships, and real-time corporate demand signals.',
    logoBadgeColor: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  {
    id: 'pluralsight',
    name: 'Pluralsight',
    category: 'tech',
    categoryLabel: 'Developer Training',
    features: 'Skill IQ assessments, Role IQ paths, developer-focused video libraries, and enterprise IT sandboxes.',
    targetUsers: 'Mid-to-senior software engineers, cloud architects, and enterprise IT engineering teams.',
    strengths: 'Deep developer focus, authoritative tech authors, and structured Skill IQ adaptive benchmark testing.',
    weaknesses: 'Steep learning curve that intimidates college freshers; expensive enterprise subscription; zero placement or college campus recruitment infrastructure.',
    whereSkill2HireWins: 'Beginner-friendly roadmaps designed specifically for college students seeking internships, transparent campus placement portals, and a permanent free learning tier.',
    logoBadgeColor: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  {
    id: 'skillshare',
    name: 'Skillshare',
    category: 'mooc',
    categoryLabel: 'Creative Platform',
    features: 'Project-focused video workshops in design, illustration, marketing, freelancing, and creative arts.',
    targetUsers: 'Designers, content creators, freelancers, and lifestyle entrepreneurs.',
    strengths: 'Vibrant creative community, hands-on creative project submissions, and visually engaging lessons.',
    weaknesses: 'Virtually zero technical depth (no software development, cloud infrastructure, or data engineering); no accredited assessments; no corporate hiring relevance.',
    whereSkill2HireWins: 'Enterprise-grade technical training (DSA, C++, Cloud, AI/ML, SQL) paired with verified technical competency testing and direct employer hiring alignment.',
    logoBadgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  {
    id: 'degreed',
    name: 'Degreed',
    category: 'enterprise',
    categoryLabel: 'Enterprise LXP',
    features: 'Enterprise Learning Experience Platform (LXP) tracking employee skills, internal career mobility, and learning pathways.',
    targetUsers: 'Enterprise HR leadership, corporate L&D directors, and internal corporate workforces.',
    strengths: 'Unified skill taxonomy, comprehensive tracking of internal corporate learning assets across disparate vendors.',
    weaknesses: 'Strictly a closed B2B platform completely inaccessible to college students or external candidates; does not create original technical courses or verify raw coding ability.',
    whereSkill2HireWins: 'Unified open ecosystem connecting undergraduate students, college placement cells, and corporate recruiters with native curriculum and live compiler testing.',
    logoBadgeColor: 'bg-teal-100 text-teal-800 border-teal-200'
  },
  {
    id: 'three_sixty_learning',
    name: '360Learning',
    category: 'enterprise',
    categoryLabel: 'Collaborative LMS',
    features: 'Collaborative learning LMS empowering internal corporate teams to create peer-to-peer training courses.',
    targetUsers: 'Mid-market and enterprise internal training managers, sales enablement teams.',
    strengths: 'High internal employee engagement, intuitive course authoring, and social collaborative learning.',
    weaknesses: 'Limited strictly to internal employee training; no standardized external competency benchmarks; no external job matching or campus hiring pipeline.',
    whereSkill2HireWins: 'Standardized third-party skill credentials, automated external JD parsing, and direct placement pipeline connecting universities to corporate employers.',
    logoBadgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
  },
  {
    id: 'docebo',
    name: 'Docebo',
    category: 'enterprise',
    categoryLabel: 'Corporate LMS',
    features: 'AI-powered enterprise LMS for compliance training, enterprise workforce onboarding, and customer education.',
    targetUsers: 'Corporate enterprise HR, compliance officers, and partner enablement directors.',
    strengths: 'Robust compliance audits, multi-tenant enterprise administration, and scalable learning tracking.',
    weaknesses: 'Traditional top-down compliance LMS; clunky, uninspiring student experience; completely detached from technical coding sandboxes or campus hiring.',
    whereSkill2HireWins: 'Modern developer-first learning experience with interactive browser compiler, role-specific roadmaps, and campus-to-corporate hiring automation.',
    logoBadgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  {
    id: 'imocha',
    name: 'iMocha',
    category: 'assessment',
    categoryLabel: 'Assessment Tool',
    features: 'Pre-employment skill testing, coding sandboxes, AI proctoring, and talent screening analytics.',
    targetUsers: 'Corporate talent acquisition teams, recruitment agencies, and technical screeners.',
    strengths: 'Extensive assessment question bank, automated code evaluation, and cheating-prevention proctoring.',
    weaknesses: 'Purely a punitive gatekeeper/screening tool. It rejects candidates who fail without providing any learning modules, notes, or roadmaps to help them bridge the gap.',
    whereSkill2HireWins: 'Closed-loop "Assess -> Diagnose Skill Deficit -> Learn Free Modules -> Retest -> Get Placed" ecosystem. Skill2Hire builds talent rather than merely filtering it out!',
    logoBadgeColor: 'bg-pink-100 text-pink-800 border-pink-200'
  }
];

const COMPARISON_CRITERIA = [
  {
    title: 'Automatic JD-to-Skill Mapping',
    desc: 'Parses job descriptions automatically and computes personalized candidate skill gap breakdown.',
    s2h: true,
    coursera: false,
    linkedin: false,
    udemy: false,
    pluralsight: false,
    imocha: 'Partial (Assessment only)'
  },
  {
    title: 'Beginner-Friendly Roadmaps for Internships',
    desc: 'Curated, structured milestone roadmaps specifically for college freshers seeking their first job/internship.',
    s2h: true,
    coursera: 'Partial',
    linkedin: false,
    udemy: false,
    pluralsight: false,
    imocha: false
  },
  {
    title: 'Role-Specific Practice with Code Sandbox',
    desc: 'In-browser compiler with live multi-language execution (JS, Python, C++, Java) for immediate hands-on practice.',
    s2h: true,
    coursera: 'Partial (Separate labs)',
    linkedin: false,
    udemy: false,
    pluralsight: true,
    imocha: true
  },
  {
    title: 'Verified Competency Microcredentials',
    desc: 'Certificates backed by proctored timed assessments, coding test cases, and cryptographic verification codes.',
    s2h: true,
    coursera: 'Partial (No code proctor)',
    linkedin: false,
    udemy: false,
    pluralsight: true,
    imocha: true
  },
  {
    title: 'Employer Talent Readiness Dashboard',
    desc: 'Recruiters can filter candidates by verified proficiency levels, readiness scores, and college cohorts.',
    s2h: true,
    coursera: false,
    linkedin: 'Partial (Recruiter search)',
    udemy: false,
    pluralsight: false,
    imocha: true
  },
  {
    title: 'Closed-Loop Education-to-Hiring Ecosystem',
    desc: 'A single unified platform aligning Student learning, College placement tracking, and Corporate hiring.',
    s2h: true,
    coursera: false,
    linkedin: false,
    udemy: false,
    pluralsight: false,
    imocha: false
  }
];

export default function DifferentiationPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredCompetitors = COMPETITORS.filter(c => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesQuery = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.features.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.weaknesses.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.whereSkill2HireWins.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* HERO HEADER */}
        <div className="text-center max-w-4xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-100 text-primary-800 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>Strategic Competitive Analysis & Differentiation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            How Skill2Hire Outperforms Traditional Portals & Course Platforms
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
            Traditional platforms either <strong>only host videos</strong> (Coursera, Udemy), 
            <strong>only screen candidates</strong> (iMocha), or <strong>only aggregate resumes</strong> (LinkedIn, Unstop). 
            <strong> Skill2Hire is the first closed-loop intelligence engine</strong> that connects learning, diagnostic testing, and corporate placement in a single unified workflow.
          </p>
        </div>

        {/* 6 CORE PILLARS OF SKILL2HIRE */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary-600">Our Strategic Moat</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              The 6 Core Pillars Where Skill2Hire Wins
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl mx-auto">
              Built from first principles to bridge the gap between academic education and industry hiring reality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">1. Automatic JD-to-Skill Mapping</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Paste any job description or select an open campus role. Our semantic parser breaks it down into exact required competencies and computes candidate readiness instantly.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-semibold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-md">
                  Replaces guesswork with math
                </span>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">2. Beginner-Friendly Roadmaps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step milestone roadmaps built specifically for university students and career switchers to progress from beginner to internship-ready in 4 to 12 weeks.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                  Curated for college placement
                </span>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Terminal className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">3. Role-Specific Practice & Sandboxes</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                12 full courses with structured modules, downloadable cheatsheets, ASCII diagrams, mindmaps, and an integrated in-browser multi-language compiler.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                  100% active, zero passive fluff
                </span>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">4. Verified Skill Credentials</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No self-declared bluffing. Students earn Verified Badges and verifiable credentials only by passing timed assessments and automated unit test suites.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                  Platform-verified via Skill2Hire assessment
                </span>
              </div>
            </div>

            {/* Pillar 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">5. Employer Readiness Dashboard</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recruiters bypass the resume black hole. Filter talent by verified skill thresholds (e.g. "Python Intermediate + DSA Advanced"), CGPA, and readiness scores.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-semibold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                  Zero unverified resumes
                </span>
              </div>
            </div>

            {/* Pillar 6 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">6. Single Unified Closed Loop</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than bouncing between 4 different disconnected tools (Coursera for videos, LeetCode for practice, HackerRank for tests, and LinkedIn for jobs), do it all in one platform.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
                  The All-in-One Operating System
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 10-PLATFORM INTERACTIVE COMPETITIVE MATRIX */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-primary-600">Deep-Dive Analysis</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                10-Platform Competitive Comparison
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Explore how Skill2Hire systematically overcomes the inherent structural limitations of established market players.
              </p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All (10)
              </button>
              <button
                onClick={() => setSelectedCategory('mooc')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'mooc'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                MOOCs & Video (5)
              </button>
              <button
                onClick={() => setSelectedCategory('tech')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'tech'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Tech Specialists (1)
              </button>
              <button
                onClick={() => setSelectedCategory('enterprise')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'enterprise'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Enterprise L&D (3)
              </button>
              <button
                onClick={() => setSelectedCategory('assessment')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === 'assessment'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Testing Tools (1)
              </button>
            </div>
          </div>

          {/* Competitor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCompetitors.map(competitor => (
              <div 
                key={competitor.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm flex flex-col justify-between hover:border-primary-300 transition-all space-y-5"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black flex items-center justify-center text-sm shadow-sm">
                        {competitor.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-slate-900">{competitor.name}</h3>
                        <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-full border mt-0.5 ${competitor.logoBadgeColor}`}>
                          {competitor.categoryLabel}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="space-y-3 text-xs text-slate-600">
                    <div>
                      <strong className="text-slate-800 font-semibold block mb-0.5">Core Features:</strong>
                      <p className="leading-relaxed">{competitor.features}</p>
                    </div>

                    <div>
                      <strong className="text-slate-800 font-semibold block mb-0.5">Primary Strengths:</strong>
                      <p className="leading-relaxed text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                        ✓ {competitor.strengths}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-800 font-semibold block mb-0.5">Critical Weaknesses:</strong>
                      <p className="leading-relaxed text-rose-800 bg-rose-50/70 p-2 rounded-lg border border-rose-100">
                        ✗ {competitor.weaknesses}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Where Skill2Hire Beats It */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="bg-primary-50/80 rounded-2xl p-4 border border-primary-200/60 space-y-1">
                    <div className="flex items-center gap-1.5 text-primary-900 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-primary-600" />
                      <span>Where Skill2Hire Beats {competitor.name}</span>
                    </div>
                    <p className="text-xs text-primary-950 font-medium leading-relaxed">
                      {competitor.whereSkill2HireWins}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* FEATURE MATRIX TABLE */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-primary-600">Head-to-Head Checklist</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Feature Capabilities Matrix
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Direct feature comparison between Skill2Hire and industry alternatives.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider bg-slate-50/60">
                  <th className="py-3.5 px-4 font-bold text-slate-900">Capability</th>
                  <th className="py-3.5 px-4 font-bold text-primary-700 bg-primary-50/80 text-center rounded-t-lg">Skill2Hire</th>
                  <th className="py-3.5 px-3 text-center">Coursera</th>
                  <th className="py-3.5 px-3 text-center">LinkedIn</th>
                  <th className="py-3.5 px-3 text-center">Udemy</th>
                  <th className="py-3.5 px-3 text-center">Pluralsight</th>
                  <th className="py-3.5 px-3 text-center">iMocha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {COMPARISON_CRITERIA.map((crit, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 pr-6">
                      <strong className="block text-slate-900 font-bold text-sm mb-0.5">{crit.title}</strong>
                      <span className="text-slate-500 text-[11px] leading-relaxed">{crit.desc}</span>
                    </td>
                    <td className="py-4 px-4 text-center bg-primary-50/40 font-bold text-primary-700">
                      <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-extrabold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Included</span>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-center">
                      {crit.coursera === true ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : crit.coursera === 'Partial' ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Partial</span>
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-3 text-center">
                      {crit.linkedin === true ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : crit.linkedin === 'Partial' ? (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Partial</span>
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-3 text-center">
                      {crit.udemy === true ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-3 text-center">
                      {crit.pluralsight === true ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                    <td className="py-4 px-3 text-center">
                      {crit.imocha === true ? (
                        <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                      ) : crit.imocha === 'Partial (Assessment only)' ? (
                        <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Test only</span>
                      ) : (
                        <X className="w-4 h-4 text-slate-300 mx-auto" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* CALL TO ACTION HUB */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-400 block">Experience The Difference</span>
            <h2 className="text-2xl sm:text-4xl font-black">
              Ready to See Skill2Hire in Action?
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl mx-auto">
              Test-drive our 12 interactive courses, real-time code sandbox, and employer skill matcher today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link
              href="/student/dashboard"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-center space-y-2 group"
            >
              <Target className="w-6 h-6 text-primary-400 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-white">JD-to-Skill Matcher</h3>
              <p className="text-[11px] text-slate-300">Compute candidate gap breakdown on real job descriptions.</p>
            </Link>

            <Link
              href="/courses"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-center space-y-2 group"
            >
              <BookOpen className="w-6 h-6 text-emerald-400 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-white">All 12 In-Depth Courses</h3>
              <p className="text-[11px] text-slate-300">Explore modules, study notes, cheat sheets, and coding tasks.</p>
            </Link>

            <Link
              href="/student/compiler"
              className="p-5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 transition-all text-center space-y-2 group"
            >
              <Terminal className="w-6 h-6 text-amber-400 mx-auto group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-sm text-white">Online Compiler Sandbox</h3>
              <p className="text-[11px] text-slate-300">Execute Python, C++, Java, and JavaScript live in browser.</p>
            </Link>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary-500 to-indigo-600 hover:from-primary-600 hover:to-indigo-700 text-white font-bold text-sm shadow-lg shadow-primary-500/25 transition-all"
            >
              <span>Back to Skill2Hire Platform Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
