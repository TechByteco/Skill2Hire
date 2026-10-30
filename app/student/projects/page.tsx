'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  FolderGit2,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Code2,
  ArrowRight,
  Layers,
  Award,
  Plus,
  RefreshCw,
  Search,
  Check,
  AlertCircle,
  Eye,
  GitFork,
  Cpu,
  ShieldCheck,
  Terminal,
  Globe,
  X,
  Flame
} from 'lucide-react';
import { ProjectRecommendationItem } from '@/lib/types';

interface ScoredProjectItem extends ProjectRecommendationItem {
  matchScore?: number;
  matchReasons?: string[];
}

interface SubmittedProject {
  id: string;
  studentId: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  verified: boolean;
}

export default function ProjectsHubPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  // Filters and state
  const [activeRoleFilter, setActiveRoleFilter] = useState<string>('Open Source AI');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('All');
  const [projects, setProjects] = useState<ScoredProjectItem[]>([]);
  const [submittedProjects, setSubmittedProjects] = useState<SubmittedProject[]>([]);
  const [loading, setLoading] = useState(true);

  // GitHub Integration state
  const [githubConnected, setGithubConnected] = useState(false);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubAvatar, setGithubAvatar] = useState('');
  const [githubRepoCount, setGithubRepoCount] = useState(0);
  const [githubUrl, setGithubUrl] = useState('');
  const [githubSyncedAt, setGithubSyncedAt] = useState('');
  const [isSyncingGithub, setIsSyncingGithub] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [inputGithubUser, setInputGithubUser] = useState('');

  // New Custom Project Modal state
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newRole, setNewRole] = useState('AI & Machine Learning');
  const [newDifficulty, setNewDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [newTechString, setNewTechString] = useState('Python, LangChain, FastAPI, Docker');
  const [newGithubUrl, setNewGithubUrl] = useState('');
  const [newLiveUrl, setNewLiveUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newFeatures, setNewFeatures] = useState('Autonomous tool-calling loop\nVector embeddings similarity search\nAutomated unit test coverage');
  const [isSubmittingProject, setIsSubmittingProject] = useState(false);
  const [projectSubmitSuccess, setProjectSubmitSuccess] = useState<string | null>(null);
  const [projectSubmitError, setProjectSubmitError] = useState<string | null>(null);

  // Load student profile, GitHub status, submitted projects, and recommendations
  const loadStudentAndProjects = async () => {
    setLoading(true);
    try {
      // 1. Fetch student data for projects & github
      const stdRes = await fetch(`/api/students/${studentId}`);
      if (stdRes.ok) {
        const stdData = await stdRes.json();
        if (stdData.student) {
          const s = stdData.student;
          setGithubConnected(!!s.githubConnected);
          setGithubUsername(s.githubUsername || '');
          setGithubAvatar(s.githubAvatar || '');
          setGithubRepoCount(s.githubRepoCount || 0);
          setGithubUrl(s.githubUrl || '');
          setGithubSyncedAt(s.githubSyncedAt || '');
        }
        if (stdData.projects) {
          setSubmittedProjects(stdData.projects);
        }
      }

      // 2. Fetch project recommendations based on active filter
      const queryRole = activeRoleFilter === 'Open Source AI' ? 'AI & Machine Learning' : activeRoleFilter;
      const recRes = await fetch(`/api/projects/recommendations?role=${encodeURIComponent(queryRole)}&studentId=${studentId}`);
      if (recRes.ok) {
        const recData = await recRes.json();
        if (recData.recommendations) {
          setProjects(recData.recommendations);
        }
      }
    } catch (err) {
      console.error('Error fetching project hub data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudentAndProjects();
  }, [activeRoleFilter, studentId]);

  // Connect / Sync GitHub handler
  const handleConnectGithub = async (targetUser?: string) => {
    setIsSyncingGithub(true);
    try {
      const usernameToSync = (targetUser || inputGithubUser || githubUsername || 'alexrivera-dev').trim();
      const res = await fetch(`/api/students/${studentId}/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: usernameToSync })
      });
      const data = await res.json();
      if (data.success && data.githubProfile) {
        setGithubConnected(true);
        setGithubUsername(data.githubProfile.username);
        setGithubAvatar(data.githubProfile.avatar);
        setGithubRepoCount(data.githubProfile.repoCount);
        setGithubUrl(data.githubProfile.url);
        setGithubSyncedAt(data.githubProfile.syncedAt);
        setShowGithubModal(false);
        setProjectSubmitSuccess(`GitHub @${data.githubProfile.username} linked successfully! Verified proof of work.`);
        setTimeout(() => setProjectSubmitSuccess(null), 4000);
      }
    } catch (err) {
      console.error('Error connecting GitHub:', err);
    } finally {
      setIsSyncingGithub(false);
    }
  };

  // Disconnect GitHub handler
  const handleDisconnectGithub = async () => {
    if (!confirm('Are you sure you want to disconnect your GitHub profile?')) return;
    setIsSyncingGithub(true);
    try {
      const res = await fetch(`/api/students/${studentId}/github`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect' })
      });
      const data = await res.json();
      if (data.success) {
        setGithubConnected(false);
        setGithubUsername('');
        setGithubAvatar('');
        setGithubRepoCount(0);
        setGithubUrl('');
        setGithubSyncedAt('');
      }
    } catch (err) {
      console.error('Error disconnecting GitHub:', err);
    } finally {
      setIsSyncingGithub(false);
    }
  };

  // Submit New Custom Project
  const handleSubmitNewProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setProjectSubmitError('Project title is required.');
      return;
    }

    setIsSubmittingProject(true);
    setProjectSubmitError(null);

    const techArray = newTechString
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const finalGithubUrl = newGithubUrl.trim() || (githubUsername ? `https://github.com/${githubUsername}/${newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : 'https://github.com/student/custom-project');

    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          title: newTitle.trim(),
          description: newDescription.trim() || 'Custom independent software capstone built and verified via Skill2Hire platform.',
          technologies: techArray.length > 0 ? techArray : ['Python', 'Docker', 'Git'],
          githubUrl: finalGithubUrl,
          liveUrl: newLiveUrl.trim() || undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setProjectSubmitSuccess(`🎉 Project "${newTitle}" verified! +8% added to your Placement Readiness score.`);
        setShowNewProjectModal(false);
        // Reset inputs
        setNewTitle('');
        setNewDescription('');
        setNewGithubUrl('');
        setNewLiveUrl('');
        // Reload project list
        loadStudentAndProjects();
        setTimeout(() => setProjectSubmitSuccess(null), 6000);
      } else {
        setProjectSubmitError(data.error || 'Failed to submit project. Please try again.');
      }
    } catch (err: any) {
      setProjectSubmitError(err.message || 'An error occurred submitting the project.');
    } finally {
      setIsSubmittingProject(false);
    }
  };

  // Pre-fill "New Project" modal from an existing recommendation
  const handleForkRecommendation = (proj: ScoredProjectItem) => {
    setNewTitle(`${proj.title} (My Implementation)`);
    setNewRole(proj.targetRole);
    setNewDifficulty(proj.difficulty);
    setNewTechString(proj.technologies.join(', '));
    setNewDescription(`Custom implementation of ${proj.title}. ${proj.description}`);
    if (githubUsername) {
      setNewGithubUrl(`https://github.com/${githubUsername}/${proj.id.replace(/_/g, '-')}`);
    } else {
      setNewGithubUrl(proj.githubTemplateUrl || '');
    }
    setNewFeatures(proj.features.join('\n'));
    setShowNewProjectModal(true);
  };

  // Filtered projects list based on search and difficulty
  const filteredProjects = projects.filter(p => {
    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.technologies.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;

    if (activeRoleFilter === 'Open Source AI') {
      const isAI = p.id.includes('ai') ||
                   p.targetRole.toLowerCase().includes('ai') ||
                   p.technologies.some(t => ['ai/ml', 'langgraph', 'langchain', 'ollama', 'qdrant', 'chromadb', 'yolov8', 'pytorch', 'spacy', 'whisper stt'].includes(t.toLowerCase()));
      return matchesSearch && matchesDiff && isAI;
    }

    if (activeRoleFilter === 'All') {
      return matchesSearch && matchesDiff;
    }

    return matchesSearch && matchesDiff && p.targetRole.toLowerCase().includes(activeRoleFilter.toLowerCase());
  });

  const roles = ['Open Source AI', 'All', 'Software Developer', 'AI & Machine Learning', 'Data Analyst', 'Cloud DevOps Associate'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
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
            <span className="text-xs font-mono text-emerald-400 font-bold">Proof of Work Engine Live</span>
          </div>
        </div>

        {/* Global Toast Message */}
        {projectSubmitSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-center justify-between shadow-xl animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold">{projectSubmitSuccess}</span>
            </div>
            <button onClick={() => setProjectSubmitSuccess(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🌟 HERO HEADER & ACTIONS                                                  */}
        {/* ========================================================================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-6 sm:p-10 shadow-2xl space-y-6">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Proof of Work Portfolio Hub
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-purple-400" /> Open Source AI Ready
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Architectural Capstones & Open-Source AI Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Transform theoretical knowledge into verifiable code. Build cutting-edge multi-agent systems, hybrid RAG pipelines, or publish your own custom software projects directly connected to your GitHub profile.
              </p>
            </div>

            {/* Action Buttons: New Project & GitHub Connect */}
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => {
                  if (githubUsername && !newGithubUrl) {
                    setNewGithubUrl(`https://github.com/${githubUsername}/my-custom-project`);
                  }
                  setShowNewProjectModal(true);
                }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
                <span>+ New Project</span>
              </button>

              {!githubConnected ? (
                <button
                  onClick={() => setShowGithubModal(true)}
                  className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 transition-colors"
                >
                  <FolderGit2 className="w-4 h-4 text-purple-400" />
                  <span>Connect with GitHub</span>
                </button>
              ) : (
                <button
                  onClick={() => handleConnectGithub()}
                  disabled={isSyncingGithub}
                  className="px-4 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 transition-colors"
                  title="Re-sync public repositories and update portfolio"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isSyncingGithub ? 'animate-spin' : ''}`} />
                  <span>{isSyncingGithub ? 'Syncing...' : 'Re-sync GitHub'}</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 🐙 CONNECTED GITHUB STATUS STRIP                                          */}
          {/* ========================================================================= */}
          {githubConnected ? (
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {githubAvatar ? (
                  <img
                    src={githubAvatar}
                    alt={githubUsername}
                    className="w-10 h-10 rounded-full border border-cyan-500/40 object-cover shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold">
                    GH
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">@{githubUsername}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> GitHub Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {githubRepoCount} Public Repositories Synced • Automatic employer code verification active
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold flex items-center gap-1 transition-colors"
                  >
                    <span>View GitHub Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={handleDisconnectGithub}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 hover:text-rose-300 text-slate-400 font-semibold transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-purple-950/20 p-4 rounded-2xl border border-purple-500/20">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center">
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Connect GitHub to Boost Placement Readiness (+5%)</h4>
                  <p className="text-[11px] text-slate-400">
                    Link your public repositories to automatically populate employer technical evaluations and skill badges.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowGithubModal(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 transition-colors shadow-md shadow-purple-600/20"
              >
                Connect GitHub Now →
              </button>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 🚀 MY VERIFIED & ACTIVE PROJECTS SECTION                                   */}
        {/* ========================================================================= */}
        {submittedProjects.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white">My Active & Verified Projects</h2>
                  <p className="text-xs text-slate-400">
                    {submittedProjects.length} Verified proof-of-work capstones linked to your Skill Passport.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Submit Another Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {submittedProjects.map(proj => (
                <div
                  key={proj.id}
                  className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Verified Proof of Work
                      </span>
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">+8% Readiness Boost</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-black text-white">{proj.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.technologies.map(t => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 font-mono text-[10px] font-semibold border border-slate-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5"
                      >
                        <FolderGit2 className="w-3.5 h-3.5" />
                        <span>View Repository</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🔍 FILTER & SEARCH CONTROLS                                               */}
        {/* ========================================================================= */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Role Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
              {roles.map(r => {
                const isActive = activeRoleFilter === r;
                const isAI = r === 'Open Source AI';
                return (
                  <button
                    key={r}
                    onClick={() => setActiveRoleFilter(r)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? isAI
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                        : isAI
                        ? 'bg-purple-950/40 text-purple-300 hover:bg-purple-900/40 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                    }`}
                  >
                    {isAI && <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                    <span>{r}</span>
                  </button>
                );
              })}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-slate-400">Difficulty:</span>
              {['All', 'Beginner', 'Intermediate', 'Advanced'].map(d => (
                <button
                  key={d}
                  onClick={() => setDifficultyFilter(d)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                    difficultyFilter === d
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, architecture, or tech (e.g. LangGraph, RAG, YOLOv8, Python, Docker)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-950 border border-slate-800 focus:border-cyan-500 outline-none text-xs text-white placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 📚 PROJECT BLUEPRINTS GRID                                                */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span>
                {activeRoleFilter === 'Open Source AI'
                  ? 'Curated Open-Source AI Projects'
                  : `${activeRoleFilter} Recommended Projects`}
              </span>
              <span className="text-xs font-normal text-slate-400 font-mono">({filteredProjects.length} Available)</span>
            </h2>
            <span className="text-xs text-slate-400 hidden sm:block">
              Click &quot;Build in Studio&quot; to edit code or &quot;Fork &amp; Submit&quot; to submit your own version.
            </span>
          </div>

          {loading ? (
            <div className="p-16 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold">Loading industry architectural blueprints...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No projects found matching criteria</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Try clearing your search query or selecting &quot;All&quot; to explore all architectural tracks.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDifficultyFilter('All');
                  setActiveRoleFilter('Open Source AI');
                }}
                className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((proj) => {
                const isAIProject = proj.id.includes('ai') || proj.technologies.some(t => ['ai/ml', 'langgraph', 'langchain', 'ollama', 'qdrant', 'chromadb', 'yolov8', 'pytorch', 'spacy', 'whisper stt'].includes(t.toLowerCase()));

                return (
                  <div
                    key={proj.id}
                    className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 p-6 sm:p-7 flex flex-col justify-between space-y-6 transition-all"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            proj.difficulty === 'Advanced'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : proj.difficulty === 'Intermediate'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {proj.difficulty}
                          </span>
                          {isAIProject && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                              <Cpu className="w-3 h-3 text-purple-400" /> Open-Source AI
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 font-semibold">{proj.targetRole}</span>
                      </div>

                      {/* Title & Description */}
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors">
                          {proj.title}
                        </h3>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {proj.description}
                        </p>
                      </div>

                      {/* AI Match Rationale */}
                      {proj.matchReasons && proj.matchReasons.length > 0 && (
                        <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/20 space-y-1">
                          <span className="text-[10px] font-black uppercase text-purple-300 tracking-wider flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400 animate-pulse" /> Alignment Rationale:
                          </span>
                          <div className="flex flex-col gap-0.5 pl-3 text-[11px] text-purple-200">
                            {proj.matchReasons.slice(0, 2).map((reason: string, rIdx: number) => (
                              <span key={rIdx} className="relative before:content-['•'] before:absolute before:-left-3 font-medium">
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Required Tech Stack */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Architecture Tech Stack:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {proj.technologies.map(t => (
                            <span
                              key={t}
                              className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] font-semibold"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key Deliverables */}
                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                        <span className="font-extrabold text-slate-400 uppercase text-[10px] tracking-wider block">
                          Key Deliverables:
                        </span>
                        <ul className="space-y-1.5 text-slate-300">
                          {proj.features.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {proj.githubTemplateUrl && (
                          <a
                            href={proj.githubTemplateUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 border border-slate-700"
                            title="Inspect starter GitHub template repo"
                          >
                            <FolderGit2 className="w-3.5 h-3.5 text-purple-400" />
                            <span>Template</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => handleForkRecommendation(proj)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 hover:text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 transition-colors flex items-center gap-1.5"
                          title="Fork this project and submit your custom implementation"
                        >
                          <GitFork className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Fork &amp; Submit</span>
                        </button>
                      </div>

                      <Link
                        href={`/student/projects/${proj.id}`}
                        className="px-4 py-2 rounded-xl text-xs font-black text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center justify-center gap-1.5 shadow-md shadow-cyan-400/20"
                      >
                        <span>Build in Studio</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 🛠️ MODAL 1: CREATE / SUBMIT CUSTOM PROJECT MODAL                          */}
        {/* ========================================================================= */}
        {showNewProjectModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Create &amp; Submit Custom Project</h3>
                    <p className="text-xs text-slate-400">
                      Work on your own independent project and link it to your verified portfolio.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNewProjectModal(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {projectSubmitError && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{projectSubmitError}</span>
                </div>
              )}

              <form onSubmit={handleSubmitNewProject} className="space-y-4 text-xs">
                {/* Project Title */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Autonomous Multimodal Customer Support Agent"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                  />
                </div>

                {/* Target Role & Difficulty */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Target Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                    >
                      <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                      <option value="Software Developer">Software Developer</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="Cloud DevOps Associate">Cloud DevOps Associate</option>
                      <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Difficulty Tier</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Technologies Used (Comma Separated)</label>
                  <input
                    type="text"
                    value={newTechString}
                    onChange={(e) => setNewTechString(e.target.value)}
                    placeholder="Python, LangGraph, Ollama, Docker, PostgreSQL"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                  />
                </div>

                {/* GitHub Repo URL */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-300">GitHub Repository URL</label>
                    {githubUsername && (
                      <button
                        type="button"
                        onClick={() => setNewGithubUrl(`https://github.com/${githubUsername}/${newTitle ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'project'}`)}
                        className="text-[10px] text-cyan-400 hover:underline"
                      >
                        Auto-fill with @{githubUsername}
                      </button>
                    )}
                  </div>
                  <input
                    type="url"
                    value={newGithubUrl}
                    onChange={(e) => setNewGithubUrl(e.target.value)}
                    placeholder="https://github.com/username/project-repo"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                  />
                </div>

                {/* Live Demo URL */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Live Demo / Deployment URL (Optional)</label>
                  <input
                    type="url"
                    value={newLiveUrl}
                    onChange={(e) => setNewLiveUrl(e.target.value)}
                    placeholder="https://my-project.vercel.app"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-300">Description &amp; Architecture Highlights</label>
                  <textarea
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Briefly describe what your project does, the architecture decisions made, and problems it solves..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none resize-none"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Submitting this project verifies your proof of work and adds <strong>+8%</strong> to your Placement Readiness score!</span>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowNewProjectModal(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingProject}
                    className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black flex items-center gap-1.5 shadow-md shadow-cyan-400/20 transition-all"
                  >
                    {isSubmittingProject ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Verify &amp; Add to Passport</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🐙 MODAL 2: GITHUB CONNECT MODAL                                          */}
        {/* ========================================================================= */}
        {showGithubModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Connect Your GitHub</h3>
                    <p className="text-xs text-slate-400">Sync repositories &amp; earn +5% readiness</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGithubModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Connect your GitHub profile to showcase real code commits, pull requests, and open-source contributions directly to hiring managers.
              </p>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">GitHub Username or Handle</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-mono">@</span>
                    <input
                      type="text"
                      value={inputGithubUser}
                      onChange={(e) => setInputGithubUser(e.target.value)}
                      placeholder="e.g. alexrivera-dev"
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-cyan-500 text-white outline-none text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Pre-fill Quick chips */}
                <div className="flex items-center gap-2 flex-wrap text-[11px]">
                  <span className="text-slate-400">Suggested:</span>
                  {['alexrivera-dev', 'octocat', 'torvalds'].map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setInputGithubUser(u)}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-cyan-300 font-mono transition-colors"
                    >
                      @{u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-200 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-purple-300">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Proof of Work Verification</span>
                </div>
                <p className="text-[11px] text-purple-300/80">
                  We verify public repositories, commit history, and technical languages to validate your competency.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGithubModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConnectGithub()}
                  disabled={isSyncingGithub}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
                >
                  {isSyncingGithub ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying &amp; Linking...</span>
                    </>
                  ) : (
                    <>
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Link GitHub Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
