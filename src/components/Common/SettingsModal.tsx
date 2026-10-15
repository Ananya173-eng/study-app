'use client';

import React, { useState } from 'react';
import { Storage } from '@/lib/storage';
import { X, Key, RotateCcw, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResetData: () => void;
  onNotify: (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onResetData,
  onNotify,
}) => {
  const [apiKey, setApiKey] = useState(Storage.getApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveKey = () => {
    Storage.setApiKey(apiKey.trim());
    setIsSaved(true);
    onNotify('success', 'AI Settings Updated', 'Your API Key preferences have been saved securely in your browser.');
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all notes, tasks, materials, and quizzes back to the default demo state?')) {
      Storage.resetToDemo();
      onResetData();
      onNotify('info', 'Reset Completed', 'All study data restored to initial demo seeds.');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#18181b] border border-gray-800 rounded-2xl shadow-2xl p-6 text-gray-100 overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Hub Preferences & AI Keys</h3>
              <p className="text-xs text-gray-400">Configure AI providers and workspace data</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-5 text-sm">
          {/* AI Key section */}
          <div className="p-4 rounded-xl bg-[#202024] border border-white/5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-gray-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                Gemini / OpenAI API Key (Optional)
              </label>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Built-in Smart Fallback Active
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              The AI Study Hub features a smart local academic generation engine that works immediately without any API key. If you wish to connect your personal Gemini or OpenAI key for live cloud LLM reasoning, paste it below:
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy... or sk-..."
                className="flex-1 px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                {isSaved ? 'Saved' : 'Save Key'}
              </button>
            </div>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 rounded-xl bg-[#202024] border border-white/5 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-semibold text-white">Reset Study Hub Demo Data</h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Restores default Computer Science, Biology, and Math notes, tasks, and PDFs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
