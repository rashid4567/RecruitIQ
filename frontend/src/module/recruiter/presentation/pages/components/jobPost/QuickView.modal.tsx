'use client';

import React from 'react';
import {
  X,
  Edit3,
  ExternalLink,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  Building2,
  CalendarDays,
  Star,
  Mail,
  Phone,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import type { JobCardProps, Applicant } from "../../../types/jobCard.types";

const statusConfig = {
  Active: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  Paused: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-500" },
  Expired: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
  Draft: { bg: "bg-gray-50", text: "text-gray-600", dot: "bg-gray-400" },
};

const applicantStatusConfig = {
  pending: { bg: "bg-gray-100", text: "text-gray-700", label: "Pending" },
  shortlisted: { bg: "bg-emerald-100", text: "text-emerald-700", label: "Shortlisted" },
  rejected: { bg: "bg-red-100", text: "text-red-700", label: "Rejected" },
  interviewed: { bg: "bg-blue-100", text: "text-blue-700", label: "Interviewed" },
};

export default function QuickViewModal({
  job,
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
}: {
  job: JobCardProps | null;
  isOpen: boolean;
  onClose: () => void;
  activeTab: "overview" | "applicants";
  setActiveTab: (tab: "overview" | "applicants") => void;
}) {
  if (!isOpen || !job) return null;

  const status = statusConfig[job.status];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                {job.category}
              </span>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1.5 ${status.bg} ${status.text}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                {job.status}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {job.jobType}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" />
                {job.salary}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-6 py-4 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === "applicants"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Applicants
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
              {job.applicants?.length || 0}
            </span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" ? (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{job.views}</p>
                  <p className="text-xs text-gray-500 mt-1">Views</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{job.applications}</p>
                  <p className="text-xs text-gray-500 mt-1">Applications</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold text-gray-900">{job.shortlisted}</p>
                  <p className="text-xs text-gray-500 mt-1">Shortlisted</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {job.avgAiScore}%
                  </p>
                  <p className="text-xs text-gray-500 mt-1">AI Score</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Job Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <Building2 className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-900">{job.department}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <CalendarDays className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Posted On</p>
                    <p className="text-sm font-medium text-gray-900">{job.postedDate}</p>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 text-sm rounded-xl"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Applicants Tab */
            <div className="space-y-4">
              {job.applicants && job.applicants.length > 0 ? (
                job.applicants.map((applicant) => {
                  const appStatus = applicantStatusConfig[applicant.status];
                  return (
                    <div
                      key={applicant.id}
                      className="p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={applicant.avatar}
                          alt={applicant.name}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{applicant.name}</h4>
                              <p className="text-sm text-gray-500">{applicant.experience}</p>
                            </div>
                            <span
                              className={`px-3 py-1 text-xs font-medium rounded-lg ${appStatus.bg} ${appStatus.text}`}
                            >
                              {appStatus.label}
                            </span>
                          </div>

                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                              <Mail className="w-4 h-4" />
                              {applicant.email}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Phone className="w-4 h-4" />
                              {applicant.phone}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 text-amber-500" />
                                <span className="font-semibold text-gray-900">{applicant.aiScore}%</span>
                                <span className="text-xs text-gray-500">AI Score</span>
                              </div>
                              <span className="text-xs text-gray-400">Applied {applicant.appliedDate}</span>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              </button>
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                <XCircle className="w-4 h-4 text-red-500" />
                              </button>
                              <button className="p-2 hover:bg-white rounded-lg transition-colors">
                                <Download className="w-4 h-4 text-gray-500" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Star className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">No applicants yet</h3>
                  <p className="text-gray-500 mt-1">Applications will show up here</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <a
              href={`/recruiter/job-editor/${job.id}`}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-2xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Edit3 className="w-4 h-4" />
              Edit Job
            </a>

            <button className="px-6 py-3.5 border border-gray-200 rounded-2xl hover:bg-white hover:border-gray-300 transition-all">
              <ExternalLink className="w-5 h-5" />
            </button>

            <button className="px-6 py-3.5 border border-red-200 text-red-600 rounded-2xl hover:bg-red-50 hover:border-red-300 transition-all">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}