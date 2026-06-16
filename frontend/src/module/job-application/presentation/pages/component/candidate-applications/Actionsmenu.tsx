'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, FileDown, ExternalLink, XCircle } from 'lucide-react';
import { type JobApplication } from '../../../../domain/entity/job-application.entity';
import { canWithdraw } from './Helpers';

interface Props {
  app: JobApplication;
  onWithdraw: (app: JobApplication) => void;
}

export const ActionsMenu: React.FC<Props> = ({ app, onWithdraw }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const interview = app.getInterview();
  const withdrawable = canWithdraw(app.getStatus());

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`p-2 rounded-xl transition-all duration-150 ${
          open
            ? 'bg-slate-100 text-slate-700'
            : 'text-slate-300 hover:bg-slate-100 hover:text-slate-600'
        }`}
      >
        <MoreVertical size={15} />
      </button>

      {open && (
        <div className="absolute right-0 top-9 z-30 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-100 py-1.5 overflow-hidden">

          {/* Download Resume */}
          <button
            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[13px] font-medium transition"
            onClick={() => setOpen(false)}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <FileDown size={13} className="text-blue-500" />
            </div>
            Download Resume
          </button>

          {/* Join Meeting */}
          {interview?.meetingLink && (
            <a
              href={interview.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-slate-700 text-[13px] font-medium transition"
            >
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                <ExternalLink size={13} className="text-violet-500" />
              </div>
              Join Meeting
            </a>
          )}

          {/* Withdraw — only if eligible */}
          {withdrawable && (
            <>
              <div className="mx-3 my-1.5 border-t border-slate-100" />
              <button
                onClick={() => { setOpen(false); onWithdraw(app); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-500 text-[13px] font-semibold transition"
              >
                <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                  <XCircle size={13} className="text-red-400" />
                </div>
                Withdraw Application
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};