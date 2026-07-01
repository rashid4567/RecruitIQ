'use client';

import { useState, useEffect } from 'react';
import { X, Camera, Mic, Wifi, CheckCircle, Volume2 } from 'lucide-react';

export default function PreMeetingLobby() {
  const [timeLeft, setTimeLeft] = useState(874); // 14:34 in seconds
  const [selectedCamera, setSelectedCamera] = useState('HD Pro Webcam (Built-in)');
  const [selectedMicrophone, setSelectedMicrophone] = useState('Microphone Array (Realtek)');
  const [micLevel, setMicLevel] = useState(65);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-50">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl relative overflow-hidden">
        {/* Close Button */}
        <button className="absolute top-5 right-5 p-2 hover:bg-gray-100 rounded-full transition-colors z-10 group">
          <X className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
        </button>

        {/* Main Content */}
        <div className="px-10 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-950">Pre-Meeting Lobby</h1>
            <p className="text-gray-500 text-base mt-1">Get ready for your interview.</p>
          </div>

          {/* Countdown Timer - Large and Prominent */}
          <div className="text-center mb-12 py-8">
            <p className="text-6xl font-black text-red-600 mb-2 tracking-tight">
              Interview Starts in {formatTime(timeLeft)}
            </p>
            <p className="text-gray-600 text-base font-medium">Interview starts at 10:00 AM (EST)</p>
          </div>

          {/* Camera and Microphone Test Section */}
          <div className="grid grid-cols-2 gap-10 mb-12">
            {/* Camera Test */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">Camera Test</h3>
              </div>

              {/* Camera Preview */}
              <div className="bg-gray-200 rounded-xl mb-5 h-48 flex items-center justify-center relative overflow-hidden border border-gray-300">
                {/* Background linear */}
                <div className="absolute inset-0 bg-linear-to-br from-gray-300 via-gray-250 to-gray-300"></div>
                
                {/* Camera icon at top */}
                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="w-10 h-8 bg-gray-900 rounded-lg flex items-center justify-center shadow-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Person video mock */}
                <div className="relative z-20 flex flex-col items-center gap-2">
                  <div className="w-24 h-32 bg-white rounded-lg shadow-md flex items-center justify-center border-2 border-gray-300">
                    <div className="text-center">
                      <div className="text-5xl mb-1">👤</div>
                      <div className="text-xs text-gray-500 font-medium">Video Feed</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Camera Dropdown */}
              <div>
                <label className="text-sm text-gray-700 block mb-2.5 font-semibold">Camera</label>
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                >
                  <option>HD Pro Webcam (Built-in)</option>
                  <option>External Webcam</option>
                  <option>Integrated Camera</option>
                </select>
              </div>
            </div>

            {/* Microphone & Speaker Test */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-gray-700" />
                </div>
                <h3 className="text-lg font-bold text-gray-950">
                  Microphone & Speaker Test
                </h3>
              </div>

              {/* Microphone Dropdown */}
              <div className="mb-6">
                <label className="text-sm text-gray-700 block mb-2.5 font-semibold">Microphone</label>
                <select
                  value={selectedMicrophone}
                  onChange={(e) => setSelectedMicrophone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400"
                >
                  <option>Microphone Array (Realtek)</option>
                  <option>Built-in Microphone</option>
                  <option>USB Microphone</option>
                </select>
              </div>

              {/* Mic Level */}
              <div className="mb-6">
                <label className="text-sm text-gray-700 block mb-3 font-semibold">Mic Level</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={micLevel}
                  onChange={(e) => setMicLevel(parseInt(e.target.value))}
                  className="w-full h-2.5 bg-gray-300 rounded-full appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
                  style={{
                    background: `linear-linear(to right, #3b82f6 0%, #3b82f6 ${micLevel}%, #d1d5db ${micLevel}%, #d1d5db 100%)`
                  }}
                />
              </div>

              {/* Speakers */}
              <div>
                <label className="text-sm text-gray-700 block mb-2.5 font-semibold">Speakers</label>
                <button className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 hover:bg-gray-50 transition-all flex items-center justify-center gap-2.5 font-semibold hover:border-gray-400 active:bg-gray-100">
                  <Volume2 className="w-4 h-4" />
                  Test Speakers
                </button>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="grid grid-cols-2 gap-6 mb-10">
            {/* Connection Quality */}
            <div className="flex items-start gap-4 bg-blue-50 rounded-xl p-4 border border-blue-100">
              <Wifi className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-950 text-sm">Connection Quality</h4>
                <p className="text-sm text-gray-600 mt-1 font-medium">Good connection. You&apos;re all set!</p>
              </div>
            </div>

            {/* Browser Compatibility */}
            <div className="flex items-start gap-4 bg-green-50 rounded-xl p-4 border border-green-100">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-950 text-sm">Browser Compatibility</h4>
                <p className="text-sm text-gray-600 mt-1 font-medium">Your browser is fully compatible.</p>
              </div>
            </div>
          </div>

          {/* Join Meeting Button */}
          <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-lg hover:shadow-xl text-base">
            Join Meeting
          </button>
        </div>
      </div>
    </div>
  );
}
