import React, { useState, useEffect } from 'react';
import {
  LayoutGrid,
  Briefcase,
  Users,
  Calendar,
  User,
  CreditCard,
  LogOut,
  Bell,
  ChevronDown,
  ChevronLeft,
  Download,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Award,
  Zap,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useRecruiterApplicationDetails } from '../../hooks/recruiter/useRecruiterApplicationDetails'; 
import type { RecruiterApplicationDetails } from '@/module/job-application/domain/dto/RecruiterApplicationDetails';
import { ApplicationStatus } from '@/module/job-application/domain/entity/job-application.entity';

// ────────────────────── Types ──────────────────────

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

// ────────────────────── Helpers ──────────────────────

/**
 * Maps an ApplicationStatus value from the domain entity to the display
 * string expected by the UI components.
 */
function mapStatus(
  status: string | undefined,
): CandidateProfile['status'] {
  switch (status) {
    case ApplicationStatus.SHORTLISTED:
      return 'Shortlisted';
    case ApplicationStatus.REJECTED:
      return 'Rejected';
    case ApplicationStatus.SELECTED:
      return 'Offer Extended';
    case ApplicationStatus.APPLIED:
    case ApplicationStatus.INTERVIEW_SCHEDULED:
    default:
      return 'Active Application';
  }
}

/**
 * Derives initials from a full name for the avatar placeholder.
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Converts a RecruiterApplicationDetails API response into the CandidateProfile
 * shape consumed by all existing UI sub-components.
 *
 * Fields that the API does not yet return (skills analysis, AI summary, etc.)
 * are given sensible empty defaults so the page renders without errors; they
 * can be populated once the backend exposes the data.
 */
function mapApiToCandidateProfile(
  data: RecruiterApplicationDetails,
): CandidateProfile {
  return {
    id: data.applicationId,
    name: data.candidateName ?? 'Unknown Candidate',
    // The API does not expose position title on this endpoint; use a fallback.
    position: 'Candidate',
    email: data.candidateEmail ?? '',
    phone: '',
    appliedDate: data.appliedAt
      ? new Date(data.appliedAt).toLocaleDateString('en-CA') // YYYY-MM-DD
      : '',
    overallScore: 0,
    matchPercentage: 0,
    status: mapStatus(data.status),
    profileImage: getInitials(data.candidateName ?? 'U'),
    requiredSkills: [],
    candidateSkills: [],
    experience: [],
    education: [],
    certifications: [],
    aiSummary: '',
    strengths: [],
    weaknesses: [],
    recommendations: [],
    interviewHistory: data.interview
      ? [
          {
            date: data.interview.scheduledAt
              ? new Date(data.interview.scheduledAt).toLocaleDateString('en-CA')
              : '',
            interviewer: '',
            role: '',
            feedback: data.interview.notes ?? '',
          },
        ]
      : [],
  };
}

// ────────────────────── Page Component ──────────────────────

interface CandidateScorecardPageProps {
  /** The application ID to load. Pass via router params or props. */
  applicationId: string;
}

export default function CandidateScorecardPage({
  applicationId,
}: CandidateScorecardPageProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'feedback'>('summary');
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const { loading, error, application, fetchApplicationDetails } =
    useRecruiterApplicationDetails();

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails(applicationId);
    }
  }, [applicationId, fetchApplicationDetails]);

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 font-medium">Loading candidate details…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3 max-w-sm">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="text-slate-900 font-semibold text-lg">Failed to load application</p>
            <p className="text-slate-600 text-sm">{error}</p>
            <button
              onClick={() => fetchApplicationDetails(applicationId)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── No Data Yet ──
  if (!application) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-slate-500">No application data available.</p>
        </div>
      </div>
    );
  }

  const candidate = mapApiToCandidateProfile(application);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <Header candidate={candidate} />

        {/* Content Grid */}
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scores Section */}
            <ScoresSection candidate={candidate} />

            {/* Skills Match Visualization */}
            <SkillsMatchSection candidate={candidate} />

            {/* Required vs Found Skills */}
            <RequiredSkillsTable candidate={candidate} />

            {/* Experience */}
            <ExperienceSection candidate={candidate} />

            {/* Education & Certifications */}
            <EducationSection candidate={candidate} />

            {/* AI Feedback */}
            <AIFeedbackSection
              candidate={candidate}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
          </div>

          {/* Right Sidebar */}
          <RightSidebar candidate={candidate} />
        </div>
      </div>
    </div>
  );
}

