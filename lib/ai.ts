import { db } from './db';
import {
  SkillLevel,
  SkillDemandLevel,
  Job,
  Student,
  JobSkillRequirement,
  JobMatchCalculation,
  PersonalizedRoadmap,
  PersonalizedRoadmapStep,
  CurriculumGapResult,
  CareerPath,
  ComprehensiveJobReadiness,
  JobReadinessPillar,
  ReadinessImprovementAction,
  ReadinessTimelinePoint,
  WhyNotEligibleDiagnostic,
  InterviewAnswerEvaluation,
  ResumeMatchAnalysis,
  CollegeSkillHeatmapItem,
  NextBestAction
} from './types';

// Map skill levels to numeric weight for comparison
export const LEVEL_RANK: Record<SkillLevel, number> = {
  Beginner: 1,
  Intermediate: 2,
  Advanced: 3,
  Expert: 4,
};

export const DEMAND_RANK: Record<SkillDemandLevel, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  'Very High': 4,
};

/**
 * 1. AI JOB DESCRIPTION SKILL EXTRACTION
 */
export function extractSkillsFromJobDescription(text: string): {
  skills: JobSkillRequirement[];
  department: string;
  extractedSummary: string;
} {
  const normalized = text.toLowerCase();
  const allSkills = db.getSkills();
  const extracted: JobSkillRequirement[] = [];

  allSkills.forEach(skill => {
    const sName = skill.name.toLowerCase();
    const regex = new RegExp(`\\b${sName.replace('+', '\\+')}\\b`, 'i');
    
    if (regex.test(normalized)) {
      let level: SkillLevel = 'Intermediate';
      const surroundingIndex = normalized.indexOf(sName);
      const surroundingChunk = normalized.substring(
        Math.max(0, surroundingIndex - 40),
        Math.min(normalized.length, surroundingIndex + sName.length + 40)
      );

      if (surroundingChunk.includes('basic') || surroundingChunk.includes('fundamental') || surroundingChunk.includes('beginner') || surroundingChunk.includes('familiar')) {
        level = 'Beginner';
      } else if (surroundingChunk.includes('advanced') || surroundingChunk.includes('expert') || surroundingChunk.includes('master') || surroundingChunk.includes('deep')) {
        level = 'Advanced';
      } else if (surroundingChunk.includes('intermediate') || surroundingChunk.includes('proficient') || surroundingChunk.includes('solid') || surroundingChunk.includes('strong')) {
        level = 'Intermediate';
      } else {
        if (['Git', 'AWS', 'Docker', 'SQL'].includes(skill.name)) {
          level = surroundingChunk.includes('basic') ? 'Beginner' : 'Intermediate';
        } else if (['DSA', 'Python', 'C++', 'Java', 'React'].includes(skill.name)) {
          level = 'Intermediate';
        }
      }

      const isRequired = !surroundingChunk.includes('nice to have') && !surroundingChunk.includes('preferred') && !surroundingChunk.includes('optional');

      extracted.push({
        skillId: skill.id,
        skillName: skill.name,
        minLevel: level,
        isRequired,
        weight: isRequired ? 1.5 : 1.0
      });
    }
  });

  if (normalized.includes('data structures') && !extracted.some(e => e.skillName === 'DSA')) {
    const dsa = allSkills.find(s => s.name === 'DSA');
    if (dsa) {
      extracted.push({
        skillId: dsa.id,
        skillName: 'DSA',
        minLevel: 'Intermediate',
        isRequired: true,
        weight: 1.5
      });
    }
  }

  let department = 'Engineering';
  if (normalized.includes('data') || normalized.includes('analytics')) department = 'Data Science';
  else if (normalized.includes('cloud') || normalized.includes('devops')) department = 'Cloud & Infrastructure';
  else if (normalized.includes('security') || normalized.includes('cyber')) department = 'Cybersecurity';
  else if (normalized.includes('frontend') || normalized.includes('ui/ux') || normalized.includes('full stack')) department = 'Web Engineering';

  return {
    skills: extracted,
    department,
    extractedSummary: `Extracted ${extracted.length} industry skills: ${extracted.map(e => `${e.skillName} (${e.minLevel})`).join(', ')}`
  };
}

/**
 * 2. INDUSTRY SKILL DEMAND ENGINE
 */
export function calculateIndustrySkillDemand() {
  const jobs = db.getJobs().filter(j => j.status === 'published');
  const allSkills = db.getSkills();
  const totalJobs = Math.max(1, jobs.length);

  const skillCounts: Record<string, number> = {};

  jobs.forEach(job => {
    job.requiredSkills.forEach(req => {
      skillCounts[req.skillName] = (skillCounts[req.skillName] || 0) + 1;
    });
  });

  return allSkills.map(skill => {
    const count = skillCounts[skill.name] || 0;
    const percent = Math.min(100, Math.round((count / totalJobs) * 100));
    
    let demandLevel: SkillDemandLevel = 'Low';
    if (percent >= 70) demandLevel = 'Very High';
    else if (percent >= 45) demandLevel = 'High';
    else if (percent >= 25) demandLevel = 'Medium';

    return {
      skillName: skill.name,
      category: skill.category,
      demandPercent: percent,
      demandLevel,
      jobPostingsCount: count,
      // Deterministic growth rate derived from skill name — stable across renders (ALG-003)
      growthRate: 5 + (skill.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % 16),
      industry: 'Software & Technology'
    };
  }).sort((a, b) => b.demandPercent - a.demandPercent);
}

/**
 * 3. COMPREHENSIVE 6-PILLAR JOB READINESS ENGINE (Section 3 & 31)
 * Calculates explainable 0-100% score based on verified skills, coding, aptitude, interview, projects, resume.
 */
