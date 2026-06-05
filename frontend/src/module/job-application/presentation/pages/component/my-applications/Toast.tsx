'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface Props {
  message: string | null;
  onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ message, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message) return null;

  return (
    <div
      className={`flex items-center gap-2.5 text-[12px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 shadow-sm transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1'
      }`}
    >
      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
      {message}
      <button
        onClick={onDismiss}
        className="ml-1 text-emerald-400 hover:text-emerald-600 transition"
      >
        <X size={12} />
      </button>
    </div>
  );
};