// ────────────────────── Sidebar ──────────────────────

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">R</span>
          </div>
          <span className="font-bold text-lg text-slate-900">RecruitIQ</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-1">
        <NavItem icon={<LayoutGrid className="w-5 h-5" />} label="Dashboard" />
        <NavItem icon={<Briefcase className="w-5 h-5" />} label="Jobs" />
        <NavItem icon={<FileText className="w-5 h-5" />} label="Applications" />
        <NavItem icon={<Calendar className="w-5 h-5" />} label="Interviews" />
        <NavItem icon={<Users className="w-5 h-5" />} label="Candidates" active={true} />
        <NavItem icon={<CreditCard className="w-5 h-5" />} label="Billing" />
        <NavItem icon={<User className="w-5 h-5" />} label="Profile" />
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-slate-200">
        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium text-sm w-full">
          <LogOut className="w-5 h-5" />
          logout
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
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg font-medium transition ${
        active
          ? 'bg-blue-50 text-blue-600'
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ────────────────────── Header ──────────────────────

function Header({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-slate-600 font-medium">Candidates</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">{candidate.name}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300 transition">
            <Bell className="w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Candidate Info */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-2xl font-bold text-white">
              {candidate.profileImage}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{candidate.name}</h1>
              <p className="text-slate-600 font-medium">{candidate.position}</p>
              <div className="flex items-center gap-6 mt-2 text-sm text-slate-600">
                {candidate.email && (
                  <div className="flex items-center gap-1">
                    <span>📧</span>
                    {candidate.email}
                  </div>
                )}
                {candidate.phone && (
                  <div className="flex items-center gap-1">
                    <span>📞</span>
                    {candidate.phone}
                  </div>
                )}
                {candidate.appliedDate && (
                  <div className="flex items-center gap-1">
                    <span>📅</span>
                    Applied on {candidate.appliedDate}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex px-4 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700">
              ✓ {candidate.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────── Scores Section ──────────────────────

function ScoresSection({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Overall Score</h3>
          <p className="text-xs text-slate-500">Candidate&apos;s overall performance rating</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="8"
                strokeDasharray={`${candidate.overallScore * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{candidate.overallScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Match Percentage */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-2">Match Percentage</h3>
          <p className="text-xs text-slate-500">Alignment with job requirements</p>
        </div>
        <div className="flex items-center justify-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#10b981"
                strokeWidth="8"
                strokeDasharray={`${candidate.matchPercentage * 2.83} 283`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-slate-900">{candidate.matchPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────── Skills Match Section ──────────────────────

function SkillsMatchSection({ candidate }: { candidate: CandidateProfile }) {
  const requiredCount = candidate.requiredSkills.filter((s) => s.found).length;
  const foundCount = candidate.candidateSkills.filter((s) => s.status === 'Found').length;
  const extraCount = candidate.candidateSkills.filter((s) => s.status === 'Extra').length;
  const missingCount = candidate.candidateSkills.filter((s) => s.status === 'Missing').length;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Skills Match Visualization</h2>
        <p className="text-sm text-slate-600">Comparison of required skills vs candidate&apos;s skills</p>
      </div>

      {/* Required Skills */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Required Skills</h3>
        {candidate.requiredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.requiredSkills.map((skill) => (
              <span
                key={skill.name}
                className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                  skill.found ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {skill.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No required skills data available.</p>
        )}
      </div>

      {/* Candidate Skills */}
      <div>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Candidate Skills</h3>
        {candidate.candidateSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {candidate.candidateSkills.map((skill) => (
              <span
                key={skill.name}
                className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 ${
                  skill.status === 'Found'
                    ? 'bg-emerald-100 text-emerald-700'
                    : skill.status === 'Extra'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-orange-100 text-orange-700'
                }`}
              >
                {skill.name}
                <span className="text-xs font-semibold">
                  {skill.status === 'Found' ? '✓' : skill.status === 'Extra' ? '+' : ''}
                </span>
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No candidate skills data available.</p>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">{foundCount}</p>
          <p className="text-xs text-slate-600 font-medium">Found</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">{extraCount}</p>
          <p className="text-xs text-slate-600 font-medium">Extra</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-orange-600">{missingCount}</p>
          <p className="text-xs text-slate-600 font-medium">Missing</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">{requiredCount}</p>
          <p className="text-xs text-slate-600 font-medium">Match</p>
        </div>
      </div>
    </div>
  );
}

// ────────────────────── Required Skills Table ──────────────────────

function RequiredSkillsTable({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Required vs Found Skills</h2>
        <p className="text-sm text-slate-600">Detailed breakdown of required skills</p>
      </div>

      {candidate.requiredSkills.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-700">
                  Required Skill
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-slate-700">
                  Found in Candidate
                </th>
              </tr>
            </thead>
            <tbody>
              {candidate.requiredSkills.map((skill, index) => (
                <tr key={index} className="border-b border-slate-100 hover:bg-slate-50 transition">
                  <td className="py-3 px-4 text-sm text-slate-900">{skill.name}</td>
                  <td className="py-3 px-4 text-center">
                    {skill.found ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">No skills breakdown available.</p>
      )}
    </div>
  );
}

// ────────────────────── Experience Section ──────────────────────

function ExperienceSection({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Experience Alignment</h2>
        <p className="text-sm text-slate-600">Key roles and responsibilities</p>
      </div>

      {candidate.experience.length > 0 ? (
        <div className="space-y-6">
          {candidate.experience.map((exp, index) => (
            <div key={index} className="pb-6 border-b border-slate-200 last:border-b-0 last:pb-0">
              <div className="flex items-start gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <div>
                  <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                  <p className="text-sm text-slate-600 mt-0.5">{exp.duration}</p>
                </div>
              </div>
              <p className="text-sm text-slate-700 ml-6 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 italic">No experience data available.</p>
      )}
    </div>
  );
}

// ────────────────────── Education Section ──────────────────────

function EducationSection({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-1">Education & Certifications</h2>
        <p className="text-sm text-slate-600">Academic achievements and professional qualifications</p>
      </div>

      <div className="space-y-6">
        {/* Education */}
        {candidate.education.length > 0 ? (
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Education</h3>
            <div className="space-y-3">
              {candidate.education.map((edu, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Award className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">{edu.degree}</p>
                    <p className="text-sm text-slate-600">{edu.school}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No education data available.</p>
        )}

        {/* Certifications */}
        {candidate.certifications.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Certifications</h3>
            <div className="flex flex-wrap gap-2">
              {candidate.certifications.map((cert, index) => (
                <span
                  key={index}
                  className="px-3 py-2 rounded-lg bg-amber-100 text-amber-700 text-xs font-semibold"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────── AI Feedback Section ──────────────────────

function AIFeedbackSection({
  candidate,
  activeTab,
  setActiveTab,
  expandedSection,
  setExpandedSection,
}: {
  candidate: CandidateProfile;
  activeTab: 'summary' | 'feedback';
  setActiveTab: (tab: 'summary' | 'feedback') => void;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">AI-Generated Feedback</h2>
            <p className="text-sm text-slate-600 mt-1">Insights powered by AI analysis</p>
          </div>
          <Zap className="w-6 h-6 text-amber-500" />
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('summary')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
              activeTab === 'feedback'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Detailed Feedback
          </button>
        </div>
      </div>

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          {candidate.aiSummary ? (
            <p className="text-slate-700 leading-relaxed">{candidate.aiSummary}</p>
          ) : (
            <p className="text-sm text-slate-400 italic">No AI summary available yet.</p>
          )}
        </div>
      )}

      {/* Feedback Tab */}
      {activeTab === 'feedback' && (
        <div className="space-y-4">
          <FeedbackSection
            title="Strengths"
            icon={<TrendingUp className="w-5 h-5" />}
            color="text-emerald-600"
            items={candidate.strengths}
            id="strengths"
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />
          <FeedbackSection
            title="Weaknesses"
            icon={<AlertCircle className="w-5 h-5" />}
            color="text-red-600"
            items={candidate.weaknesses}
            id="weaknesses"
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />
          <FeedbackSection
            title="Recommendations"
            icon={<Zap className="w-5 h-5" />}
            color="text-amber-600"
            items={candidate.recommendations}
            id="recommendations"
            expandedSection={expandedSection}
            setExpandedSection={setExpandedSection}
          />
        </div>
      )}
    </div>
  );
}

function FeedbackSection({
  title,
  icon,
  color,
  items,
  id,
  expandedSection,
  setExpandedSection,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: string[];
  id: string;
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
}) {
  const isExpanded = expandedSection === id;

  return (
    <div className="border border-slate-200 rounded-lg p-4">
      <button
        onClick={() => setExpandedSection(isExpanded ? null : id)}
        className="w-full flex items-center justify-between hover:bg-slate-50 p-2 -m-2 rounded-lg transition"
      >
        <div className="flex items-center gap-2">
          <span className={color}>{icon}</span>
          <span className="font-semibold text-slate-900">{title}</span>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-2 pt-4 border-t border-slate-200">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="text-slate-400 font-bold mt-0.5">•</span>
                <p className="text-slate-700 text-sm leading-relaxed">{item}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400 italic">No {title.toLowerCase()} data available.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ────────────────────── Right Sidebar ──────────────────────

function RightSidebar({ candidate }: { candidate: CandidateProfile }) {
  return (
    <div className="space-y-6">
      {/* Application Status */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Application Status</h3>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-medium text-slate-900">{candidate.status}</span>
        </div>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition border border-slate-200">
            <FileText className="w-4 h-4" />
            View Apply Link
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition border border-slate-200">
            <Download className="w-4 h-4" />
            Export / Print Scorecard
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition border border-slate-200">
            <MessageSquare className="w-4 h-4" />
            Submit Feedback
          </button>
        </div>
      </div>

      {/* Recruiter Actions */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Recruiter Actions</h3>
        <p className="text-xs text-slate-600 mb-4">Manage candidate status and outreach</p>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
            <CheckCircle className="w-4 h-4" />
            Shortlist Candidate
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition">
            <XCircle className="w-4 h-4" />
            Reject Candidate
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition border border-slate-200">
            <Clock className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Recruiter Notes */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Recruiter Notes</h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          Candidate shows strong leadership potential and solid technical foundation. Good to the
          core domain. Need to assess GraphQL experience and cloud architecture skills in next round.
        </p>
      </div>

      {/* Interview History */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Interview History</h3>
        <p className="text-xs text-slate-600 mb-4">Overview of past interview stages</p>
        {candidate.interviewHistory.length > 0 ? (
          <div className="space-y-4">
            {candidate.interviewHistory.map((interview, index) => (
              <div key={index} className="pb-4 border-b border-slate-200 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-900">
                    {interview.date}
                    {interview.interviewer ? ` - ${interview.interviewer}` : ''}
                  </span>
                  {interview.role && (
                    <span className="text-xs text-slate-600 font-medium">{interview.role}</span>
                  )}
                </div>
                {interview.feedback && (
                  <p className="text-xs text-slate-600">{interview.feedback}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400 italic">No interview history yet.</p>
        )}
      </div>

      {/* Resume Preview */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h3 className="font-semibold text-slate-900 mb-3">Resume Preview</h3>
        <p className="text-xs text-slate-600 mb-4">View or download the candidate&apos;s full resume</p>
        <div className="w-full h-32 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center mb-3">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 border border-blue-600 hover:border-blue-700 rounded-lg transition">
          <Download className="w-4 h-4" />
          Download Resume
        </button>
      </div>
    </div>
  );
}