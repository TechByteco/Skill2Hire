'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import GlobalSearchBar from '@/components/GlobalSearchBar';
import {
  Briefcase,
  BookOpen,
  Award,
  TrendingUp,
  Compass,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PlayCircle,
  Code2,
  ShieldCheck,
  ChevronRight,
  Flame,
  FileCheck,
  Target,
  FolderGit2,
  Users,
  Brain,
  Lock,
  Settings,
  UserPlus,
  SlidersHorizontal,
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import SkillBadge from '@/components/SkillBadge';
import ReadinessGauge from '@/components/ReadinessGauge';
import ProtectedRoute from '@/components/ProtectedRoute';
import StudentOnboardingModal from '@/components/StudentOnboardingModal';
import PeerChatModal from '@/components/PeerChatModal';

export default function StudentDashboard() {
  const { profile, refreshProfile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [studentData, setStudentData] = useState<any>(null);
  const [matchingJobs, setMatchingJobs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [peers, setPeers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [connectingPeerId, setConnectingPeerId] = useState<string | null>(null);
  const [connectedMap, setConnectedMap] = useState<Record<string, boolean>>({});
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [chatPeerId, setChatPeerId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [stdRes, jobsRes, crsRes, peersRes] = await Promise.all([
        fetch(`/api/students/${studentId}`),
        fetch(`/api/jobs?studentId=${studentId}&sort=best_match`),
        fetch(`/api/courses`),
        fetch(`/api/students/peers?studentId=${studentId}&limit=4`)
      ]);

      const sData = await stdRes.json();
      const jData = await jobsRes.json();
      const cData = await crsRes.json();
      const pData = await peersRes.json();

      if (sData.student) {
        setStudentData(sData);
        if (sData.student.onboardingCompleted === false) {
          setIsOnboardingOpen(true);
        }
      }
      if (jData.jobs) setMatchingJobs(jData.jobs);
      if (cData.courses) setCourses(cData.courses);
      if (pData.peers) {
        setPeers(pData.peers);
        const map: Record<string, boolean> = {};
        pData.peers.forEach((p: any) => {
          if (p.connectionStatus === 'connected' || p.connectionStatus === 'pending_sent') {
            map[p.id] = true;
          }
        });
        setConnectedMap(prev => ({ ...map, ...prev }));
      }
    } catch (e) {
      console.error('Error loading student dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [studentId]);

  const handleConnectPeer = async (peerId: string) => {
    try {
      setConnectingPeerId(peerId);
      const res = await fetch('/api/students/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: studentId,
          receiverId: peerId,
          note: 'Hey! I saw we share common interests on Skill2Hire. Would love to connect and exchange project ideas!'
        })
      });

      if (res.ok) {
        setConnectedMap((prev) => ({ ...prev, [peerId]: true }));
      }
    } catch (e) {
      console.error('Failed to send connection request:', e);
    } finally {
      setConnectingPeerId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Personalizing your career & learning roadmap...</p>
        </div>
      </div>
    );
  }

  const student = studentData?.student || {};
  const verifiedSkills = studentData?.verifiedSkills || [];
  const readiness = student?.placementReadiness || 65;
  const interestedDomains = student?.interestedDomains || ['Data Science & AI', 'Cybersecurity & InfoSec'];
  const interestedRoles = student?.interestedRoles || ['AI & Machine Learning Engineer', 'Cybersecurity Analyst'];
  const programmingLanguages = student?.programmingLanguages || ['Python', 'TypeScript', 'SQL'];

  const getJobAlignment = (job: any) => {
    const haystack = `${job.title} ${job.description || ''} ${(job.requiredSkills || []).join(' ')} ${job.department || ''}`.toLowerCase();
    
    for (const d of interestedDomains) {
      const lower = d.toLowerCase();
      if (lower.includes('data') && (haystack.includes('data') || haystack.includes('machine learning') || haystack.includes('ai') || haystack.includes('python'))) {
        return { matched: true, label: 'Data Science & AI' };
      }
      if (lower.includes('cyber') && (haystack.includes('security') || haystack.includes('cyber') || haystack.includes('soc') || haystack.includes('audit'))) {
        return { matched: true, label: 'Cybersecurity & InfoSec' };
      }
      if (lower.includes('web') && (haystack.includes('react') || haystack.includes('frontend') || haystack.includes('backend') || haystack.includes('full stack') || haystack.includes('web'))) {
        return { matched: true, label: 'Web Development' };
      }
      if (lower.includes('cloud') && (haystack.includes('cloud') || haystack.includes('aws') || haystack.includes('devops') || haystack.includes('docker'))) {
        return { matched: true, label: 'Cloud & DevOps' };
      }
    }

    for (const r of interestedRoles) {
      if (haystack.includes(r.toLowerCase())) {
        return { matched: true, label: r };
      }
    }

    return { matched: false, label: '' };
  };

  const quickActions = [
    {
      title: 'Find Jobs',
      description: 'Search 25+ open verified roles & check match score',
      icon: Briefcase,
      color: 'from-blue-600 to-indigo-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'hover:border-blue-300',
      href: '/jobs'
    },
    {
      title: 'Peer Network',
      description: 'Connect with students in Data Science & Cybersecurity',
      icon: Users,
      color: 'from-indigo-600 to-primary-600',
      textColor: 'text-primary-600',
      bgColor: 'bg-primary-50',
      borderColor: 'hover:border-primary-300',
      href: '/student/network'
    },
    {
      title: 'Learn a Skill',
      description: 'Explore video masterclasses & notes for any tech',
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-600',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'hover:border-emerald-300',
      href: '/learn'
    },
    {
      title: 'Improve Skills',
      description: 'Target skill gaps & level up for high-match jobs',
      icon: Zap,
      color: 'from-purple-600 to-indigo-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'hover:border-purple-300',
      href: '/student/skills'
    },
    {
      title: 'Career Roadmap',
      description: 'Step-by-step role progression & milestones',
      icon: Compass,
      color: 'from-amber-600 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'hover:border-amber-300',
      href: '/student/career-guide'
    },
    {
      title: 'AI Projects',
      description: 'Build open-source AI projects + GitHub sync',
      icon: FolderGit2,
      color: 'from-pink-600 to-rose-600',
      textColor: 'text-pink-600',
      bgColor: 'bg-pink-50',
      borderColor: 'hover:border-pink-300',
      href: '/student/projects'
    }
  ];

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* 🌟 1. ACTION-CENTRIC HERO: SEARCH & DISCOVERY */}
          <div className="bg-gradient-to-r from-slate-900 via-primary-950 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
              
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-xl shrink-0 border border-white/20 bg-primary-700 flex items-center justify-center text-white text-xl font-black">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt={student.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(student.fullName || 'Candidate').charAt(0)}</span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-blue-400/30">
                      🎓 Student Edition Portal
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                      Verified Candidate ✓
                    </span>
                    {student.githubConnected ? (
                      <Link
                        href="/student/projects"
                        className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-400/30 flex items-center gap-1 hover:bg-purple-500/30 transition-colors"
                      >
                        <FolderGit2 className="w-3 h-3" />
                        <span>@{student.githubUsername || 'alexrivera-dev'} ({student.githubRepoCount || 14} Repos) ✓</span>
                      </Link>
                    ) : (
                      <Link
                        href="/student/projects"
                        className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-700 flex items-center gap-1 hover:bg-slate-700 transition-colors"
                      >
                        <FolderGit2 className="w-3 h-3 text-purple-400" />
                        <span>Connect GitHub (+5%)</span>
                      </Link>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Welcome back, {profile?.fullName || profile?.name || student?.fullName || 'Candidate'}!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300">
                    {student.collegeName} • {student.department} ({student.graduationYear}) • CGPA: {student.cgpa?.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] font-bold uppercase text-slate-400">Job Readiness</div>
                    <div className="text-xl font-black text-cyan-300">{readiness}%</div>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                    <Flame className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                <Link
                  href="/student/settings"
                  className="p-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Edit Career Interests & Profile Settings"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div className="space-y-2">
              <GlobalSearchBar size="hero" />
            </div>
          </div>

          {/* 🎯 PERSONALIZED CAREER TRACK & SITE OPTIMIZATION BANNER */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900/90 via-primary-900/80 to-slate-900 border border-indigo-500/30 text-white shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-300 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-400" />
                    <span>Personalized Career Engine</span>
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Dashboard optimized to your active interests
                  </span>
                </div>
                <h2 className="text-lg font-black text-white">Your Tailored Placement Track</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Customize Track</span>
                </button>
                <Link
                  href="/student/settings"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Focused Domains:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {interestedDomains.map((d: string) => (
                    <span
                      key={d}
                      className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs font-bold flex items-center gap-1"
                    >
                      {d.includes('Data') ? <Brain className="w-3 h-3 text-purple-400" /> : <Lock className="w-3 h-3 text-rose-400" />}
                      <span>{d}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Target Roles:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {interestedRoles.map((r: string) => (
                    <span
                      key={r}
                      className="px-2.5 py-1 rounded-xl bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Briefcase className="w-3 h-3 text-blue-400" />
                      <span>{r}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Core Languages:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {programmingLanguages.map((lang: string) => (
                    <span
                      key={lang}
                      className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 text-xs font-bold flex items-center gap-1"
                    >
                      <Code2 className="w-3 h-3 text-emerald-400" />
                      <span>{lang}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ⚡ 2. SIX QUICK ACTIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span>Quick Actions</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              {quickActions.map((act) => {
                const Icon = act.icon;
                return (
                  <Link
                    key={act.title}
                    href={act.href}
                    className={`p-4 rounded-3xl bg-white border border-slate-200 ${act.borderColor} hover:shadow-lg transition-all flex flex-col justify-between space-y-3 group`}
                  >
                    <div className="space-y-2">
                      <div className={`w-11 h-11 rounded-2xl ${act.bgColor} ${act.textColor} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-sm text-slate-900 group-hover:text-primary-600 transition-colors">
                        {act.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {act.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 group-hover:text-primary-600">
                      <span>Launch</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 🤝 LINKEDIN-STYLE CAMPUS PEER NETWORK RECOMMENDATIONS */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900">Recommended Campus Peers</h2>
                    <span className="px-2 py-0.5 rounded-full bg-primary-100 text-primary-800 text-[10px] font-black uppercase">
                      LinkedIn-Style Networking
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Connect, collaborate on AI projects, and share interview experiences with students in your domains.
                  </p>
                </div>
              </div>

              <Link
                href="/student/network"
                className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 shrink-0"
              >
                <span>View Full Student Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {peers.map((peer) => {
                const isConnected = connectedMap[peer.id];
                const isConnecting = connectingPeerId === peer.id;

                return (
                  <div
                    key={peer.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md overflow-hidden">
                            {peer.avatar ? (
                              <img src={peer.avatar} alt={peer.fullName} className="w-full h-full object-cover" />
                            ) : (
                              peer.fullName.charAt(0)
                            )}
                          </div>
                          <div className="leading-tight">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-primary-600 transition-colors">
                              {peer.fullName}
                            </h4>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[130px]">
                              {peer.department}
                            </span>
                          </div>
                        </div>

                        {peer.mutualScore && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black shrink-0">
                            {peer.mutualScore}% Match
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex flex-wrap gap-1">
                          {(peer.interestedDomains || ['Data Science & AI']).slice(0, 2).map((d: string) => (
                            <span
                              key={d}
                              className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                          "{peer.bio || 'Passionate student learning software & AI technologies.'}"
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
                      {peer.connectionStatus === 'connected' ? (
                        <div className="flex items-center gap-1.5 w-full">
                          <div className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Connected</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setChatPeerId(peer.id);
                              setChatModalOpen(true);
                            }}
                            className="py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-sm transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>Chat</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleConnectPeer(peer.id)}
                          disabled={isConnected || isConnecting}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                            isConnected
                              ? 'bg-emerald-100 text-emerald-800 cursor-default'
                              : 'bg-primary-600 hover:bg-primary-500 text-white shadow-sm'
                          }`}
                        >
                          {isConnected ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Requested ✓</span>
                            </>
                          ) : isConnecting ? (
                            <span className="animate-pulse">Connecting...</span>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span>Connect</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 🎯 3. PERSONALIZED RECOMMENDATIONS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Recommended For You</h2>
                      <p className="text-xs text-slate-500">Personalized actions to maximize your placement readiness & match score.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Action 1: Learn DSA */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/40 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[10px] font-black uppercase">
                        High Impact Skill Gap
                      </span>
                      <h4 className="font-black text-sm text-slate-900">Learn Data Structures & Algorithms</h4>
                      <p className="text-xs text-slate-600">
                        Required by <strong>18 matching software roles</strong>. Master Binary Trees & Dynamic Programming.
                      </p>
                    </div>
                    <Link
                      href="/courses/crs_dsa/learn"
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-amber-600/20"
                    >
                      <PlayCircle className="w-3.5 h-3.5" />
                      <span>Start DSA Course</span>
                    </Link>
                  </div>

                  {/* Action 2: Python Verification Assessment */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50/40 border border-purple-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-md bg-purple-200 text-purple-900 text-[10px] font-black uppercase">
                        Assessment Ready
                      </span>
                      <h4 className="font-black text-sm text-slate-900">Take Python Verification Assessment</h4>
                      <p className="text-xs text-slate-600">
                        Pass with score &ge; 70% to verify Python on your Skill Passport and boost job match by +25%.
                      </p>
                    </div>
                    <Link
                      href="/assessments/asm_python"
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/20"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Take Assessment</span>
                    </Link>
                  </div>

                  {/* Action 3: Practice SQL Coding */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50/40 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2 py-0.5 rounded-md bg-blue-200 text-blue-900 text-[10px] font-black uppercase">
                        Coding Practice
                      </span>
                      <h4 className="font-black text-sm text-slate-900">Solve Two-Sum & Array Problems</h4>
                      <p className="text-xs text-slate-600">
                        Solve 2 coding challenges in the live web compiler to test your algorithmic problem solving.
                      </p>
                    </div>
                    <Link
                      href="/student/coding-practice"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Open Sandbox</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Best Matching Jobs Section */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-slate-900">Best Matching Openings</h2>
                      <p className="text-xs text-slate-500">Live positions filtered and aligned by your verified skills and domains.</p>
                    </div>
                  </div>
                  <Link
                    href="/jobs"
                    className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                  >
                    View All <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {matchingJobs.slice(0, 4).map((job) => {
                    const align = getJobAlignment(job);

                    return (
                      <div
                        key={job.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-black text-sm text-slate-900">
                              <Link href={`/jobs/${job.id}`} className="hover:text-primary-600">{job.title}</Link>
                            </h4>
                            <span className="px-2 py-0.5 rounded-full bg-slate-900 text-cyan-300 text-[10px] font-black">
                              {job.matchScore}% Match
                            </span>
                            {align.matched && (
                              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black flex items-center gap-1 border border-indigo-200">
                                <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                                <span>Aligned with {align.label}</span>
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            {job.companyName} • {job.location} • <span className="font-bold text-slate-800">{job.salary}</span>
                          </p>
                        </div>

                        <div className="shrink-0">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                          >
                            <span>{job.isEligible ? 'Apply Now' : 'Check Gap'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right Column: Readiness Score & Verified Passport */}
            <div className="space-y-6">
              
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6 text-center">
                <h3 className="font-black text-sm text-slate-900">Comprehensive Readiness</h3>
                <div className="flex justify-center py-2">
                  <ReadinessGauge score={readiness} size="lg" title="Job Ready" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Calculated from <strong>{verifiedSkills.length} verified skills</strong>, academic transcript CGPA ({student.cgpa}), and course milestones.
                </p>
                <Link
                  href="/student/academic-report"
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileCheck className="w-4 h-4 text-primary-600" />
                  <span>View Official Report</span>
                </Link>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-black text-sm text-slate-900">Verified Skill Passport</h3>
                  <Link href="/student/skills" className="text-xs font-bold text-primary-600 hover:underline">
                    Manage
                  </Link>
                </div>

                <div className="space-y-2.5">
                  {verifiedSkills.map((sk: any) => (
                    <div
                      key={sk.id || sk.skillName}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <div className="font-black text-xs text-slate-900 flex items-center gap-1">
                          <span>{sk.skillName}</span>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {sk.level} • Score: {sk.score}%
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      <StudentOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        studentId={studentId}
        currentStudent={student}
        onComplete={async (updated) => {
          setStudentData((prev: any) => ({
            ...prev,
            student: { ...prev?.student, ...updated }
          }));
          await refreshProfile();
          loadData();
        }}
      />

      <PeerChatModal
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        initialPeerId={chatPeerId}
      />
    </ProtectedRoute>
  );
}