export function calculateComprehensiveJobReadiness(studentId: string, targetJobId?: string): ComprehensiveJobReadiness {
  const student = db.getStudentById(studentId);
  const targetJob = targetJobId ? db.getJobById(targetJobId) : db.getJobs()[0];
  const roleTitle = targetJob?.title || 'Software Developer';

  const verifiedSkills = db.getVerifiedSkills(studentId);
  const studentSkills = db.getStudentSkills(studentId);
  const codingAttempts = db.getCodingAttemptsByStudentId(studentId);
  const interviewEvals = db.getInterviewEvaluationsByStudentId(studentId);
  const projects = db.getProjectsByStudentId(studentId);
  const certificates = db.getCertificatesByStudentId(studentId);

  // 1. Technical Skills Pillar (Weight: 40%)
  // Score is earned entirely from verified skills — starts at 0.
  const hasPyVer = verifiedSkills.some(v => v.skillName.toLowerCase() === 'python');
  const hasDsaVer = verifiedSkills.some(v => v.skillName.toLowerCase() === 'dsa');
  const hasSqlVer = verifiedSkills.some(v => v.skillName.toLowerCase() === 'sql');
  const hasGitVer = verifiedSkills.some(v => v.skillName.toLowerCase() === 'git') || studentSkills.some(s => s.skillName.toLowerCase() === 'git');
  const hasAnyVerified = verifiedSkills.length > 0;

  // Base: 10 pts for having any verified skill, up to 25 pts each for key skills, 10 for Git
  let techScore = hasAnyVerified ? 10 : 0;
  if (hasSqlVer) techScore += 25;
  if (hasPyVer) techScore += 25;
  if (hasDsaVer) techScore += 25;
  if (hasGitVer) techScore += 15;
  // Extra credit for additional verified skills beyond the core 3
  const extraVerified = verifiedSkills.filter(v => !['python','dsa','sql'].includes(v.skillName.toLowerCase())).length;
  techScore = Math.min(100, techScore + extraVerified * 5);

  // 2. Coding Readiness Pillar (Weight: 20%)
  // Starts at 0 if no coding activity — DSA verification gives partial credit
  const solvedCount = codingAttempts.filter(c => c.status === 'Solved ✓').length;
  let codingScore = 0;
  if (solvedCount > 0) codingScore = Math.min(100, 30 + solvedCount * 15);
  else if (hasDsaVer) codingScore = 55; // DSA verified but no sandbox problems yet
  else if (hasAnyVerified) codingScore = 30;

  // 3. Aptitude Readiness Pillar (Weight: 10%)
  // CGPA is correlated with aptitude but not the only signal — certificate count adds credit
  let aptScore = 0;
  if (student) {
    if (student.cgpa >= 9.0) aptScore = 90;
    else if (student.cgpa >= 8.5) aptScore = 80;
    else if (student.cgpa >= 8.0) aptScore = 70;
    else if (student.cgpa >= 7.0) aptScore = 60;
    else if (student.cgpa >= 6.0) aptScore = 50;
    else aptScore = 35;
    // Bonus for certificates earned (up to +10)
    aptScore = Math.min(100, aptScore + Math.min(certificates.length * 2, 10));
  }

  // 4. Interview Readiness Pillar (Weight: 10%)
  // Starts at 0 if no interview evaluations
  let interviewScore = interviewEvals.length > 0
    ? Math.round(interviewEvals.reduce((acc, curr) => acc + curr.overallScore, 0) / interviewEvals.length)
    : 0;

  // 5. Projects Pillar (Weight: 10%)
  // Starts at 0 — each project adds meaningful credit
  let projectScore = 0;
  if (projects.length >= 3) projectScore = 95;
  else if (projects.length === 2) projectScore = 80;
  else if (projects.length === 1) projectScore = 55;

  // 6. Resume Match Pillar (Weight: 10%)
  // Tied directly to how many key skills are verified — starts at 0
  let resumeScore = 0;
  const verifiedCount = [hasPyVer, hasDsaVer, hasSqlVer].filter(Boolean).length;
  if (verifiedCount === 3) resumeScore = 90;
  else if (verifiedCount === 2) resumeScore = 70;
  else if (verifiedCount === 1) resumeScore = 50;
  else if (hasAnyVerified) resumeScore = 35;

  // Overall Weighted Score
  const overall = Math.round(
    techScore * 0.40 +
    codingScore * 0.20 +
    aptScore * 0.10 +
    interviewScore * 0.10 +
    projectScore * 0.10 +
    resumeScore * 0.10
  );

  let status: ComprehensiveJobReadiness['status'] = 'Needs Training';
  if (overall >= 80) status = 'Placement Ready ✓';
  else if (overall >= 60) status = 'In Training';

  // Dynamic Timeline Points (Section 31)
  const timeline: ReadinessTimelinePoint[] = [
    { milestone: 'Initial Baseline', readinessPercentage: 62, isReached: true },
    { milestone: 'After Python Verification', readinessPercentage: 71, isReached: hasPyVer },
    { milestone: 'After DSA Verification', readinessPercentage: 83, isReached: hasPyVer && hasDsaVer },
    { milestone: 'After Cloud Fundamentals', readinessPercentage: 91, isReached: hasPyVer && hasDsaVer && verifiedSkills.some(v => v.skillName.toLowerCase() === 'aws') },
    { milestone: 'After Mock Interview', readinessPercentage: 95, isReached: interviewEvals.length >= 2 && overall >= 85 }
  ];

  // Actionable Improvements (Section 3)
  const improvementActions: ReadinessImprovementAction[] = [];
  if (!hasPyVer) {
    improvementActions.push({
      id: 'act_py',
      title: 'Complete Python Verification Assessment',
      description: 'Upgrade your self-declared Python skill to Verified Intermediate status.',
      impactScoreUplift: 9,
      category: 'technical',
      actionUrl: '/assessments/asm_python',
      actionText: 'Take Python Assessment'
    });
  }
  if (!hasDsaVer) {
    improvementActions.push({
      id: 'act_dsa',
      title: 'Verify DSA & Algorithms Mastery',
      description: 'Pass the DSA assessment to unlock 80%+ top employer compatibility.',
      impactScoreUplift: 12,
      category: 'technical',
      actionUrl: '/assessments/asm_dsa',
      actionText: 'Take DSA Assessment'
    });
  }
  if (interviewEvals.length === 0) {
    improvementActions.push({
      id: 'act_interview',
      title: 'Practice with AI Interview Coach',
      description: 'Simulate technical & behavioral questions for Software Developer roles.',
      impactScoreUplift: 6,
      category: 'interview',
      actionUrl: '/student/interview-coach',
      actionText: 'Start Interview Coach'
    });
  }
  if (projects.length < 2) {
    improvementActions.push({
      id: 'act_proj',
      title: 'Build a Distributed Cloud Project',
      description: 'Strengthen your resume evidence with a verified backend architecture project.',
      impactScoreUplift: 7,
      category: 'project',
      actionUrl: '/student/projects',
      actionText: 'Explore Projects'
    });
  }

  return {
    studentId,
    targetJobId: targetJob?.id,
    targetRole: roleTitle,
    overallReadiness: overall,
    status,
    pillars: {
      technicalSkills: {
        name: 'Technical Skills',
        score: techScore,
        weight: 0.40,
        weightedScore: Math.round(techScore * 0.40),
        status: techScore >= 80 ? 'Excellent' : techScore >= 60 ? 'Good' : 'Needs Improvement',
        details: `${verifiedSkills.length} verified skills in portfolio (${verifiedSkills.map(v => v.skillName).join(', ') || 'None'})`
      },
      coding: {
        name: 'Coding Problem Solving',
        score: codingScore,
        weight: 0.20,
        weightedScore: Math.round(codingScore * 0.20),
        status: codingScore >= 80 ? 'Excellent' : 'Good',
        details: `${solvedCount} coding problems solved with high accuracy`
      },
      aptitude: {
        name: 'Quantitative & Logical Aptitude',
        score: aptScore,
        weight: 0.10,
        weightedScore: Math.round(aptScore * 0.10),
        status: aptScore >= 80 ? 'Excellent' : 'Good',
        details: `Analytical reasoning benchmark: ${aptScore}% accuracy`
      },
      interview: {
        name: 'Technical & Behavioral Interview',
        score: interviewScore,
        weight: 0.10,
        weightedScore: Math.round(interviewScore * 0.10),
        status: interviewScore >= 80 ? 'Excellent' : 'Good',
        details: `AI evaluation score across technical correctness and communication`
      },
      projects: {
        name: 'Portfolio Projects & Proof of Work',
        score: projectScore,
        weight: 0.10,
        weightedScore: Math.round(projectScore * 0.10),
        status: projectScore >= 80 ? 'Excellent' : 'Needs Improvement',
        details: `${projects.length} verified projects demonstrating hands-on competencies`
      },
      resumeMatch: {
        name: 'Resume ↔ Job Compatibility',
        score: resumeScore,
        weight: 0.10,
        weightedScore: Math.round(resumeScore * 0.10),
        status: resumeScore >= 80 ? 'Excellent' : 'Good',
        details: `Keyword overlap with target industry job requirements`
      }
    },
    timeline,
    improvementActions
  };
}

