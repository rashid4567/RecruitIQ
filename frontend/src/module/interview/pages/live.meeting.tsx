'use client'

import { useState } from 'react'
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Users,
  MessageCircle,
  Clock,
  Settings,
  MoreVertical,
  Smile,
  Monitor,
  Wifi,
  X,
} from 'lucide-react'

export default function Page() {
  const [activeTab, setActiveTab] = useState<'participants' | 'chat' | 'notes' | 'info'>('notes')
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [rating, setRating] = useState(5)
  const [notes, setNotes] = useState(
    `Candidate demonstrated strong problem-solving skills, especially with the algorithm challenge. Good communication style when explaining thought process. Needs to improve on handling edge cases effectively.

Key Strengths:
- Algorithm design
- Clear communication

Areas for Development:
- Edge case handling
- Specific framework knowledge`
  )
  const [recommendation, setRecommendation] = useState('Recommend for a second technical round focusing on system design.')

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                P
              </div>
              <span className="text-lg font-semibold text-blue-600">RecruitIQ</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <h1 className="text-xl font-semibold text-gray-900">Frontend Developer - Technical Round</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              REC
            </div>
            <div className="text-sm font-semibold text-gray-900">00:00</div>
            <Wifi className="w-5 h-5 text-green-600" />
            <Settings className="w-5 h-5 text-gray-600 cursor-pointer" />
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
              <X className="w-4 h-4" />
              End Call
            </button>
          </div>
        </div>

        {/* Main Video Area */}
        <div className="flex-1 flex gap-4 p-4">
          {/* Video Feed */}
          <div className="flex-1 flex flex-col gap-4">
            <div className="flex-1 bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg overflow-hidden relative group">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/visily-recruiter-live-meeting-kAUbCi51NjAZ14YWboQjejnOs5YJW5.png"
                alt="Candidate"
                className="w-full h-full object-cover"
              />
              
              {/* Toggle Captions Button */}
              <div className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer">
                <Monitor className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">Toggle Captions</span>
              </div>

              {/* Picture in Picture */}
              <div className="absolute bottom-4 right-4 w-32 h-40 bg-gray-200 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop"
                  alt="PiP Participant"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Keyboard Shortcuts */}
              <div className="absolute bottom-4 left-4 text-white text-sm flex items-center gap-2">
                <span className="bg-black bg-opacity-50 px-2 py-1 rounded">?</span>
                <span>Press '?' for Keyboard Shortcuts</span>
              </div>
            </div>

            {/* Bottom Toolbar */}
            <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full transition ${
                    isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                <div className="w-px h-6 bg-gray-200"></div>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`p-3 rounded-full transition ${
                    isVideoOff ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Share Screen
                </button>
                <div className="w-px h-6 bg-gray-200"></div>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Participants (3)
                </button>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg relative text-sm font-medium flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                </button>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  Recording...
                </button>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <Monitor className="w-4 h-4" />
                  SignpostBig
                </button>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  Notes
                </button>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  <Smile className="w-4 h-4" />
                </button>

                <button className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium">
                  <MoreVertical className="w-4 h-4" />
                </button>

                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium text-sm">
                  <X className="w-4 h-4" />
                  End Call
                </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-80 bg-white rounded-lg border border-gray-200 flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-4 pt-4">
              {[
                { id: 'participants', label: 'Participants' },
                { id: 'chat', label: 'Chat' },
                { id: 'notes', label: 'Notes' },
                { id: 'info', label: 'Candidate Info' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-3 font-medium text-sm border-b-2 transition ${
                    activeTab === tab.id
                      ? 'text-blue-600 border-blue-600'
                      : 'text-gray-600 border-transparent hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'notes' && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">Template:</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>General Interview</option>
                      <option>Technical Round</option>
                      <option>Final Round</option>
                    </select>
                  </div>

                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Add interview notes..."
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-900">Rating:</label>
                      <span className="text-sm font-semibold text-gray-900">{rating}/5</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                  </div>

                  <div>
                    <textarea
                      value={recommendation}
                      onChange={(e) => setRecommendation(e.target.value)}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Add recommendation..."
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm">
                      Save Notes
                    </button>
                    <span className="text-xs text-gray-500">Auto-saved 2 mins ago</span>
                  </div>
                </div>
              )}

              {activeTab === 'participants' && (
                <div className="p-4 space-y-2">
                  <div className="text-sm text-gray-600">No additional participants information</div>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="p-4 space-y-2">
                  <div className="text-sm text-gray-600">No chat messages yet</div>
                </div>
              )}

              {activeTab === 'info' && (
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Position</h3>
                    <p className="text-sm text-gray-600">Frontend Developer - Technical Round</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Status</h3>
                    <p className="text-sm text-gray-600">In Progress</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
