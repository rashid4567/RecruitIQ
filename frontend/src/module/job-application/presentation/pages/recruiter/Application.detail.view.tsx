'use client';

import React, { useState } from 'react';
import {
  LayoutGrid,
  Briefcase,
  Users,
  Calendar,
  User,
  CreditCard,
  LogOut,
  Bell,
  ChevronLeft,
  Download,
  MessageSquare,
  CheckCircle,
  Clock,
  FileText,
  Award,
  Zap,
  AlertCircle,
  TrendingUp,
  Mail,
  Phone,
  Star,
  ArrowRight,
} from 'lucide-react';

interface Skill {
  name: string;
  status: 'Found' | 'Missing' | 'Extra';
}

interface RequiredSkill {
  name: string;
  found: boolean;
}

interface Experience {
  title: string;
  company: string;
  duration: string;
  description: string;
}

interface Education {
  degree: string;
  school: string;
  year: string;
}

interface Interview {
  date: string;
  interviewer: string;
  role: string;
  feedback: string;
}

interface CandidateProfile {
  id: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  appliedDate: string;
  overallScore: number;
  matchPercentage: number;
  status: 'Active Application' | 'Shortlisted' | 'Rejected' | 'Offer Extended';
  profileImage: string;
  requiredSkills: RequiredSkill[];
  candidateSkills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: string[];
  aiSummary: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  interviewHistory: Interview[];
}

const mockCandidate: CandidateProfile = {
  id: '1',
  name: 'Aisha Rahman',
  position: 'Senior Frontend Developer',
  email: 'aisha.rahman@example.com',
  phone: '+1 (555) 123-4567',
  appliedDate: '2024-07-20',
  overallScore: 75,
  matchPercentage: 75,
  status: 'Active Application',
  profileImage: 'AR',
  requiredSkills: [
    { name: 'React', found: true },
    { name: 'TypeScript', found: true },
    { name: 'Next.js', found: true },
    { name: 'Tailwind CSS', found: true },
    { name: 'GraphQL', found: false },
    { name: 'Unit Testing', found: true },
    { name: 'AWS', found: false },
    { name: 'UX Design Principles', found: true },
  ],
  candidateSkills: [
    { name: 'React', status: 'Found' },
    { name: 'TypeScript', status: 'Found' },
    { name: 'Next.js', status: 'Found' },
    { name: 'Tailwind CSS', status: 'Found' },
    { name: 'Node.js', status: 'Extra' },
    { name: 'GraphQL', status: 'Missing' },
    { name: 'Unit Testing', status: 'Found' },
    { name: 'AWS', status: 'Missing' },
    { name: 'UX Design Principles', status: 'Found' },
    { name: 'Figma', status: 'Extra' },
  ],
  experience: [
    {
      title: 'Senior Frontend Engineer',
      company: 'InnovateTech Solutions',
      duration: 'Jan 2022 - Present',
      description:
        'Lead development of scalable applications using React, Next.js, and TypeScript. Mentored junior developers and conducted code reviews. Improved application performance by 40% through optimization techniques.',
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Horizon Inc.',
      duration: 'Mar 2019 - Dec 2021',
      description:
        'Developed and maintained UI components for SaaS product. Collaborated with UX/UI team to implement design specifications. Optimized application performance and ensured cross-browser compatibility.',
    },
  ],
  education: [
    { degree: 'M.Sc. Computer Science', school: 'University of TechLand', year: '2019' },
    { degree: 'B.Sc. Software Engineering', school: 'State University', year: '2017' },
  ],
  certifications: ['AWS Certified Developer - Associate', 'Professional Scrum Master I'],
  aiSummary: `Aisha is a Senior Frontend Developer with 5+ years of experience in React, Next.js, and TypeScript. Proven track record in leading projects, building scalable applications, and enhancing user experience.`,
  strengths: [
    'Exceptional proficiency in modern frontend frameworks (React, Next.js)',
    'Strong command over TypeScript, ensuring robust and maintainable codebase',
    'Demonstrated leadership in project delivery and team mentorship',
    'Excellent understanding of SOLID principles and design system implementation',
  ],
  weaknesses: [
    'Limited direct experience with GraphQL compared to REST APIs',
    'Exposure to cloud platforms (AWS) is limited but could be further developed',
  ],
  recommendations: [
    'Consider a technical interview focused on system design patterns',
    'Explore the candidate&apos;s approach to API design and state management',
    'Assess leadership potential and cross-functional team collaboration',
  ],
  interviewHistory: [
    {
      date: '2024-07-25',
      interviewer: 'Jane Doe',
      role: 'Hiring Manager',
      feedback: 'Excellent cultural fit, clear communication, strong project leadership examples.',
    },
    {
      date: '2024-07-28',
      interviewer: 'Michael Chen',
      role: 'Tech Lead',
      feedback: 'Strong technical foundation. Discussed advanced React patterns and optimization techniques.',
    },
  ],
};