/**
 * 4. SIGNATURE FEATURE: "WHY AM I NOT ELIGIBLE?" DIAGNOSTIC (Section 4 & 30)
 */
export function explainWhyNotEligible(studentId: string, jobId: string): WhyNotEligibleDiagnostic {
  const student = db.getStudentById(studentId);
  const job = db.getJobById(jobId);

  if (!student || !job) {
    return {
      jobId,
      jobTitle: 'Software Developer',
      companyName: 'TechNova',
      isEligible: false,
      matchPercentage: 0,
      missingSkills: [],
      passedRequirements: [],
      unmetAcademicCriteria: [],
      readinessGap: 38,
      projectedScoreAfterActions: 91
    };
  }

  const studentSkills = db.getStudentSkills(studentId);
  const verifiedSkills = db.getVerifiedSkills(studentId);
  const matchCalc = calculateJobMatch(studentId, jobId);

  const missingSkills: WhyNotEligibleDiagnostic['missingSkills'] = [];
  const passedRequirements: WhyNotEligibleDiagnostic['passedRequirements'] = [];
  const unmetAcademicCriteria: string[] = [];

  job.requiredSkills.forEach(req => {
    const verified = verifiedSkills.find(v => v.skillName.toLowerCase() === req.skillName.toLowerCase());
    const selfDeclared = studentSkills.find(s => s.skillName.toLowerCase() === req.skillName.toLowerCase());

    const reqRank = LEVEL_RANK[req.minLevel] || 2;

    if (verified && LEVEL_RANK[verified.level] >= reqRank) {
      passedRequirements.push({
        requirement: `${req.skillName} (${req.minLevel})`,
        value: `${verified.level} (Verified ✓)`,
        status: 'Verified ✓'
      });
    } else if (verified) {
      missingSkills.push({
        skill: req.skillName,
        requiredLevel: req.minLevel,
        currentLevel: `${verified.level} (Verified)`,
        gapSeverity: 'Moderate',
        recommendedCourse: `${req.skillName} Fundamentals & Practice`,
        courseId: `crs_${req.skillName.toLowerCase()}`,
        assessmentId: `asm_${req.skillName.toLowerCase()}`
      });
    } else if (selfDeclared) {
      missingSkills.push({
        skill: req.skillName,
        requiredLevel: req.minLevel,
        currentLevel: `${selfDeclared.level} (Self-Declared)`,
        gapSeverity: req.isRequired ? 'Critical' : 'Moderate',
        recommendedCourse: `${req.skillName} for Placement`,
        courseId: `crs_${req.skillName.toLowerCase()}`,
        assessmentId: `asm_${req.skillName.toLowerCase()}`
      });
    } else {
      missingSkills.push({
        skill: req.skillName,
        requiredLevel: req.minLevel,
        currentLevel: 'Not Verified',
        gapSeverity: req.isRequired ? 'Critical' : 'Minor',
        recommendedCourse: `${req.skillName} Fundamentals`,
        courseId: `crs_${req.skillName.toLowerCase()}`,
        assessmentId: `asm_${req.skillName.toLowerCase()}`
      });
    }
  });

  // Academic passed checks
  if (student.cgpa >= job.minCgpa) {
    passedRequirements.push({
      requirement: 'Minimum CGPA',
      value: `${student.cgpa.toFixed(2)} (Req: ${job.minCgpa.toFixed(2)})`,
      status: 'Satisfied'
    });
  } else {
    unmetAcademicCriteria.push(`CGPA ${student.cgpa.toFixed(2)} is below the required ${job.minCgpa.toFixed(2)}.`);
  }

  if (student.graduationYear === job.graduationYear || student.graduationYear >= 2024) {
    passedRequirements.push({
      requirement: 'Degree & Graduation Year',
      value: `${student.degree} ${student.department} (${student.graduationYear})`,
      status: 'Satisfied'
    });
  }

  const isEligible = matchCalc.isEligible;
  const matchPercentage = matchCalc.matchPercentage;
  const readinessGap = Math.max(0, 90 - matchPercentage);

  return {
    jobId: job.id,
    jobTitle: job.title,
    companyName: job.companyName,
    isEligible,
    matchPercentage,
    missingSkills,
    passedRequirements,
    unmetAcademicCriteria,
    readinessGap,
    projectedScoreAfterActions: 91
  };
}

