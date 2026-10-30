const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const avatars = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
];

const domainsList = [
  'Data Science & AI',
  'Cybersecurity & InfoSec',
  'Cloud & DevOps',
  'Web & Mobile Development',
  'Systems & Embedded Systems'
];

const rolesList = [
  'AI & Machine Learning Engineer',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Full Stack Developer',
  'Cloud DevOps Associate',
  'Software Developer'
];

const languagesList = [
  ['Python', 'SQL', 'TypeScript'],
  ['Python', 'C++', 'SQL'],
  ['JavaScript', 'TypeScript', 'Python'],
  ['Python', 'Java', 'SQL'],
  ['C++', 'Go', 'Rust'],
  ['Python', 'R', 'SQL'],
  ['Java', 'Python', 'Docker']
];

// Enrich students
if (db.students) {
  db.students.forEach((student, idx) => {
    // Specific customized students
    if (student.id === 'std_1') {
      student.interestedRoles = ['AI & Machine Learning Engineer', 'Full Stack Developer', 'Data Scientist'];
      student.programmingLanguages = ['Python', 'TypeScript', 'SQL', 'C++'];
      student.interestedDomains = ['Data Science & AI', 'Cybersecurity & InfoSec', 'Web & Mobile Development'];
      student.avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';
      student.linkedinUrl = 'https://linkedin.com/in/alexrivera-tech';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_2') {
      student.interestedRoles = ['Data Scientist', 'AI & Machine Learning Engineer'];
      student.programmingLanguages = ['Python', 'SQL', 'R'];
      student.interestedDomains = ['Data Science & AI'];
      student.avatar = avatars[2];
      student.linkedinUrl = 'https://linkedin.com/in/priyasharma-data';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_3') {
      student.interestedRoles = ['Systems Engineer', 'Cloud DevOps Associate'];
      student.programmingLanguages = ['C++', 'Go', 'Rust', 'Python'];
      student.interestedDomains = ['Cloud & DevOps', 'Systems & Embedded Systems'];
      student.avatar = avatars[1];
      student.linkedinUrl = 'https://linkedin.com/in/rohanmehta-dev';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_4') {
      student.interestedRoles = ['Full Stack Developer', 'Software Developer'];
      student.programmingLanguages = ['JavaScript', 'TypeScript', 'Python', 'SQL'];
      student.interestedDomains = ['Web & Mobile Development', 'Data Science & AI'];
      student.avatar = avatars[3];
      student.linkedinUrl = 'https://linkedin.com/in/ananyaroy-code';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_5') {
      student.interestedRoles = ['Cybersecurity Analyst', 'Security Engineer'];
      student.programmingLanguages = ['Python', 'C++', 'SQL'];
      student.interestedDomains = ['Cybersecurity & InfoSec', 'Cloud & DevOps'];
      student.avatar = avatars[4];
      student.linkedinUrl = 'https://linkedin.com/in/marcusvance-sec';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_7') {
      student.interestedRoles = ['Data Scientist', 'AI/ML Researcher'];
      student.programmingLanguages = ['Python', 'SQL', 'Julia'];
      student.interestedDomains = ['Data Science & AI'];
      student.avatar = avatars[0];
      student.linkedinUrl = 'https://linkedin.com/in/sarahjenkins-ai';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_10') {
      student.interestedRoles = ['Cybersecurity Analyst', 'Cloud Security Specialist'];
      student.programmingLanguages = ['Python', 'Java', 'SQL'];
      student.interestedDomains = ['Cybersecurity & InfoSec', 'Web & Mobile Development'];
      student.avatar = avatars[6];
      student.linkedinUrl = 'https://linkedin.com/in/vikrampatel-cyber';
      student.onboardingCompleted = true;
    } else if (student.id === 'std_12') {
      student.interestedRoles = ['Cloud DevOps Associate', 'Site Reliability Engineer'];
      student.programmingLanguages = ['Go', 'Python', 'Docker', 'SQL'];
      student.interestedDomains = ['Cloud & DevOps', 'Cybersecurity & InfoSec'];
      student.avatar = avatars[7];
      student.linkedinUrl = 'https://linkedin.com/in/kevintaylor-cloud';
      student.onboardingCompleted = true;
    } else {
      // Default domain and role based on department or modulo
      const domainChoice = domainsList[idx % domainsList.length];
      const secondDomain = domainsList[(idx + 2) % domainsList.length];
      student.interestedDomains = [domainChoice, secondDomain];
      student.interestedRoles = [rolesList[idx % rolesList.length], rolesList[(idx + 1) % rolesList.length]];
      student.programmingLanguages = languagesList[idx % languagesList.length];
      student.avatar = avatars[idx % avatars.length];
      student.linkedinUrl = `https://linkedin.com/in/${student.fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
      student.onboardingCompleted = true;
    }
  });
}

// Seed LinkedIn-style Student Connections
db.student_connections = [
  {
    id: 'conn_1',
    requesterStudentId: 'std_1',
    receiverStudentId: 'std_2',
    status: 'accepted',
    message: 'Hey Priya! Fellow AI and Data Science enthusiast at Apex University. Let us connect!',
    createdAt: '2026-09-01T10:30:00Z',
    updatedAt: '2026-09-01T12:00:00Z'
  },
  {
    id: 'conn_2',
    requesterStudentId: 'std_1',
    receiverStudentId: 'std_3',
    status: 'accepted',
    message: 'Hi Rohan! Saw your distributed queue capstone project. Impressive architecture!',
    createdAt: '2026-09-02T14:15:00Z',
    updatedAt: '2026-09-02T16:20:00Z'
  },
  {
    id: 'conn_3',
    requesterStudentId: 'std_5',
    receiverStudentId: 'std_1',
    status: 'pending',
    message: 'Hi Alex! I saw your recent proof-of-work capstones. Would love to collaborate on cybersecurity and AI agents.',
    createdAt: '2026-09-07T18:40:00Z'
  },
  {
    id: 'conn_4',
    requesterStudentId: 'std_7',
    receiverStudentId: 'std_1',
    status: 'pending',
    message: 'Hello Alex! I am doing research on RAG vector retrieval at Stanford Tech. Connecting with fellow builders!',
    createdAt: '2026-09-08T09:20:00Z'
  },
  {
    id: 'conn_5',
    requesterStudentId: 'std_1',
    receiverStudentId: 'std_4',
    status: 'pending',
    message: 'Hi Ananya! Great to meet a fellow software developer building production web apps.',
    createdAt: '2026-09-08T11:10:00Z'
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Successfully enriched students with interests & domains, and seeded student_connections!');
console.log('Total students:', db.students.length);
console.log('Total connections:', db.student_connections.length);
