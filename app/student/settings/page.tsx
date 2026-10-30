'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Settings,
  Sparkles,
  CheckCircle2,
  Save,
  Briefcase,
  Code2,
  Brain,
  Lock,
  Globe,
  Cpu,
  Zap,
  FolderGit2,
  ArrowRight,
  ExternalLink,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const ALL_ROLES = [
  'AI & Machine Learning Engineer',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Full Stack Developer',
  'Cloud DevOps Associate',
  'Software Developer',
  'Mobile App Developer',
  'Systems & Embedded Engineer'
];

const ALL_LANGUAGES = [
  'Python',
  'JavaScript',
  'TypeScript',
  'C++',
  'Java',
  'SQL',
  'Go',
  'Rust',
  'R',
  'Docker & Linux'
];

const ALL_DOMAINS = [
  {
    id: 'Data Science & AI',
    title: 'Data Science & AI',
    desc: 'Machine learning, predictive models, LLMs, NLP, and data engineering pipelines.',
    icon: Brain
  },
  {
    id: 'Cybersecurity & InfoSec',
    title: 'Cybersecurity & InfoSec',
    desc: 'Vulnerability assessment, network defense, SOC analysis, cryptography, and secure architectures.',
    icon: Lock
  },
  {
    id: 'Cloud & DevOps',
    title: 'Cloud & DevOps',
    desc: 'Kubernetes, Docker, CI/CD pipelines, AWS/GCP, infrastructure as code, and site reliability.',
    icon: Cpu
  },
  {
    id: 'Web & Mobile Development',
    title: 'Web & Mobile Development',
    desc: 'Full stack web architectures, React/Next.js, mobile apps, and scalable API systems.',
    icon: Globe
  },
  {
    id: 'Systems & Embedded Systems',
    title: 'Systems & Embedded Systems',
    desc: 'Low-latency C/C++, operating system kernels, IoT microcontrollers, and hardware interfaces.',
    icon: Zap
  }
];

export default function StudentSettingsPage() {
  const router = useRouter();
  const { profile, refreshProfile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);

  // Editable Form States
  const [interestedRoles, setInterestedRoles] = useState<string[]>([]);
  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>([]);
  const [interestedDomains, setInterestedDomains] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadStudentData() {
      setLoading(true);
      try {
        const res = await fetch(`/api/students/${studentId}`);
        const data = await res.json();
        if (data.student) {
          const s = data.student;
          setStudent(s);
          setInterestedRoles(s.interestedRoles || ['AI & Machine Learning Engineer', 'Full Stack Developer']);
          setProgrammingLanguages(s.programmingLanguages || ['Python', 'SQL', 'TypeScript']);
          setInterestedDomains(s.interestedDomains || ['Data Science & AI', 'Cybersecurity & InfoSec']);
          setBio(s.bio || '');
          setLocation(s.location || 'Austin, TX');
          setGithubUsername(s.githubUsername || '');
          setLinkedinUrl(s.linkedinUrl || 'https://linkedin.com/in/alexrivera-tech');
        }
      } catch (e) {
        console.error('Error loading student settings:', e);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, [studentId]);

  const toggleRole = (role: string) => {
    if (interestedRoles.includes(role)) {
      if (interestedRoles.length > 1) {
        setInterestedRoles(interestedRoles.filter(r => r !== role));
      }
    } else {
      setInterestedRoles([...interestedRoles, role]);
    }
  };

  const toggleLang = (lang: string) => {
    if (programmingLanguages.includes(lang)) {
      if (programmingLanguages.length > 1) {
        setProgrammingLanguages(programmingLanguages.filter(l => l !== lang));
      }
    } else {
      setProgrammingLanguages([...programmingLanguages, lang]);
    }
  };

  const toggleDomain = (domainId: string) => {
    if (interestedDomains.includes(domainId)) {
      if (interestedDomains.length > 1) {
        setInterestedDomains(interestedDomains.filter(d => d !== domainId));
      }
    } else {
      setInterestedDomains([...interestedDomains, domainId]);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interestedRoles,
          programmingLanguages,
          interestedDomains,
          bio,
          location,
          githubUsername: githubUsername.trim().replace(/^@/, ''),
          linkedinUrl: linkedinUrl.trim(),
          onboardingCompleted: true
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Preferences saved successfully! Your dashboard and recommendations are now optimized.');
        if (refreshProfile) await refreshProfile();
        setTimeout(() => setSuccessMsg(null), 5000);
      } else {
        setErrorMsg(data.error || 'Failed to save settings.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Loading your career settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/student/dashboard"
            className="text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1.5"
          >
            ← Back to Student Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 font-bold">Settings Engine Live</span>
          </div>
        </div>

        {/* Global Notifications */}
        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white">✕</button>
          </div>
        )}

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-center gap-2 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Header Banner */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">Student Profile &amp; Career Preferences</h1>
              <p className="text-xs text-slate-400">
                Tailor your target career roles, technical programming languages, and specialized domains.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* ========================================================================= */}
          {/* 1. CAREER ROLES                                                           */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Target Job Roles</span>
              </h2>
              <p className="text-xs text-slate-400">
                Select the roles you want to pursue. We calibrate job match percentages and roadmap steps to these titles.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {ALL_ROLES.map((role) => {
                const isSelected = interestedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => toggleRole(role)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{role}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 2. PROGRAMMING LANGUAGES                                                  */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-purple-400" />
                <span>Programming Language Skills</span>
              </h2>
              <p className="text-xs text-slate-400">
                Languages you actively code in. We tailor online sandbox exercises and code benchmarks to these languages.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {ALL_LANGUAGES.map((lang) => {
                const isSelected = programmingLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => toggleLang(lang)}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{lang}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 3. SPECIALIZED DOMAINS                                                    */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Brain className="w-4 h-4 text-emerald-400" />
                <span>Specialized Domains of Interest</span>
              </h2>
              <p className="text-xs text-slate-400">
                Focus domains for peer matching, open-source AI capstones, and targeted university placement drives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {ALL_DOMAINS.map((domain) => {
                const isSelected = interestedDomains.includes(domain.id);
                const Icon = domain.icon;
                return (
                  <button
                    key={domain.id}
                    type="button"
                    onClick={() => toggleDomain(domain.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 relative ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border-cyan-500/60 shadow-md'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 text-cyan-300 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 pr-6 space-y-1">
                      <h4 className={`text-xs font-black ${isSelected ? 'text-cyan-300' : 'text-white'}`}>
                        {domain.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 leading-snug">{domain.desc}</p>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3.5 right-3.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center font-bold">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 4. BIO & SOCIAL PRESENCE                                                  */}
          {/* ========================================================================= */}
          <div className="rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-7 shadow-xl space-y-4">
            <div className="space-y-1 border-b border-slate-800 pb-3">
              <h2 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-amber-400" />
                <span>Profile &amp; Proof of Work Links</span>
              </h2>
              <p className="text-xs text-slate-400">
                Visible to hiring managers and campus recruiters in talent searches.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Professional Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your technical background, projects you have built, and career ambitions..."
                  className="w-full p-3.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">GitHub Username</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono">@</span>
                    <input
                      type="text"
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="alexrivera-dev"
                      className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-300">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Submit Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <Link
              href="/student/dashboard"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-400/20 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4 text-slate-950" />
              <span>{isSaving ? 'Saving Changes...' : 'Save & Update Preferences'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