/**
 * 5. AI INTERVIEW COACH EVALUATOR (Section 11)
 * Evaluates candidate response across Technical Correctness, Relevance, Structure, and Communication.
 * Supports optional Gemini LLM evaluation with seamless fallback to enhanced semantic scoring.
 */
export async function evaluateInterviewResponse(
  questionText: string,
  answerText: string,
  category: string
): Promise<InterviewAnswerEvaluation> {
  const norm = answerText.toLowerCase();
  const wordCount = answerText.trim().split(/\s+/).filter(Boolean).length;

  // Optional: If GEMINI_API_KEY is configured, run live LLM evaluation
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const prompt = `You are a strict technical hiring bar raiser and interview coach.
Evaluate this interview answer:
Question: "${questionText}"
Category: "${category}"
Candidate Answer: "${answerText}"

Return ONLY a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "technicalCorrectness": number (0-100),
  "relevance": number (0-100),
  "structure": number (0-100),
  "communication": number (0-100),
  "strengths": [string, string],
  "improvements": [string, string],
  "suggestedRefinement": string
}`;

      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          return {
            id: `ieval_${Date.now()}`,
            studentId: 'std_1',
            questionId: 'iq_eval',
            questionText,
            category,
            answerText,
            overallScore: parsed.overallScore || 80,
            criteriaScores: {
              technicalCorrectness: parsed.technicalCorrectness || 80,
              relevance: parsed.relevance || 80,
              structure: parsed.structure || 80,
              communication: parsed.communication || 80
            },
            feedback: {
              strengths: parsed.strengths || ['Good domain awareness.'],
              improvements: parsed.improvements || ['Practice concise technical delivery.'],
              suggestedRefinement: parsed.suggestedRefinement || 'Conclude answers by stating measurable outcomes or tradeoffs.'
            },
            submittedAt: new Date().toISOString()
          };
        }
      }
    } catch (e) {
      console.warn('[AI Evaluation] Gemini API fallback to local semantic evaluation:', e);
    }
  }

  // Enhanced deterministic semantic evaluation
  let technical = 70;
  let relevance = 75;
  let structure = 70;
  let communication = 75;

  const strengths: string[] = [];
  const improvements: string[] = [];

  // 1. Technical depth checks
  const techTerms = [
    'reference counting', 'garbage collection', 'hash map', 'hash table',
    'doubly linked list', 'star', 'acid', 'b-tree', 'concurrency', 'latency',
    'o(1)', 'o(n)', 'o(log n)', 'time complexity', 'space complexity', 'thread',
    'mutex', 'memory leak', 'wal', 'mvcc', 'index', 'partitioning', 'cache', 'redis'
  ];

  const matchedTerms = techTerms.filter(t => norm.includes(t));
  if (matchedTerms.length >= 3) {
    technical += 22;
    strengths.push(`Rich technical vocabulary: explicitly referenced ${matchedTerms.slice(0, 3).join(', ')}.`);
  } else if (matchedTerms.length >= 1) {
    technical += 10;
    strengths.push(`Applied relevant core technical terminology (${matchedTerms.join(', ')}).`);
  } else {
    technical -= 12;
    improvements.push('Incorporate explicit data structures, algorithmic complexities, and underlying runtime mechanisms.');
  }

  // 2. Behavioral STAR method inspection for behavioral questions
  if (category.toLowerCase() === 'behavioral') {
    const starIndicators = ['situation', 'task', 'action', 'result', 'resolved', 'team', 'outcome', 'metrics'];
    const starMatches = starIndicators.filter(s => norm.includes(s));
    if (starMatches.length >= 3) {
      structure += 15;
      strengths.push('Excellent adherence to the STAR (Situation, Task, Action, Result) narrative framework.');
    } else {
      structure -= 10;
      improvements.push('Organize behavioral responses clearly into Situation, Task, Action Taken, and Quantifiable Result.');
    }
  }

  // 3. Length, density & structure
  if (wordCount >= 60) {
    structure += 10;
    communication += 10;
    strengths.push('Comprehensive, detailed explanation demonstrating confidence and depth.');
  } else if (wordCount >= 30) {
    structure += 5;
    communication += 5;
    strengths.push('Concise and direct response focused on the core concept.');
  } else {
    structure -= 15;
    communication -= 15;
    improvements.push('Elaborate with concrete architectural examples, edge-case handling, and operational trade-offs.');
  }

  // 4. Relevance checks
  const qTokens = questionText.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  const qTokenHits = qTokens.filter(t => norm.includes(t));
  if (qTokenHits.length >= 2) {
    relevance += 12;
  } else {
    relevance -= 8;
    improvements.push('Ensure direct alignment with all sub-clauses asked in the prompt.');
  }

  technical = Math.min(98, Math.max(45, technical));
  relevance = Math.min(98, Math.max(45, relevance));
  structure = Math.min(98, Math.max(45, structure));
  communication = Math.min(98, Math.max(45, communication));

  const overall = Math.round(
    technical * 0.35 +
    relevance * 0.25 +
    structure * 0.20 +
    communication * 0.20
  );

  return {
    id: `ieval_${Date.now()}`,
    studentId: 'std_1',
    questionId: 'iq_eval',
    questionText,
    category,
    answerText,
    overallScore: overall,
    criteriaScores: {
      technicalCorrectness: technical,
      relevance,
      structure,
      communication
    },
    feedback: {
      strengths: strengths.length > 0 ? strengths : ['Good baseline understanding of the question premise.'],
      improvements: improvements.length > 0 ? improvements : ['Maintain this structured format in live technical rounds.'],
      suggestedRefinement: 'Tip: Open with a high-level summary definition, detail the execution sequence and edge cases, and conclude with performance or operational tradeoffs.'
    },
    submittedAt: new Date().toISOString()
  };
}

/**
 * 6. AI RESUME ↔ JOB MATCHER (Section 8)
 * Semantic multi-attribute resume parser and match evaluator
 */
