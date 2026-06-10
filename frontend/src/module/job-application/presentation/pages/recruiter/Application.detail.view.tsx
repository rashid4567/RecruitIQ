import React, { useState, useEffect } from 'react';
import {
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
  ChevronDown,
  ChevronRight,
  Mail,
  Phone,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  BarChart2,
  Target,
  BookOpen,
  Layers,
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useRecruiterApplicationDetails } from '../../hooks/recruiter/useRecruiterApplicationDetails';
import type { RecruiterApplicationDetails } from '@/module/job-application/domain/dto/RecruiterApplicationDetails';
import { ApplicationStatus } from '@/module/job-application/domain/entity/job-application.entity';
import Sidebar from '@/module/recruiter/presentation/pages/components/layout/Sidebar';
import Header from '@/pages/landing/sections/Header';

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



function mapStatus(status: string | undefined): CandidateProfile['status'] {
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

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function mapApiToCandidateProfile(data: RecruiterApplicationDetails): CandidateProfile {
  return {
    id: data.applicationId,
    name: data.candidateName ?? 'Unknown Candidate',
    position: 'Candidate',
    email: data.candidateEmail ?? '',
    phone: '',
    appliedDate: data.appliedAt
      ? new Date(data.appliedAt).toLocaleDateString('en-CA')
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

// ────────────────────── Status Config ──────────────────────

const statusConfig: Record<
  CandidateProfile['status'],
  { color: string; bg: string; dot: string }
> = {
  'Active Application': {
    color: 'text-blue-700',
    bg: 'bg-blue-50 border-blue-200',
    dot: 'bg-blue-500',
  },
  Shortlisted: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    dot: 'bg-emerald-500',
  },
  Rejected: {
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    dot: 'bg-red-500',
  },
  'Offer Extended': {
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    dot: 'bg-violet-500',
  },
};

// ────────────────────── Circular Progress ──────────────────────

function CircularProgress({
  value,
  color,
  size = 96,
  strokeWidth = 8,
}: {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="transform -rotate-90"
    >
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="#e2e8f0"
        strokeWidth={strokeWidth}
      />
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}



export default function CandidateScorecardPage() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [activeTab, setActiveTab] = useState<'summary' | 'feedback'>('summary');
  const [expandedSection, setExpandedSection] = useState<string | null>('strengths');

  const { loading, error, application, fetchApplicationDetails } =
    useRecruiterApplicationDetails();

  useEffect(() => {
    if (applicationId) fetchApplicationDetails(applicationId);
  }, [applicationId, fetchApplicationDetails]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 text-sm font-medium">Loading candidate details…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3 max-w-sm p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-slate-900 font-semibold">Failed to load application</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <button
              onClick={() => applicationId && fetchApplicationDetails(applicationId)}
              className="mt-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-400 text-sm">No application data available.</p>
          </div>
        </div>
      </div>
    );
  }

  const candidate = mapApiToCandidateProfile(application);
  const sc = statusConfig[candidate.status];

  const foundCount = candidate.candidateSkills.filter((s) => s.status === 'Found').length;
  const extraCount = candidate.candidateSkills.filter((s) => s.status === 'Extra').length;
  const missingCount = candidate.candidateSkills.filter((s) => s.status === 'Missing').length;
  const requiredMatchCount = candidate.requiredSkills.filter((s) => s.found).length;

  return (
    <div className="flex min-h-screen bg-[#f8f9fc]">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
      <div className="pt-11">
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-start justify-between gap-6 flex-wrap">
            <div className="flex items-center gap-5">
         
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-xl font-bold shadow-md select-none">
                  {candidate.profileImage}
                </div>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
              </div>

         
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 leading-tight">
                    {candidate.name}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${sc.bg} ${sc.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                    {candidate.status}
                  </span>
                </div>
                {candidate.position && (
                  <p className="text-sm text-slate-500 mt-0.5">{candidate.position}</p>
                )}
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  {candidate.email && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      {candidate.email}
                    </span>
                  )}
                  {candidate.phone && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Phone className="w-3.5 h-3.5" />
                      {candidate.phone}
                    </span>
                  )}
                  {candidate.appliedDate && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied {candidate.appliedDate}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all">
                <FileText className="w-4 h-4" />
                Apply Link
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all">
                <Download className="w-4 h-4" />
                Export
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-xl transition-all">
                <MessageSquare className="w-4 h-4" />
                Feedback
              </button>
            </div>
          </div>
        </div>
        </div>

        {/* ── Body ── */}
        <div className="max-w-7xl mx-auto px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left / Main ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-5">
              <ScoreCard
                label="Overall Score"
                sub="Candidate performance rating"
                value={candidate.overallScore}
                color="#3b82f6"
                icon={<Star className="w-4 h-4 text-blue-500" />}
              />
              <ScoreCard
                label="Match Percentage"
                sub="Alignment with job requirements"
                value={candidate.matchPercentage}
                color="#10b981"
                icon={<Target className="w-4 h-4 text-emerald-500" />}
              />
            </div>

            {/* Skills Match */}
            <Card
              title="Skills Match"
              subtitle="Required skills vs. candidate skills"
              icon={<Layers className="w-5 h-5 text-blue-500" />}
            >
              <div className="space-y-6">
                {/* Required Skills */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Required Skills
                  </p>
                  {candidate.requiredSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidate.requiredSkills.map((skill) => (
                        <SkillBadge
                          key={skill.name}
                          label={skill.name}
                          variant={skill.found ? 'required-found' : 'required-missing'}
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState label="No required skills listed." />
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-100" />

                {/* Candidate Skills */}
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
                    Candidate Skills
                  </p>
                  {candidate.candidateSkills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {candidate.candidateSkills.map((skill) => (
                        <SkillBadge
                          key={skill.name}
                          label={skill.name}
                          variant={
                            skill.status === 'Found'
                              ? 'found'
                              : skill.status === 'Extra'
                              ? 'extra'
                              : 'missing'
                          }
                        />
                      ))}
                    </div>
                  ) : (
                    <EmptyState label="No candidate skills data available." />
                  )}
                </div>

                {/* Legend bar */}
                <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-100">
                  {[
                    { count: foundCount, label: 'Found', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { count: extraCount, label: 'Extra', color: 'text-violet-600', bg: 'bg-violet-50' },
                    { count: missingCount, label: 'Missing', color: 'text-orange-600', bg: 'bg-orange-50' },
                    { count: requiredMatchCount, label: 'Match', color: 'text-blue-600', bg: 'bg-blue-50' },
                  ].map(({ count, label, color, bg }) => (
                    <div
                      key={label}
                      className={`${bg} rounded-xl py-3 text-center`}
                    >
                      <p className={`text-2xl font-bold ${color}`}>{count}</p>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Required vs Found Table */}
            <Card
              title="Required vs. Found Skills"
              subtitle="Detailed breakdown per required skill"
              icon={<BarChart2 className="w-5 h-5 text-blue-500" />}
            >
              {candidate.requiredSkills.length > 0 ? (
                <div className="overflow-x-auto -mx-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-100">
                        <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Skill
                        </th>
                        <th className="text-center py-3 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidate.requiredSkills.map((skill, i) => (
                        <tr key={i} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-6 text-sm font-medium text-slate-800">
                            {skill.name}
                          </td>
                          <td className="py-3.5 px-6">
                            <div className="flex items-center justify-center">
                              {skill.found ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle className="w-3.5 h-3.5" />
                                  Found
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
                                  <XCircle className="w-3.5 h-3.5" />
                                  Missing
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState label="No skills breakdown available." />
              )}
            </Card>

            {/* Experience */}
            <Card
              title="Experience Alignment"
              subtitle="Key roles and responsibilities"
              icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            >
              {candidate.experience.length > 0 ? (
                <div className="relative">
                  {/* timeline line */}
                  <div className="absolute left-1.75 top-2 bottom-2 w-px bg-slate-200" />
                  <div className="space-y-8 pl-7">
                    {candidate.experience.map((exp, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-7 top-1 w-3.5 h-3.5 rounded-full bg-blue-600 border-2 border-white shadow-sm" />
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:border-slate-200 transition-colors">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="font-semibold text-slate-900 text-sm">{exp.title}</p>
                              {exp.company && (
                                <p className="text-xs text-blue-600 font-medium mt-0.5">{exp.company}</p>
                              )}
                            </div>
                            {exp.duration && (
                              <span className="text-xs text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 whitespace-nowrap">
                                {exp.duration}
                              </span>
                            )}
                          </div>
                          {exp.description && (
                            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState label="No experience data available." />
              )}
            </Card>

            {/* Education */}
            <Card
              title="Education & Certifications"
              subtitle="Academic achievements and professional qualifications"
              icon={<GraduationCap className="w-5 h-5 text-blue-500" />}
            >
              <div className="space-y-6">
                {candidate.education.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      Education
                    </p>
                    <div className="space-y-3">
                      {candidate.education.map((edu, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                            <Award className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">{edu.degree}</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              {edu.school}
                              {edu.year ? ` · ${edu.year}` : ''}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <EmptyState label="No education data available." />
                )}

                {candidate.certifications.length > 0 && (
                  <div className="pt-5 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                      Certifications
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {candidate.certifications.map((cert, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* AI Feedback */}
            <AIFeedbackSection
              candidate={candidate}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-5">
            {/* Recruiter Actions */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Recruiter Actions</h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage candidate status</p>
              </div>
              <div className="p-4 space-y-2.5">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                  <CheckCircle className="w-4 h-4" />
                  Shortlist Candidate
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-sm">
                  <XCircle className="w-4 h-4" />
                  Reject Candidate
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors border border-slate-200">
                  <Clock className="w-4 h-4" />
                  Schedule Interview
                </button>
              </div>
            </div>

            {/* Recruiter Notes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-sm">Recruiter Notes</h3>
                <button className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Edit
                </button>
              </div>
              <div className="px-5 py-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  No notes added yet. Click Edit to add your observations about this candidate.
                </p>
              </div>
            </div>

            {/* Interview History */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Interview History</h3>
                <p className="text-xs text-slate-500 mt-0.5">Past interview stages</p>
              </div>
              <div className="px-5 py-4">
                {candidate.interviewHistory.length > 0 ? (
                  <div className="space-y-4">
                    {candidate.interviewHistory.map((interview, i) => (
                      <div
                        key={i}
                        className="relative pl-4 border-l-2 border-blue-200"
                      >
                        <div className="absolute -left-1.25 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-white" />
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {interview.date}
                            </p>
                            {interview.interviewer && (
                              <p className="text-xs text-slate-500 mt-0.5">{interview.interviewer}</p>
                            )}
                          </div>
                          {interview.role && (
                            <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-lg font-medium">
                              {interview.role}
                            </span>
                          )}
                        </div>
                        {interview.feedback && (
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            {interview.feedback}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState label="No interview history yet." />
                )}
              </div>
            </div>

            {/* Resume Preview */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-semibold text-slate-900 text-sm">Resume</h3>
                <p className="text-xs text-slate-500 mt-0.5">View or download candidate's resume</p>
              </div>
              <div className="p-5">
                <div className="w-full h-32 bg-linear-to-br from-slate-100 to-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                  <span className="text-xs text-slate-400 font-medium">Resume Preview</span>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────── Score Card ──────────────────────

function ScoreCard({
  label,
  sub,
  value,
  color,
  icon,
}: {
  label: string;
  sub: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {icon}
            <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
          </div>
          <p className="text-xs text-slate-500">{sub}</p>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <CircularProgress value={value} color={color} size={96} strokeWidth={8} />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-slate-900">{value}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────── Skill Badge ──────────────────────

type SkillVariant = 'required-found' | 'required-missing' | 'found' | 'extra' | 'missing';

const skillVariantStyles: Record<SkillVariant, string> = {
  'required-found': 'bg-blue-50 text-blue-700 border border-blue-200',
  'required-missing': 'bg-slate-100 text-slate-500 border border-slate-200',
  found: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  extra: 'bg-violet-50 text-violet-700 border border-violet-200',
  missing: 'bg-orange-50 text-orange-700 border border-orange-200',
};

const skillVariantSuffix: Partial<Record<SkillVariant, string>> = {
  found: '✓',
  extra: '+',
};

function SkillBadge({ label, variant }: { label: string; variant: SkillVariant }) {
  const suffix = skillVariantSuffix[variant];
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${skillVariantStyles[variant]}`}
    >
      {label}
      {suffix && <span className="font-bold">{suffix}</span>}
    </span>
  );
}

// ────────────────────── Card Wrapper ──────────────────────

function Card({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              {icon}
            </div>
          )}
          <div>
            <h2 className="text-base font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ────────────────────── Empty State ──────────────────────

function EmptyState({ label }: { label: string }) {
  return (
    <div className="text-center py-6">
      <p className="text-sm text-slate-400 italic">{label}</p>
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-amber-500" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">AI-Generated Feedback</h2>
              <p className="text-xs text-slate-500 mt-0.5">Insights powered by AI analysis</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 font-semibold">
            AI
          </span>
        </div>

        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
          {(['summary', 'feedback'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'summary' ? 'Summary' : 'Detailed Feedback'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 py-5">
        {activeTab === 'summary' && (
          <div>
            {candidate.aiSummary ? (
              <p className="text-slate-700 leading-relaxed text-sm">{candidate.aiSummary}</p>
            ) : (
              <EmptyState label="No AI summary available yet." />
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-3">
            <FeedbackAccordion
              id="strengths"
              title="Strengths"
              icon={<TrendingUp className="w-4 h-4" />}
              colorClass="text-emerald-600 bg-emerald-50"
              items={candidate.strengths}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
            <FeedbackAccordion
              id="weaknesses"
              title="Weaknesses"
              icon={<AlertCircle className="w-4 h-4" />}
              colorClass="text-red-600 bg-red-50"
              items={candidate.weaknesses}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
            <FeedbackAccordion
              id="recommendations"
              title="Recommendations"
              icon={<Zap className="w-4 h-4" />}
              colorClass="text-amber-600 bg-amber-50"
              items={candidate.recommendations}
              expandedSection={expandedSection}
              setExpandedSection={setExpandedSection}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function FeedbackAccordion({
  id,
  title,
  icon,
  colorClass,
  items,
  expandedSection,
  setExpandedSection,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  items: string[];
  expandedSection: string | null;
  setExpandedSection: (section: string | null) => void;
}) {
  const isOpen = expandedSection === id;
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpandedSection(isOpen ? null : id)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>
            {icon}
          </span>
          <span className="text-sm font-semibold text-slate-900">{title}</span>
          {items.length > 0 && (
            <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
              {items.length}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-4 space-y-2.5 bg-white">
          {items.length > 0 ? (
            items.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
              </div>
            ))
          ) : (
            <EmptyState label={`No ${title.toLowerCase()} data available.`} />
          )}
        </div>
      )}
    </div>
  );
}