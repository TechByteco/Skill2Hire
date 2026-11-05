'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Skill2HireSymbol } from '@/components/Skill2HireLogo';
import GoogleSignInModal from '@/components/GoogleSignInModal';
import StudentOnboardingModal from '@/components/StudentOnboardingModal';
import {
  GraduationCap,
  Building2,
  Briefcase,
  ShieldCheck,
  Zap,
  Code2,
  FileCheck,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  ChevronRight,
  Star,
  Users,
  Award,
  Mail,
  Lock,
  Flame,
  Check
} from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const { switchPersona, login, loginWithGmail, user, profile, refreshProfile } = useAuth();

  // Hero Login Section States
  const [googleModalOpen, setGoogleModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('student');
  const [loginEmail, setLoginEmail] = useState('alex.rivera@student.skill2hire.com');
  const [loginPassword, setLoginPassword] = useState('demo123');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Onboarding Modal State
  const [onboardingOpen, setOnboardingOpen] = useState(false);

  const handleRoleSelect = (role: UserRole) => {
    setLoginRole(role);
    setLoginError('');
    if (role === 'student') {
      setLoginEmail('alex.rivera@student.skill2hire.com');
      setLoginPassword('demo123');
    } else if (role === 'college') {
      setLoginEmail('admin@apexuniversity.edu');
      setLoginPassword('demo123');
    } else if (role === 'company') {
      setLoginEmail('recruiter@technova.com');
      setLoginPassword('demo123');
    }
  };

  const handleHeroLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res: any = await login(loginEmail, loginPassword);
      if (res.success && res.user) {
        if (res.user.role === 'student') {
          // If onboarding not completed, prompt onboarding
          if (!res.profile?.onboardingCompleted) {
            setOnboardingOpen(true);
          } else {
            router.push('/student/dashboard');
          }
        } else if (res.user.role === 'college') {
          router.push('/college/dashboard');
        } else if (res.user.role === 'company') {
          router.push('/recruiter/dashboard');
        } else {
          router.push('/admin/dashboard');
        }
      } else {
        setLoginError(res.error || 'Invalid email or password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleAccountSelected = async (email: string, name: string) => {
    setGoogleModalOpen(false);
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res: any = await loginWithGmail(email);
      if (res.success && res.user) {
        if (res.user.role === 'student' && !res.profile?.onboardingCompleted) {
          setOnboardingOpen(true);
        } else {
          router.push(res.user.role === 'company' ? '/recruiter/dashboard' : `/${res.user.role}/dashboard`);
        }
      } else if (res.isNewUser) {
        router.push(`/signup?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`);
      } else {
        setLoginError(res.error || 'Google login failed.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication error.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickDemo = async (role: 'student' | 'college' | 'company' | 'admin') => {
    await switchPersona(role);
    if (role === 'student') router.push('/student/dashboard');
    else if (role === 'college') router.push('/college/dashboard');
    else if (role === 'company') router.push('/recruiter/dashboard');
    else if (role === 'admin') router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-blue-600/20 to-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[500px] bg-gradient-to-b from-blue-600/10 to-indigo-700/10 blur-[120px] rounded-full" />
      </div>

      {/* Navigation Bar */}
      <nav className="relative z-20 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <Skill2HireSymbol size="sm" />
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Skill<span className="text-indigo-400">2</span>Hire
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Platform Features</a>
            <a href="#students" className="hover:text-white transition-colors">For Students</a>
            <a href="#colleges" className="hover:text-white transition-colors">For Colleges</a>
            <a href="#recruiters" className="hover:text-white transition-colors">For Recruiters</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href={`/${user.role === 'company' ? 'recruiter' : user.role}/dashboard`}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-1.5"
                >
                  Get Started
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-semibold mb-8 animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          Next-Gen AI Campus Placement & Skill Verification Platform
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.15]">
          Closing the Gap Between <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            College Curricula & Industry Hiring
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Skill2Hire connects universities, ambitious students, and enterprise recruiters through 
          verified skill diagnostics, real-time curriculum heatmaps, AI interview coaching, and certified talent pipelines.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/signup"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold text-base shadow-xl shadow-indigo-500/25 transition-all flex items-center gap-2"
          >
            Create Your Account
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="#hero-login"
            className="px-7 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-base transition-all flex items-center gap-2"
          >
            <Lock className="w-4 h-4 text-cyan-400" />
            Quick Sign In
          </a>
        </div>

        {/* ========================================================================= */}
        {/* 🔐 HERO LOGIN SECTION                                                     */}
        {/* ========================================================================= */}
        <div id="hero-login" className="mt-12 max-w-xl mx-auto text-left">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-6 -mr-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            {user ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto font-bold text-lg">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">Welcome back, {user.name}!</h3>
                  <p className="text-xs text-slate-400 capitalize">
                    You are currently authenticated as a <strong>{user.role}</strong>.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Link
                    href={`/${user.role === 'company' ? 'recruiter' : user.role}/dashboard`}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25"
                  >
                    <span>Open {user.role.toUpperCase()} Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {user.role === 'student' && (
                    <button
                      type="button"
                      onClick={() => setOnboardingOpen(true)}
                      className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      <span>Set Career Interests &amp; Domains</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400">Account Access</span>
                    <span className="text-[10px] text-slate-400">Instant Student &amp; Recruiter Sign-In</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Sign In to Skill2Hire
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sign in with Google / Gmail to personalize your job roles, programming languages &amp; domains.
                  </p>
                </div>

                {/* 1. Big Google / Gmail Sign In Button */}
                <button
                  type="button"
                  onClick={() => setGoogleModalOpen(true)}
                  className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Continue with Google / Gmail</span>
                </button>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    or quick email sign-in
                  </span>
                </div>

                {/* Role Switcher Pills */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                  {[
                    { r: 'student' as UserRole, label: 'Student' },
                    { r: 'college' as UserRole, label: 'College' },
                    { r: 'company' as UserRole, label: 'Recruiter' }
                  ].map(({ r, label }) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`py-1.5 rounded-xl font-bold transition-all text-center ${
                        loginRole === r
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {loginError}
                  </div>
                )}

                {/* Email / Password Form */}
                <form onSubmit={handleHeroLogin} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Email Address</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="yourname@domain.com"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Password</label>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/25 transition-all"
                  >
                    {isLoggingIn ? (
                      <span>Signing in...</span>
                    ) : (
                      <>
                        <span>Sign In as {loginRole.charAt(0).toUpperCase() + loginRole.slice(1)}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span>First time here?</span>
                  <Link href="/signup" className="text-cyan-400 hover:underline font-bold">
                    Create Student Account →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Live Metrics Row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-indigo-400">94.8%</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">Readiness Accuracy</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-sky-400">12,500+</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">Skills Verified</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">180+</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">Hiring Partners</div>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
            <div className="text-3xl sm:text-4xl font-black text-purple-400">45+</div>
            <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 mt-1">Partner Institutions</div>
          </div>
        </div>
      </section>

      {/* 1-Click Interactive Demo Persona Switcher */}
      <section id="demo-personas" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-indigo-500/30 shadow-2xl">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Experience Skill2Hire Instantly</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">Test Drive with Pre-Configured Personas</h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              No registration required. Switch seamlessly into any role to explore personalized dashboards, real assessments, and workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Student */}
            <button
              onClick={() => handleQuickDemo('student')}
              className="group p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 text-left transition-all relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                Student Persona
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Explore skill radar, online coding sandbox, AI interview coach & resume match analytics.
              </p>
              <span className="inline-block mt-4 text-[11px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                Alex Johnson (B.Tech CS)
              </span>
            </button>

            {/* College */}
            <button
              onClick={() => handleQuickDemo('college')}
              className="group p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-900 text-left transition-all relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                College TPO
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Inspect institutional curriculum gaps, industry demand signals & batch readiness heatmaps.
              </p>
              <span className="inline-block mt-4 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Apex Institute of Tech
              </span>
            </button>

            {/* Recruiter */}
            <button
              onClick={() => handleQuickDemo('company')}
              className="group p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 text-left transition-all relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                Recruiter
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Source pre-vetted campus talent, launch placement drives & analyze skill matrices.
              </p>
              <span className="inline-block mt-4 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                CloudScale Tech
              </span>
            </button>

            {/* Admin */}
            <button
              onClick={() => handleQuickDemo('admin')}
              className="group p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-900 text-left transition-all relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                System Admin
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5">
                Manage global taxonomy, audit system security, monitor platform health & manage users.
              </p>
              <span className="inline-block mt-4 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Platform Super Admin
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Core Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2">Engineered for Academic & Career Triumph</h2>
          <p className="text-slate-400 text-base mt-3">
            Skill2Hire combines rigorous skill assessments, automated compiler sandboxes, and institutional analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div id="students" className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Universal Compiler & Coding Arena</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Practice multi-language algorithmic challenges with instant compiler feedback, execution speed metrics, and automated unit test verification.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Real-time execution in 7+ languages
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Hidden & edge-case test evaluations
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Time & memory complexity diagnostics
                </li>
              </ul>
            </div>
            <Link
              href="/student/compiler"
              className="mt-6 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              Open Universal Compiler
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Campus Peer Collaboration */}
          <div id="collaboration" className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Campus Peer Direct Collaboration</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Direct peer-to-peer real-time messaging, study cohorts, mock interview partners, and collaborative skill acceleration across institutions.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  1-on-1 direct peer chat & unread badges
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Department & graduation year filtering
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  Skill synergy & peer study groups
                </li>
              </ul>
            </div>
            <Link
              href="/student/network"
              className="mt-6 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
            >
              Explore Peer Network
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Curriculum Gap Intelligence */}
          <div id="colleges" className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Curriculum Gap Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Identify discrepancies between academic syllabi and current market demand signals to adapt courses and boost placement rates.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  Heatmap of in-demand tech stacks
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  Industry demand projection index
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  Actionable syllabus upgrades
                </li>
              </ul>
            </div>
            <Link
              href="/college/curriculum-gap"
              className="mt-6 text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 group"
            >
              View Curriculum Analytics
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 4: AI Resume & Become Ready */}
          <div id="recruiters" className="p-7 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Resume & "Become Ready"</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Deep semantic matching that analyzes student portfolios against jobs, providing actionable roadmaps and verified skill credentials.
              </p>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Instant match percentage breakdown
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  "Why Not Eligible" diagnostics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Step-by-step roadmap to 90%+ match
                </li>
              </ul>
            </div>
            <Link
              href="/student/become-ready"
              className="mt-6 text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group"
            >
              Open Become Ready Engine
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-3">
              <Skill2HireSymbol size="sm" />
              <span className="font-bold text-white text-base">Skill2Hire</span>
              <span className="text-xs text-slate-400">© 2026 Skill2Hire Inc. All rights reserved. • Built by <strong className="text-slate-200 font-bold">Saalimin N</strong></span>
            </div>
            <p className="text-[11px] text-slate-400 italic font-medium ml-0 sm:ml-10">
              For students who are working towards their first opportunity.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Register</Link>
            <Link href="/brand" className="hover:text-white transition-colors">Brand Assets</Link>
            <Link href="/security-audit" className="hover:text-white transition-colors">Security Audit</Link>
          </div>
        </div>
      </footer>

      {/* Google / Gmail Sign In Modal */}
      <GoogleSignInModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onSelectAccount={handleGoogleAccountSelected}
        isLoading={isLoggingIn}
      />

      {/* Student Onboarding Interest Selection Modal */}
      <StudentOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        studentId={user?.role === 'student' ? (profile?.id || 'std_1') : 'std_1'}
        currentStudent={profile}
        onComplete={async (updated) => {
          if (refreshProfile) await refreshProfile();
          router.push('/student/dashboard');
        }}
      />
    </div>
  );
}