export default function CandidateScorecardPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'feedback'>('summary');

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header candidate={mockCandidate} />
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <ScoresSection candidate={mockCandidate} />
              <SkillsMatchSection candidate={mockCandidate} />
              <ExperienceSection candidate={mockCandidate} />
              <EducationSection candidate={mockCandidate} />
              <AIFeedbackSection
                candidate={mockCandidate}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
            <RightSidebar candidate={mockCandidate} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-blue-100 flex flex-col sticky top-0 h-screen shadow-sm">
      <div className="p-6 border-b border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">R</span>
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900">RecruitIQ</span>
            <p className="text-xs text-slate-500">Hiring Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Dashboard" />
        <NavItem icon={<Briefcase className="w-5 h-5" />} label="Jobs" />
        <NavItem icon={<FileText className="w-5 h-5" />} label="Applications" />
        <NavItem icon={<Calendar className="w-5 h-5" />} label="Interviews" />
        <NavItem icon={<Users className="w-5 h-5" />} label="Candidates" active={true} />
        <NavItem icon={<CreditCard className="w-5 h-5" />} label="Billing" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
      </nav>

      <div className="p-4 border-t border-blue-100">
        <button className="flex items-center gap-3 text-slate-600 hover:text-slate-900 font-medium text-sm w-full px-3 py-2 rounded-lg hover:bg-slate-50 transition">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition ${
        active
          ? 'bg-blue-50 text-blue-700 shadow-sm'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Header({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white border-b border-blue-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm">
            <button className="text-blue-600 hover:text-blue-700 p-1 hover:bg-blue-50 rounded-lg transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-500">Candidates</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{candidate.name}</span>
          </div>
          <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {candidate.profileImage}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{candidate.name}</h1>
              <p className="text-blue-600 font-semibold mt-0.5">{candidate.position}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  {candidate.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-blue-600" />
                  {candidate.phone}
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="inline-flex px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 shadow-sm">
              <CheckCircle className="w-4 h-4 mr-1.5" />
              {candidate.status}
            </div>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition shadow-sm">
              <Download className="w-4 h-4 inline mr-1" />
              Export Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoresSection({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700">Overall Score</h3>
          <p className="text-xs text-slate-500 mt-1">Performance rating</p>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeDasharray={`${candidate.overallScore * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-bold text-blue-600">{candidate.overallScore}</span>
                <span className="text-sm text-slate-500 block">%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-emerald-600 text-sm font-semibold">
            <TrendingUp className="w-4 h-4" />
            Above Average
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-emerald-100 p-6 shadow-sm hover:shadow-md transition">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-700">Match Score</h3>
          <p className="text-xs text-slate-500 mt-1">Job requirement alignment</p>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e7ff"
                strokeWidth="6"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="6"
                strokeDasharray={`${candidate.matchPercentage * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-4xl font-bold text-emerald-600">{candidate.matchPercentage}</span>
                <span className="text-sm text-slate-500 block">%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="inline-flex items-center gap-1 text-emerald-600 text-sm font-semibold">
            <Star className="w-4 h-4" />
            Strong Match
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsMatchSection({ candidate }: { candidate: CandidateProfile }) {
  const foundCount = candidate.candidateSkills.filter((s) => s.status === 'Found').length;
  const extraCount = candidate.candidateSkills.filter((s) => s.status === 'Extra').length;
  const missingCount = candidate.candidateSkills.filter((s) => s.status === 'Missing').length;

  return (
    <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Skills Assessment</h2>
        <p className="text-sm text-slate-600 mt-1">Required vs candidate skills analysis</p>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-8 pb-8 border-b border-slate-100">
        <div className="bg-emerald-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-emerald-600">{foundCount}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">Found</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{extraCount}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">Extra</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-orange-600">{missingCount}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">Missing</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{candidate.requiredSkills.filter((s) => s.found).length}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">Matched</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            Required Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {candidate.requiredSkills.map((skill) => (
              <span
                key={skill.name}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  skill.found
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {skill.found && <CheckCircle className="w-3 h-3 inline mr-1" />}
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Candidate Skills</h3>
          <div className="flex flex-wrap gap-2">
            {candidate.candidateSkills.map((skill) => (
              <span
                key={skill.name}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  skill.status === 'Found'
                    ? 'bg-emerald-100 text-emerald-700'
                    : skill.status === 'Extra'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-orange-100 text-orange-700'
                }`}
              >
                {skill.name}
                {skill.status === 'Found' && ' ✓'}
                {skill.status === 'Extra' && ' +'}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExperienceSection({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Experience</h2>
        <p className="text-sm text-slate-600 mt-1">Career history and roles</p>
      </div>

      <div className="space-y-5">
        {candidate.experience.map((exp, index) => (
          <div
            key={index}
            className={`pb-5 ${index !== candidate.experience.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                <p className="text-sm text-blue-600 font-medium mt-0.5">{exp.company}</p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {exp.duration}
                </p>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EducationSection({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900">Education & Certifications</h2>
        <p className="text-sm text-slate-600 mt-1">Academic background and credentials</p>
      </div>

      <div className="space-y-5">
        {candidate.education.map((edu, index) => (
          <div
            key={index}
            className={`pb-5 ${index !== candidate.education.length - 1 ? 'border-b border-slate-100' : ''}`}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{edu.degree}</h3>
                <p className="text-sm text-purple-600 font-medium mt-0.5">{edu.school}</p>
                <p className="text-xs text-slate-500 mt-1">{edu.year}</p>
              </div>
            </div>
          </div>
        ))}

        {candidate.certifications.length > 0 && (
          <div className="pt-5 border-t border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Certifications</h3>
            <div className="space-y-2">
              {candidate.certifications.map((cert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="text-sm text-slate-600">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AIFeedbackSection({
  candidate,
  activeTab,
  setActiveTab,
}: {
  candidate: CandidateProfile;
  activeTab: 'summary' | 'feedback';
  setActiveTab: (tab: 'summary' | 'feedback') => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            AI Analysis
          </h2>
          <p className="text-sm text-slate-600 mt-1">Intelligent insights and recommendations</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-100 pb-4">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'summary'
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Summary
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
            activeTab === 'feedback'
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Detailed Feedback
        </button>
      </div>

      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-sm text-slate-700 leading-relaxed">{candidate.aiSummary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Strengths</h3>
            <div className="space-y-2">
              {candidate.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                  </div>
                  <p className="text-sm text-slate-600">{strength}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Areas to Explore</h3>
            <div className="space-y-2">
              {candidate.weaknesses.map((weakness, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <AlertCircle className="w-3 h-3 text-orange-600" />
                  </div>
                  <p className="text-sm text-slate-600">{weakness}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Interview Feedback</h3>
            <div className="space-y-3">
              {candidate.interviewHistory.map((interview, index) => (
                <div key={index} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-slate-900">{interview.interviewer}</p>
                      <p className="text-xs text-slate-500">{interview.role}</p>
                    </div>
                    <p className="text-xs text-slate-500">{interview.date}</p>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{interview.feedback}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              Recommendations
            </h3>
            <div className="space-y-2">
              {candidate.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-3">
                  <ArrowRight className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-slate-600">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RightSidebar({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm sticky top-24">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          Quick Actions
        </h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition shadow-sm">
            Schedule Interview
          </button>
          <button className="w-full px-4 py-2.5 bg-emerald-100 text-emerald-700 rounded-lg font-medium text-sm hover:bg-emerald-200 transition">
            Send Offer
          </button>
          <button className="w-full px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg font-medium text-sm hover:bg-slate-50 transition">
            Add Notes
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg text-white">
        <h3 className="text-sm font-bold mb-2">Interview Scheduled</h3>
        <p className="text-xs text-blue-100 mb-4">Next step ready for the team</p>
        <div className="space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Aug 5, 2024
          </p>
          <p className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            2:00 PM EST
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-blue-100 p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Contact Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-600" />
            <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
              {candidate.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:underline">
              {candidate.phone}
            </a>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            Applied {candidate.appliedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