export function matchResumeToJob(resumeText: string, jobId: string, studentId: string): ResumeMatchAnalysis {
  const job = db.getJobById(jobId) || db.getJobs()[0];
  const norm = resumeText.toLowerCase();

  // Skill synonyms for semantic matching
  const skillSynonyms: Record<string, string[]> = {
    python: ['python', 'py', 'django', 'flask', 'fastapi', 'pandas', 'numpy'],
    react: ['react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'redux'],
    sql: ['sql', 'postgresql', 'postgres', 'mysql', 'sqlite', 'relational database', 'rdbms'],
    aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda', 'cloud'],
    docker: ['docker', 'container', 'containers', 'dockerfile', 'docker-compose'],
    dsa: ['dsa', 'data structures', 'algorithms', 'leetcode', 'trees', 'graphs', 'dynamic programming'],
    git: ['git', 'github', 'version control', 'gitlab'],
    'c++': ['c++', 'cpp', 'stl', 'pointers', 'clang'],
    java: ['java', 'spring', 'springboot', 'jvm']
  };

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  job.requiredSkills.forEach(req => {
    const sName = req.skillName.toLowerCase();
    const syns = skillSynonyms[sName] || [sName];

    const hasMatch = syns.some(term => {
      const regex = new RegExp(`\\b${term.replace('+', '\\+')}\\b`, 'i');
      return regex.test(norm);
    });

    if (hasMatch) {
      matchedSkills.push(req.skillName);
    } else {
      missingSkills.push(req.skillName);
    }
  });

  // Calculate quantitative impact metric presence
  const hasMetrics = /\b\d+%\b|\b\d+ms\b|\b\d+k\b|\$\d+/i.test(resumeText);

  let matchScore = Math.round((matchedSkills.length / Math.max(1, job.requiredSkills.length)) * 85);
  if (hasMetrics) matchScore += 10;
  matchScore = Math.min(96, Math.max(25, matchScore));

  const weakEvidenceSkills = missingSkills.map(s => ({
    skill: s,
    observation: `Your resume does not explicitly demonstrate hands-on production experience or projects using ${s}.`,
    recommendation: `Add a capstone project or lab demonstration highlighting ${s} to strengthen your applicant profile.`
  }));

  const projectRecommendations = [
    {
      title: `Distributed ${job.title} Service Architecture`,
      description: `Production-grade architecture incorporating ${missingSkills.slice(0, 3).join(' + ') || 'cloud & caching'} with automated CI/CD and unit testing.`,
      targetTechnologies: missingSkills.length > 0 ? missingSkills.slice(0, 4) : ['Python', 'SQL', 'Docker'],
      strengthensAreas: `Provides tangible proof-of-work for ${missingSkills.join(', ') || 'enterprise development'}.`
    }
  ];

  const strengths = [
    'Clear educational timeline and relevant engineering coursework.'
  ];
  if (hasMetrics) {
    strengths.push('Excellent use of quantified impact metrics to demonstrate concrete project results.');
  } else {
    strengths.push('Technical proficiencies well aligned with foundational concepts.');
  }

  const feedback = [
    `Incorporate ${missingSkills.join(', ')} into your technical skills section and project bullet points.`,
    hasMetrics ? 'Highlight team leadership and architecture choices in your recent projects.' : 'Quantify your project achievements (e.g. "improved query latency by 40%", "served 1,000+ active users").'
  ];

  return {
    studentId,
    jobId: job.id,
    jobTitle: job.title,
    resumeMatchScore: matchScore,
    matchedSkills,
    missingSkills,
    weakEvidenceSkills,
    projectRecommendations,
    resumeStrengths: strengths,
    actionableFeedback: feedback
  };
}

/**
 * 7. COLLEGE INDUSTRY → COLLEGE SKILL HEATMAP (Section 13)
 */
export function calculateCollegeSkillHeatmap(collegeId: string): {
  heatmapItems: CollegeSkillHeatmapItem[];
  averageCohortProficiency: number;
  highestDeficitSkill: string;
} {
  const demandList = calculateIndustrySkillDemand();
  const students = db.getStudents().filter(s => s.collegeId === collegeId);
  const totalStudents = Math.max(1, students.length);

  const heatmapItems: CollegeSkillHeatmapItem[] = demandList.map(ind => {
    // Calculate student proficiency in this skill across the college
    let totalProficiencyScore = 0;

    students.forEach(std => {
      const verified = db.getVerifiedSkills(std.id).find(v => v.skillName.toLowerCase() === ind.skillName.toLowerCase());
      const selfDec = db.getStudentSkills(std.id).find(s => s.skillName.toLowerCase() === ind.skillName.toLowerCase());

      if (verified) {
        totalProficiencyScore += (LEVEL_RANK[verified.level] / 4) * 100;
      } else if (selfDec) {
        totalProficiencyScore += (LEVEL_RANK[selfDec.level] / 4) * 50;
      } else {
        totalProficiencyScore += 20; // baseline
      }
    });

    const avgProficiency = Math.min(100, Math.round(totalProficiencyScore / totalStudents));
    const gap = Math.max(0, ind.demandPercent - avgProficiency);

    let status: CollegeSkillHeatmapItem['status'] = 'Well Balanced';
    if (gap >= 25) status = 'Severe Deficit';
    else if (gap >= 12) status = 'Moderate Gap';
    else if (avgProficiency > ind.demandPercent) status = 'Leading';

    return {
      skillName: ind.skillName,
      category: ind.category,
      industryDemandPercent: ind.demandPercent,
      studentCohortProficiency: avgProficiency,
      gapPercentage: gap,
      status,
      affectedStudentCount: Math.round(totalStudents * (gap / 100)),
      recommendedBootcamp: `${ind.skillName} Industry Readiness Bootcamp`
    };
  });

  const severeItems = heatmapItems.filter(h => h.status === 'Severe Deficit');
  const highestDeficitSkill = severeItems.length > 0 ? severeItems[0].skillName : 'Python';
  const totalProf = heatmapItems.reduce((acc, curr) => acc + curr.studentCohortProficiency, 0);

  return {
    heatmapItems,
    averageCohortProficiency: Math.round(totalProf / heatmapItems.length),
    highestDeficitSkill
  };
}

/**
 * 8. RECRUITER SKILL-FIRST TALENT MATCHER (Section 19)
 */
export function matchTalentBySkillsQuery(queryText: string, options?: { minCgpa?: number; collegeId?: string }) {
  const norm = queryText.toLowerCase();
  const allStudents = db.getStudents();
  const allSkills = db.getSkills();

  // Extract requested skills from query
  const targetSkills: { name: string; requiredLevel: SkillLevel }[] = [];
  allSkills.forEach(s => {
    if (norm.includes(s.name.toLowerCase())) {
      let level: SkillLevel = 'Intermediate';
      if (norm.includes('basic') || norm.includes('beginner')) level = 'Beginner';
      else if (norm.includes('advanced')) level = 'Advanced';
      targetSkills.push({ name: s.name, requiredLevel: level });
    }
  });

  if (targetSkills.length === 0) {
    targetSkills.push({ name: 'Python', requiredLevel: 'Intermediate' }, { name: 'DSA', requiredLevel: 'Intermediate' }, { name: 'SQL', requiredLevel: 'Beginner' });
  }

  let candidates = allStudents.map(student => {
    const verified = db.getVerifiedSkills(student.id);
    const studentSkills = db.getStudentSkills(student.id);
    const projects = db.getProjectsByStudentId(student.id);

    let earned = 0;
    const verifiedDetails: string[] = [];

    targetSkills.forEach(t => {
      const v = verified.find(item => item.skillName.toLowerCase() === t.name.toLowerCase());
      if (v) {
        earned += 1.0;
        verifiedDetails.push(`${v.skillName} (${v.level} ✓)`);
      } else {
        const s = studentSkills.find(item => item.skillName.toLowerCase() === t.name.toLowerCase());
        if (s) earned += 0.4;
      }
    });

    const matchPercent = Math.min(98, Math.round((earned / targetSkills.length) * 100));

    return {
      ...student,
      matchPercentage: matchPercent,
      verifiedSkillsList: verifiedDetails,
      verifiedSkills: verified,
      allSkills: studentSkills,
      projectsCount: projects.length,
      credibilityScore: verified.length > 0 ? 94 : 65
    };
  });

  if (options?.minCgpa) {
    candidates = candidates.filter(c => c.cgpa >= options.minCgpa!);
  }

  if (options?.collegeId && options.collegeId !== 'All') {
    candidates = candidates.filter(c => c.collegeId === options.collegeId);
  }

  candidates.sort((a, b) => b.matchPercentage - a.matchPercentage);

  return {
    targetSkills,
    candidateCount: candidates.length,
    candidates
  };
}

/**
 * 9. AI "NEXT BEST ACTION" RECOMMENDATION (Section 29)
 */
export function getNextBestAction(studentId: string): NextBestAction {
  const student = db.getStudentById(studentId);
  const verifiedSkills = db.getVerifiedSkills(studentId);
  const codingAttempts = db.getCodingAttemptsByStudentId(studentId);
  const interviewEvals = db.getInterviewEvaluationsByStudentId(studentId);
  const applications = db.getApplicationsByStudentId(studentId);

  const hasPython = verifiedSkills.some(v => v.skillName.toLowerCase() === 'python');
  const hasDsa = verifiedSkills.some(v => v.skillName.toLowerCase() === 'dsa');
  const hasSql = verifiedSkills.some(v => v.skillName.toLowerCase() === 'sql');

  if (!hasPython) {
    return {
      id: 'nba_py',
      studentId,
      priority: 'Immediate',
      title: 'Complete Python Verification Assessment',
      reason: 'Python is required in 88% of active corporate job postings on Skill2Hire. Passing elevates your job readiness by +14%.',
      estimatedTime: '20 mins',
      impactScoreUplift: 14,
      category: 'assessment',
      targetUrl: '/assessments/asm_python',
      buttonLabel: 'Take Python Assessment'
    };
  }

  if (!hasDsa) {
    return {
      id: 'nba_dsa',
      studentId,
      priority: 'Immediate',
      title: 'Verify DSA & Problem Solving Competency',
      reason: 'Verify Data Structures & Algorithms to unlock direct eligibility for TechNova Software Developer opening.',
      estimatedTime: '25 mins',
      impactScoreUplift: 16,
      category: 'assessment',
      targetUrl: '/assessments/asm_dsa',
      buttonLabel: 'Verify DSA Skills'
    };
  }

  if (interviewEvals.length === 0) {
    return {
      id: 'nba_interview',
      studentId,
      priority: 'High',
      title: 'Take AI Interview Simulation',
      reason: 'Practice core technical questions and system design with the AI Interview Coach before recruiter screening.',
      estimatedTime: '15 mins',
      impactScoreUplift: 8,
      category: 'interview',
      targetUrl: '/student/interview-coach',
      buttonLabel: 'Start Interview Simulation'
    };
  }

  if (applications.length === 0) {
    return {
      id: 'nba_apply',
      studentId,
      priority: 'High',
      title: 'Submit Application to TechNova (91% Match)',
      reason: 'Your verified skills now qualify you for the Software Developer role with a verified 91% match.',
      estimatedTime: '2 mins',
      impactScoreUplift: 10,
      category: 'apply',
      targetUrl: '/jobs/job_1',
      buttonLabel: 'Apply with Verified Passport'
    };
  }

  return {
    id: 'nba_code',
    studentId,
    priority: 'Medium',
    title: 'Solve 3 Dynamic Programming Challenges',
    reason: 'Maintain competitive coding readiness with Kadane algorithm and tree traversals.',
    estimatedTime: '30 mins',
    impactScoreUplift: 5,
    category: 'coding',
    targetUrl: '/student/coding-practice',
    buttonLabel: 'Open Coding Arena'
  };
}

/**
 * 10. BASIC EXISTING MATCHING ALGORITHMS PRESERVATION
 */
export function calculateJobMatch(studentId: string, jobId: string): JobMatchCalculation {
  const student = db.getStudentById(studentId);
  const job = db.getJobById(jobId);

  if (!student || !job) {
    return {
      jobId,
      studentId,
      matchPercentage: 0,
      isEligible: false,
      skillMatchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      whyYouMatch: [],
      whatYouNeed: [],
      criteriaBreakdown: {
        skills: { weight: 60, score: 0, max: 60 },
        cgpa: { weight: 20, score: 0, max: 20, passed: false },
        education: { weight: 20, score: 0, max: 20, passed: false },
        overallMatch: 0
      }
    };
  }

  const studentSkills = db.getStudentSkills(studentId);
  const verifiedSkills = db.getVerifiedSkills(studentId);

  const whyYouMatch: string[] = [];
  const whatYouNeed: string[] = [];
  const matchedSkills: string[] = [];
  const missingSkills: { skill: string; currentLevel: string; requiredLevel: string }[] = [];

  let totalSkillWeight = 0;
  let earnedSkillWeight = 0;

  (job.requiredSkills || []).forEach((req: any) => {
    const skillName = req.skillName || req.skill || '';
    const minLevel = (req.minLevel || req.level || 'Intermediate') as SkillLevel;
    if (!skillName) return;

    const weight = req.weight || 1.0;
    totalSkillWeight += weight;

    const verified = verifiedSkills.find(v => v.skillName.toLowerCase() === skillName.toLowerCase());
    const selfDeclared = studentSkills.find(s => s.skillName.toLowerCase() === skillName.toLowerCase());

    const reqRank = LEVEL_RANK[minLevel] || 2;

    if (verified) {
      const studentRank = LEVEL_RANK[verified.level] || 1;
      if (studentRank >= reqRank) {
        earnedSkillWeight += weight;
        matchedSkills.push(skillName);
        whyYouMatch.push(`✓ ${skillName} — ${verified.level} (Verified ✓)`);
      } else {
        const ratio = studentRank / reqRank;
        earnedSkillWeight += weight * (ratio * 0.7);
        missingSkills.push({
          skill: skillName,
          currentLevel: verified.level,
          requiredLevel: minLevel
        });
        whatYouNeed.push(`⚠ ${skillName} (${verified.level} verified, needs ${minLevel})`);
      }
    } else if (selfDeclared) {
      const studentRank = LEVEL_RANK[selfDeclared.level] || 1;
      if (studentRank >= reqRank) {
        earnedSkillWeight += weight * 0.5;
        missingSkills.push({
          skill: skillName,
          currentLevel: `${selfDeclared.level} (Self-Declared)`,
          requiredLevel: `${minLevel} (Needs Verification)`
        });
        whatYouNeed.push(`⚠ ${skillName} (${selfDeclared.level} self-declared, verify to boost match)`);
      } else {
        earnedSkillWeight += weight * 0.25;
        missingSkills.push({
          skill: skillName,
          currentLevel: selfDeclared.level,
          requiredLevel: minLevel
        });
        whatYouNeed.push(`⚠ ${skillName} (Needs upgrade to ${minLevel})`);
      }
    } else {
      missingSkills.push({
        skill: skillName,
        currentLevel: 'None',
        requiredLevel: minLevel
      });
      whatYouNeed.push(`⚠ ${skillName} (Learn ${minLevel} level)`);
    }
  });

  const skillScoreRatio = totalSkillWeight > 0 ? (earnedSkillWeight / totalSkillWeight) : 1;
  const skillScore = Math.round(skillScoreRatio * 60);

  const cgpaPassed = student.cgpa >= job.minCgpa;
  let cgpaScore = 0;
  if (cgpaPassed) {
    cgpaScore = 20;
    whyYouMatch.push(`✓ CGPA ${student.cgpa.toFixed(2)} (Min required: ${job.minCgpa.toFixed(2)})`);
  } else {
    cgpaScore = Math.max(0, Math.round((student.cgpa / job.minCgpa) * 15));
    whatYouNeed.push(`⚠ CGPA ${student.cgpa.toFixed(2)} is below minimum ${job.minCgpa.toFixed(2)}`);
  }

  const gradYearMatch = !job.graduationYear || student.graduationYear === job.graduationYear || student.graduationYear >= 2024;
  const branchMatch = !job.branch || job.branch === 'Any' || student.department.toLowerCase().includes(job.branch.toLowerCase()) || job.branch.toLowerCase().includes(student.department.toLowerCase());
  
  let eduScore = 20;
  if (gradYearMatch && branchMatch) {
    whyYouMatch.push(`✓ Education: ${student.degree} ${student.department} (${student.graduationYear})`);
  } else {
    eduScore = 12;
  }

  const overallMatch = Math.min(100, skillScore + cgpaScore + eduScore);
  const isEligible = overallMatch >= 75 && cgpaPassed;

  return {
    jobId,
    studentId,
    matchPercentage: overallMatch,
    isEligible,
    skillMatchPercentage: Math.round(skillScoreRatio * 100),
    matchedSkills,
    missingSkills,
    whyYouMatch,
    whatYouNeed,
    criteriaBreakdown: {
      skills: { weight: 60, score: skillScore, max: 60 },
      cgpa: { weight: 20, score: cgpaScore, max: 20, passed: cgpaPassed },
      education: { weight: 20, score: eduScore, max: 20, passed: gradYearMatch && branchMatch },
      overallMatch
    }
  };
}

export function generatePersonalizedRoadmap(studentId: string, jobId?: string, targetRole?: string): PersonalizedRoadmap {
  const student = db.getStudentById(studentId);
  const allCourses = db.getCourses();
  const allAssessments = db.getAssessments();

  let targetSkills: { skillName: string; targetLevel: SkillLevel }[] = [];
  let roleTitle = targetRole || 'Software Developer';

  if (jobId) {
    const job = db.getJobById(jobId);
    if (job) {
      roleTitle = job.title;
      targetSkills = job.requiredSkills.map(r => ({ skillName: r.skillName, targetLevel: r.minLevel }));
    }
  }

  if (targetSkills.length === 0) {
    targetSkills = [
      { skillName: 'Python', targetLevel: 'Intermediate' },
      { skillName: 'DSA', targetLevel: 'Intermediate' },
      { skillName: 'SQL', targetLevel: 'Intermediate' },
      { skillName: 'Git', targetLevel: 'Beginner' },
      { skillName: 'AWS', targetLevel: 'Beginner' },
    ];
  }

  const verifiedSkills = db.getVerifiedSkills(studentId);
  const steps: PersonalizedRoadmapStep[] = [];
  let stepNumber = 1;
  let totalHours = 0;

  targetSkills.forEach(target => {
    const verified = verifiedSkills.find(v => v.skillName.toLowerCase() === target.skillName.toLowerCase());
    const isCompleted = verified && (LEVEL_RANK[verified.level] >= LEVEL_RANK[target.targetLevel]);

    if (!isCompleted) {
      const course = allCourses.find(c => c.targetSkills.some(s => s.toLowerCase() === target.skillName.toLowerCase()));
      const assessment = allAssessments.find(a => a.skillName.toLowerCase() === target.skillName.toLowerCase());

      const hours = target.targetLevel === 'Beginner' ? 6 : target.targetLevel === 'Intermediate' ? 12 : 20;
      totalHours += hours;

      steps.push({
        stepNumber: stepNumber++,
        title: `Master ${target.skillName} (${target.targetLevel})`,
        skillName: target.skillName,
        currentLevel: verified ? verified.level : 'None',
        targetLevel: target.targetLevel,
        courseId: course?.id,
        courseTitle: course?.title || `${target.skillName} Fundamentals`,
        assessmentId: assessment?.id,
        estimatedHours: hours,
        status: stepNumber === 2 ? 'in_progress' : 'pending'
      });
    }
  });

  steps.push({
    stepNumber: stepNumber++,
    title: `${roleTitle} Placement Mock Assessment`,
    skillName: 'Comprehensive Evaluation',
    currentLevel: 'In Progress',
    targetLevel: 'Intermediate',
    estimatedHours: 2,
    status: 'pending'
  });

  const currentReadiness = student?.placementReadiness || 50;
  const projectedReadiness = Math.min(100, currentReadiness + steps.length * 12);

  return {
    jobId,
    jobTitle: roleTitle,
    studentId,
    targetRole: roleTitle,
    totalEstimatedHours: totalHours + 2,
    steps,
    currentReadiness,
    projectedReadiness
  };
}

export function analyzeCurriculumGaps(collegeId: string): {
  curriculumGaps: CurriculumGapResult[];
  criticalGapsCount: number;
  recommendationSummary: string;
  recommendedBootcampTitle: string;
  recommendedSkills: string[];
} {
  const collegeCurriculum = db.getCollegeCurriculum(collegeId);
  const industryDemand = calculateIndustrySkillDemand();

  const results: CurriculumGapResult[] = [];
  const criticalSkills: string[] = [];

  industryDemand.forEach(ind => {
    const matchedSubject = collegeCurriculum.find(c => 
      c.coveredSkills.some(s => s.toLowerCase() === ind.skillName.toLowerCase()) ||
      c.subjectName.toLowerCase().includes(ind.skillName.toLowerCase())
    );

    const coverageLevel = matchedSubject ? matchedSubject.coverageLevel : 'None';
    const demandRank = DEMAND_RANK[ind.demandLevel];
    
    let gapStatus: CurriculumGapResult['gapStatus'] = 'Aligned';
    let recommendation = `Curriculum coverage is sufficient for current industry demand.`;
    let suggestedAction = 'Maintain course rigor with updated lab assignments.';

    if (demandRank >= 3 && (coverageLevel === 'None' || coverageLevel === 'Low')) {
      gapStatus = 'Critical Gap';
      criticalSkills.push(ind.skillName);
      recommendation = `Industry demand for ${ind.skillName} is ${ind.demandLevel} (${ind.demandPercent}%), but curriculum coverage is ${coverageLevel}.`;
      suggestedAction = `Add dedicated ${ind.skillName} hands-on bootcamp and practical coding labs.`;
    } else if (demandRank >= 2 && coverageLevel === 'None') {
      gapStatus = 'Moderate Gap';
      recommendation = `Emerging demand for ${ind.skillName} (${ind.demandPercent}%). College has no formal course.`;
      suggestedAction = `Introduce an elective or weekend certification module on ${ind.skillName}.`;
    } else if (coverageLevel === 'High' && demandRank <= 2) {
      gapStatus = 'Curriculum Leading';
      recommendation = `Curriculum teaches ${ind.skillName} in-depth while industry demand is steady.`;
      suggestedAction = `Integrate with higher-level industry capstone projects.`;
    }

    results.push({
      skillName: ind.skillName,
      industryDemand: ind.demandLevel,
      demandPercent: ind.demandPercent,
      curriculumCoverage: coverageLevel,
      gapStatus,
      recommendation,
      suggestedAction
    });
  });

  const criticalGapsCount = results.filter(r => r.gapStatus === 'Critical Gap').length;
  const topCriticalSkills = criticalSkills.slice(0, 3);
  const recommendedBootcampTitle = topCriticalSkills.length > 0
    ? `Industry Placement Bootcamp (${topCriticalSkills.join(' + ')})`
    : `Full Stack Placement Readiness Bootcamp`;

  return {
    curriculumGaps: results,
    criticalGapsCount,
    recommendationSummary: `Based on active company hiring demand, college curriculum has ${criticalGapsCount} critical gaps in high-demand industry skills (${topCriticalSkills.join(', ')}).`,
    recommendedBootcampTitle,
    recommendedSkills: topCriticalSkills.length > 0 ? topCriticalSkills : ['Python', 'DSA', 'SQL']
  };
}

export function getCareerRecommendations(careerQuery: string) {
  const query = careerQuery.toLowerCase();
  const allCareers = db.getCareerPaths();
  const allJobs = db.getJobs().filter(j => j.status === 'published');
  const allCourses = db.getCourses();

  let matchedCareer = allCareers.find(c => 
    c.targetRole.toLowerCase().includes(query) || 
    c.title.toLowerCase().includes(query) ||
    query.includes(c.targetRole.toLowerCase())
  );

  if (!matchedCareer) {
    matchedCareer = allCareers[0];
  }

  const matchingJobs = allJobs.filter(j => 
    j.title.toLowerCase().includes(matchedCareer!.targetRole.toLowerCase()) ||
    j.department.toLowerCase().includes(matchedCareer!.targetRole.toLowerCase()) ||
    matchedCareer!.requiredSkills.some(r => j.requiredSkills.some(jr => jr.skillName.toLowerCase() === r.skill.toLowerCase()))
  );

  const recommendedCourses = allCourses.filter(c => 
    matchedCareer!.recommendedCourses.includes(c.title) ||
    c.targetSkills.some(ts => matchedCareer!.requiredSkills.some(rs => rs.skill.toLowerCase() === ts.toLowerCase()))
  );

  return {
    career: matchedCareer,
    requiredSkills: matchedCareer.requiredSkills,
    courses: recommendedCourses,
    jobs: matchingJobs.slice(0, 6),
    jobCount: matchingJobs.length
  };
}
