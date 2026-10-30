'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  BookOpen,
  Award,
  Sparkles,
  Briefcase,
  Layers,
  ChevronRight,
  Check,
  Building2,
  TrendingUp,
  Target
} from 'lucide-react';

function BecomeReadyContent() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('jobId') || 'job_1';

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(initialJobId);
  const [roadmap, setRoadmap] = useState<any>(null);
  const [diagnostic, setDiagnostic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load available jobs for switcher
  useEffect(() => {
    fetch('/api/jobs')
      .then(res => res.json())
      .then(data => {
        if (data.jobs && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch(e => console.error(e));
  }, []);

  // Update selectedJobId if searchParams change
  useEffect(() => {
    const qJob = searchParams.get('jobId');
    if (qJob && qJob !== selectedJobId) {
      setSelectedJobId(qJob);
    }
  }, [searchParams]);

  // Load roadmap & diagnostic for selected job
  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/students/${studentId}/roadmap?jobId=${selectedJobId}`).then(r => r.json()),
      fetch(`/api/students/${studentId}/why-not-eligible?jobId=${selectedJobId}`).then(r => r.json())
    ])
      .then(([roadmapData, diagData]) => {
        if (roadmapData.roadmap) setRoadmap(roadmapData.roadmap);
        if (diagData.diagnostic) setDiagnostic(diagData.diagnostic);
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [studentId, selectedJobId]);

  const activeJob = jobs.find(j => j.id === selectedJobId) || {
    id: selectedJobId,
    title: roadmap?.jobTitle || diagnostic?.jobTitle || 'Target Opening',
    companyName: diagnostic?.companyName || 'Corporate Partner',
    minCgpa: 7.5
  };

  const currentMatch = diagnostic?.matchPercentage || 62;
  const projectedMatch = diagnostic?.projectedScoreAfterActions || roadmap?.projectedReadiness || 91;

  const defaultSteps = [
    {
      stepNumber: 1,
      title: 'Python Intermediate',
      skillName: 'Python',
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate',
      courseId: 'crs_python',
      courseTitle: 'Python Fundamentals & OOP for Placement',
      assessmentId: 'asm_python',
      estimatedHours: 12
    },
    {
      stepNumber: 2,
      title: 'DSA Intermediate',
      skillName: 'DSA',
      currentLevel: 'Beginner',
      targetLevel: 'Intermediate',
      courseId: 'crs_dsa',
      courseTitle: 'Data Structures & Algorithms Masterclass',
      assessmentId: 'asm_dsa',
      estimatedHours: 14
    },
    {
      stepNumber: 3,
      title: 'AWS Cloud Basics',
      skillName: 'AWS',
      currentLevel: 'None',
      targetLevel: 'Beginner',
      courseId: 'crs_cloud',
      courseTitle: 'Cloud Fundamentals (AWS & Cloud Architecture)',
      assessmentId: 'asm_aws',
      estimatedHours: 8
    },
    {
      stepNumber: 4,
      title: 'AI Technical Interview Simulation',
      skillName: 'Interview Readiness',
      currentLevel: 'In Progress',
      targetLevel: 'Intermediate',
      estimatedHours: 2
    }
  ];

  const stepsToRender = (roadmap?.steps && roadmap.steps.length > 0) ? roadmap.steps : defaultSteps;

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link href="/student/dashboard" className="text-xs font-bold text-slate-500 hover:text-primary-600">
            ← Back to Student Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/student/career-guide" className="text-xs font-bold text-slate-500 hover:text-primary-600">
              Career Guide
            </Link>
            <span className="text-slate-300">•</span>
            <Link href="/jobs" className="text-xs font-bold text-slate-500 hover:text-primary-600">
              Browse All Jobs
            </Link>
          </div>
        </div>

        {/* 1. HEADER & DYNAMIC JOB SELECTOR */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-primary-600 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-primary-600" />
                <span>Eligibility Acceleration Engine</span>
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Your Path to: {activeJob.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Target Employer: <strong>{activeJob.companyName}</strong> • Current Match:{' '}
                <strong className={currentMatch >= 75 ? 'text-emerald-600' : 'text-amber-600'}>
                  {currentMatch}%
                </strong>{' '}
                • Target: <strong className="text-emerald-600">90%+ Eligible ✓</strong>
              </p>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center shrink-0">
              <span className="text-[10px] font-bold uppercase text-emerald-800 tracking-wider block">
                Projected Eligibility
              </span>
              <span className="text-2xl font-black text-emerald-700 font-mono">
                {projectedMatch}%+ Eligible ✓
              </span>
            </div>
          </div>

          {/* Job Switcher Dropdown */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
              <Target className="w-4 h-4 text-indigo-600" />
              <span>Select Target Opening to Accelerate:</span>
            </div>

            <div className="relative w-full sm:w-80">
              <select
                value={selectedJobId}
                onChange={(e) => setSelectedJobId(e.target.value)}
                className="w-full text-xs font-bold text-slate-900 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 outline-none focus:border-primary-500"
              >
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>
                    {j.companyName} — {j.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* LOADING INDICATOR */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Generating your personalized roadmap for {activeJob.title}...</p>
          </div>
        ) : (
          <>
            {/* 2. SEQUENTIAL STEP PROGRESSION */}
            <div className="space-y-4">
              {stepsToRender.map((st: any, idx: number) => {
                const stepNum = st.stepNumber || idx + 1;
                const isInterviewStep = st.title?.toLowerCase().includes('interview') || st.skillName?.toLowerCase().includes('interview');
                const isCodingStep = st.title?.toLowerCase().includes('coding') || st.title?.toLowerCase().includes('sandbox');

                const courseLink = st.courseId ? `/courses/${st.courseId}` : isInterviewStep ? '/student/interview-coach' : '/courses';
                const assessmentLink = st.assessmentId ? `/assessments/${st.assessmentId}` : isInterviewStep ? '/student/interview-coach' : isCodingStep ? '/student/coding-practice' : '/assessments/asm_python';

                return (
                  <div
                    key={st.stepNumber || idx}
                    className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all space-y-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary-600 text-white font-black text-base flex items-center justify-center shadow-md shadow-primary-500/20 shrink-0">
                          {stepNum}
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              {st.skillName || 'Skill Competency'}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              +{Math.round(28 / Math.max(1, stepsToRender.length))}% Match
                            </span>
                            {st.estimatedHours && (
                              <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {st.estimatedHours}h
                              </span>
                            )}
                          </div>
                          <h2 className="text-lg font-bold text-slate-900">{st.title}</h2>
                          {st.currentLevel && st.targetLevel && (
                            <p className="text-xs text-slate-500">
                              Current Level: <span className="font-semibold text-slate-700">{st.currentLevel}</span> → Target Level: <span className="font-semibold text-primary-700">{st.targetLevel}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <Link
                          href={courseLink}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{isInterviewStep ? 'Coach Rubric' : isCodingStep ? 'Coding Arena' : 'Free Course'}</span>
                        </Link>

                        <Link
                          href={assessmentLink}
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-colors flex items-center gap-1.5"
                        >
                          <Award className="w-3.5 h-3.5" />
                          <span>{isInterviewStep ? 'Practice Interview →' : 'Verify Skill →'}</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 3. STEP RECALCULATE ELIGIBILITY CTA */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white text-center space-y-4 shadow-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-400 block">
                Final Milestone
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Recalculate Compatibility & Submit Application
              </h2>
              <p className="text-xs text-slate-400 max-w-lg mx-auto">
                Once required assessments are verified (Score ≥ 75%), your match score will automatically elevate to {projectedMatch}%, unlocking direct one-click application submission with your verified Skill Passport.
              </p>

              <div className="pt-2">
                <Link
                  href={`/jobs/${selectedJobId}`}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <span>View {activeJob.title} Opening</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default function BecomeReadyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Loading roadmap...</p>
          </div>
        </div>
      }
    >
      <BecomeReadyContent />
    </Suspense>
  );
}
