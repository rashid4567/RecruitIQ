'use client';

import React, { useState } from 'react';
import {
  X,
  Copy,
  ChevronDown,
  Mail,
} from 'lucide-react';

interface FormData {
  candidateName: string;
  email: string;
  applyingFor: string;
  interviewTitle: string;
  date: string;
  hour: string;
  minute: string;
  timezone: string;
  duration: string;
  interviewType: string;
  meetingLinkOption: 'auto' | 'paste';
  meetingLink: string;
  notes: string;
  sendEmail: boolean;
}

interface Errors {
  [key: string]: string;
}

interface ScheduleInterviewModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export default function ScheduleInterviewModal({
  onClose,
  isOpen,
}: ScheduleInterviewModalProps) {
  const [formData, setFormData] = useState<FormData>({
    candidateName: 'Alice Wonderland',
    email: 'alice.wonderland@example.com',
    applyingFor: 'Senior Software Engineer',
    interviewTitle: 'Senior Software Engineer Interview - Round 1',
    date: '2025-11-29',
    hour: '13',
    minute: '35',
    timezone: 'EST (Eastern Standard Time)',
    duration: '60 minutes',
    interviewType: 'Video Call',
    meetingLinkOption: 'auto',
    meetingLink: 'https://meet.google.com/abc-xyz-123',
    notes: '',
    sendEmail: true,
  });

  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Candidate name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.applyingFor.trim()) {
      newErrors.applyingFor = 'Job position is required';
    }
    if (!formData.interviewTitle.trim()) {
      newErrors.interviewTitle = 'Interview title is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }
    if (!formData.interviewType) {
      newErrors.interviewType = 'Interview type is required';
    }
    if (
      formData.meetingLinkOption === 'paste' &&
      !formData.meetingLink.trim()
    ) {
      newErrors.meetingLink = 'Meeting link is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      sendEmail: e.target.checked,
    }));
  };

  const handleRadioChange = (value: 'auto' | 'paste') => {
    setFormData((prev) => ({
      ...prev,
      meetingLinkOption: value,
    }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(formData.meetingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('[v0] Form submitted:', formData);
      // Handle submission here
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-lg font-bold text-gray-900">RecruitIQ</span>
            </div>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">Manage Jobs</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 text-sm">
              <span>+</span>
              Create New Job
            </button>
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <Mail size={20} />
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-900 p-2"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-8 pt-6">
        <p className="text-sm text-gray-600 mb-6">
          Interviews <span className="text-gray-400"> - </span> schedule interview
        </p>
      </div>

      {/* Main Content */}
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-8 pb-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="col-span-2 space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Schedule Interview
              </h1>
              <p className="text-gray-600">
                Finalize interview details and send invitations to the
                candidate.
              </p>
            </div>

            {/* Candidate Information Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Candidate Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Candidate Name
                  </label>
                  <input
                    type="text"
                    name="candidateName"
                    value={formData.candidateName}
                    onChange={handleInputChange}
                    placeholder="Enter candidate name"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.candidateName
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.candidateName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.candidateName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter email address"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Applying for
                </label>
                <input
                  type="text"
                  name="applyingFor"
                  value={formData.applyingFor}
                  onChange={handleInputChange}
                  placeholder="Enter job position"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                    errors.applyingFor
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.applyingFor && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.applyingFor}
                  </p>
                )}
              </div>
            </div>

            {/* Interview Details Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Interview Details
              </h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Interview Title / Round
                </label>
                <input
                  type="text"
                  name="interviewTitle"
                  value={formData.interviewTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., Technical Interview - Round 1"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition mb-4 ${
                    errors.interviewTitle
                      ? 'border-red-500'
                      : 'border-gray-300'
                  }`}
                />
                {errors.interviewTitle && (
                  <p className="text-red-500 text-xs -mt-3 mb-4">
                    {errors.interviewTitle}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.date ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.date && (
                    <p className="text-red-500 text-xs mt-1">{errors.date}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Time
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      name="hour"
                      value={formData.hour}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      {Array.from({ length: 24 }, (_, i) =>
                        i.toString().padStart(2, '0')
                      ).map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                    <span className="text-gray-700 font-semibold">:</span>
                    <select
                      name="minute"
                      value={formData.minute}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      {Array.from({ length: 60 }, (_, i) =>
                        (i * 5).toString().padStart(2, '0')
                      ).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <select
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleInputChange}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                      <option>EST (Eastern Standard Time)</option>
                      <option>CST (Central Standard Time)</option>
                      <option>MST (Mountain Standard Time)</option>
                      <option>PST (Pacific Standard Time)</option>
                      <option>UTC (Coordinated Universal Time)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Duration
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.duration
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                    <option>120 minutes</option>
                  </select>
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.duration}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interview Type
                  </label>
                  <select
                    name="interviewType"
                    value={formData.interviewType}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.interviewType
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <option>Video Call</option>
                    <option>Phone Call</option>
                    <option>In-Person</option>
                    <option>Technical Assessment</option>
                  </select>
                  {errors.interviewType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.interviewType}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Meeting Link Options */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Meeting Link Options
              </h2>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    checked={formData.meetingLinkOption === 'auto'}
                    onChange={() => handleRadioChange('auto')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Auto-generate link (Google Meet / Zoom)
                  </span>
                </label>
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 transition">
                  <input
                    type="radio"
                    checked={formData.meetingLinkOption === 'paste'}
                    onChange={() => handleRadioChange('paste')}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Paste existing link
                  </span>
                </label>
              </div>
              {formData.meetingLinkOption === 'paste' && (
                <div className="mt-4">
                  <input
                    type="url"
                    name="meetingLink"
                    value={formData.meetingLink}
                    onChange={handleInputChange}
                    placeholder="https://meet.google.com/..."
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      errors.meetingLink
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors.meetingLink && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.meetingLink}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Additional Information */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Additional Information
              </h2>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Notes (internal only)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add any internal notes for the interviewers..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition h-24 resize-none"
              />

              {/* Email Toggle */}
              <div className="flex items-center gap-3 mt-6 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="sendEmail"
                  checked={formData.sendEmail}
                  onChange={handleToggle}
                  className="w-6 h-6 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="sendEmail"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Send email to candidate with interview details?
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
              >
                Send Interview
              </button>
            </div>
          </div>

          {/* Right Column - Previews */}
          <div className="col-span-1 space-y-6">
            {/* Meeting Link Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-32">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Meeting Link Preview
              </h3>
              <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                <Copy size={18} className="text-gray-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-600 break-all">
                    {formData.meetingLink}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Copy size={16} />
                {copied ? 'Copied!' : 'Copy Preview Link'}
              </button>
            </div>

            {/* Email Preview */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Email Preview
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Review the email before it&apos;s sent to the candidate.
              </p>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition">
                Preview Email
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 py-4 mt-8">
        <div className="max-w-7xl mx-auto px-8">
          <p className="text-xs text-gray-500">
            © 2025 RecruitFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
