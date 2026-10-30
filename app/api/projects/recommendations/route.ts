import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role') || 'Software Developer';
    const studentId = searchParams.get('studentId') || 'std_1';

    // Retrieve student profile and skills from local mock DB
    const student = db.getStudentById(studentId);
    const verifiedSkills = db.getVerifiedSkills(studentId);
    const verifiedSkillsNames = verifiedSkills.map(v => v.skillName.toLowerCase());

    // Get all projects from database
    const allProjects = db.getProjectRecommendations();

    // Map and score recommendations dynamically
    const scoredRecommendations = allProjects.map(proj => {
      let score = 0;
      let matchReasons: string[] = [];

      // 1. Role match: prioritize projects targeting active query role or student target role
      const isAll = role === 'All' || !role;
      const isOpenSourceAI = role === 'Open Source AI' || role.toLowerCase().includes('ai');
      const isAIProject = proj.id.includes('ai') || 
                          proj.targetRole.toLowerCase().includes('ai') || 
                          proj.title.toLowerCase().includes('ai') ||
                          proj.technologies.some(t => ['ai/ml', 'langgraph', 'langchain', 'ollama', 'qdrant', 'chromadb', 'yolov8', 'pytorch', 'spacy', 'whisper stt'].includes(t.toLowerCase()));

      const matchesTargetRole = isAll ||
                                (isOpenSourceAI && isAIProject) ||
                                proj.targetRole.toLowerCase().includes(role.toLowerCase()) || 
                                role.toLowerCase().includes(proj.targetRole.toLowerCase());

      if (matchesTargetRole) {
        score += 50;
        matchReasons.push(
          isOpenSourceAI && isAIProject
            ? `Production Open-Source AI Blueprint: ${proj.title}`
            : `Matches target career role: ${proj.targetRole}`
        );
      }

      // 2. Skill match: check if student has verified skills in technologies required
      const matchingTech = proj.technologies.filter(tech => verifiedSkillsNames.includes(tech.toLowerCase()));
      if (matchingTech.length > 0) {
        score += matchingTech.length * 15;
        matchReasons.push(`Leverages your verified skills: ${matchingTech.join(', ')}`);
      } else {
        // Suggest it as a learning opportunity to bridge the gap
        matchReasons.push(`Calibrated to bridge skills gaps in: ${proj.technologies.slice(0, 2).join(' & ')}`);
      }

      // 3. Readiness / CGPA check: if student has higher readiness, match harder projects
      const studentReadiness = student?.placementReadiness || 0;
      if (studentReadiness > 70 && proj.difficulty === 'Advanced') {
        score += 20;
        matchReasons.push('Aligned with your advanced placement readiness tier');
      } else if (studentReadiness <= 70 && proj.difficulty === 'Beginner') {
        score += 20;
        matchReasons.push('Foundational project for skill reinforcement');
      }

      return {
        ...proj,
        matchScore: score,
        matchReasons
      };
    });

    // Sort by match score descending
    const recommendations = scoredRecommendations.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      success: true,
      role,
      recommendations
    });
  } catch (error) {
    console.error('Error fetching project recommendations:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
