'use client';

import React, { useState } from 'react';
import { Note, StudyMaterial } from '@/types';
import { AIEngine } from '@/lib/ai-engine';
import {
  Sparkles,
  BookOpen,
  FileText,
  Copy,
  Check,
  BookmarkPlus,
  Loader2,
  ListOrdered,
  FileSpreadsheet,
} from 'lucide-react';

interface AISummarizerProps {
  notes: Note[];
  materials: StudyMaterial[];
  initialTitle?: string;
  initialContent?: string;
  onSaveAsNote: (note: Note) => void;
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const AISummarizer: React.FC<AISummarizerProps> = ({
  notes,
  materials,
  initialTitle = '',
  initialContent = '',
  onSaveAsNote,
  onNotify,
}) => {
  const [selectedSourceType, setSelectedSourceType] = useState<'material' | 'note' | 'custom'>(
    initialContent ? 'custom' : materials.length > 0 ? 'material' : 'note'
  );
  const [selectedId, setSelectedId] = useState<string>(
    initialContent ? '' : materials[0]?.id || notes[0]?.id || ''
  );
  const [customText, setCustomText] = useState(initialContent);
  const [customTitle, setCustomTitle] = useState(initialTitle || 'Custom Topic');

  const [style, setStyle] = useState<'bullet-points' | 'executive' | 'key-concepts' | 'study-guide'>('bullet-points');
  const [depth, setDepth] = useState<'short' | 'medium' | 'detailed'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string>('');
  const [hasCopied, setHasCopied] = useState(false);

  // Determine current active content
  let activeTitle = customTitle;
  let activeContent = customText;

  if (selectedSourceType === 'material') {
    const mat = materials.find((m) => m.id === selectedId);
    if (mat) {
      activeTitle = mat.name;
      activeContent = mat.fullText;
    }
  } else if (selectedSourceType === 'note') {
    const note = notes.find((n) => n.id === selectedId);
    if (note) {
      activeTitle = note.title;
      activeContent = note.content;
    }
  }

  const handleGenerateSummary = async () => {
    if (!activeContent.trim()) {
      onNotify('warning', 'Content Required', 'Please select a document or paste study text to summarize.');
      return;
    }

    setIsLoading(true);
    setSummaryResult('');

    try {
      const summary = await AIEngine.summarize({
        title: activeTitle,
        content: activeContent,
        style,
        depth,
      });

      setSummaryResult(summary);
      onNotify('success', 'Summary Generated', `Synthesized ${depth} ${style} summary for "${activeTitle}".`);
    } catch {
      onNotify('error', 'Generation Error', 'Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!summaryResult) return;
    navigator.clipboard.writeText(summaryResult);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    onNotify('info', 'Copied to Clipboard', 'Summary text copied.');
  };

  const handleSaveToNotes = () => {
    if (!summaryResult) return;
    const newNote: Note = {
      id: `note_summary_${Date.now()}`,
      userId: 'user_default',
      title: `Summary: ${activeTitle}`,
      content: summaryResult,
      category: 'AI Summaries',
      priority: 'medium',
      tags: ['Summary', 'AI Generated'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    onSaveAsNote(newNote);
    onNotify('success', 'Saved as Study Note', `Saved "${newNote.title}" to your notes.`);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Study Summarizer</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Condense complex lecture slides, textbook PDFs, and study notes into high-yield summaries.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Configuration Controls */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              1. Select Source Material
            </h3>

            {/* Source Type Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-[#121214] rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => setSelectedSourceType('material')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  selectedSourceType === 'material'
                    ? 'bg-purple-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>PDF ({materials.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSourceType('note')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  selectedSourceType === 'note'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({notes.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSourceType('custom')}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  selectedSourceType === 'custom'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Custom</span>
              </button>
            </div>

            {/* Dropdown for Material or Note */}
            {selectedSourceType === 'material' && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Choose Uploaded PDF
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.fileSizeFormatted})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSourceType === 'note' && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Choose Study Note
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title} ({n.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSourceType === 'custom' && (
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                    Topic Title
                  </label>
                  <input
                    type="text"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="e.g. Distributed Systems & Raft"
                    className="w-full px-3 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                    Paste Study Text / Excerpt
                  </label>
                  <textarea
                    rows={6}
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    placeholder="Paste paragraphs or lecture transcript here..."
                    className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Style & Depth Settings */}
            <div className="pt-3 border-t border-white/5 space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Summary Format
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'bullet-points', label: '📌 Bullet Points' },
                    { id: 'executive', label: '📑 Executive Brief' },
                    { id: 'key-concepts', label: '💡 Key Concepts' },
                    { id: 'study-guide', label: '📖 Study Guide' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setStyle(item.id as any)}
                      className={`p-2 rounded-lg text-left border transition-all text-xs font-medium ${
                        style === item.id
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-[#121214] border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Detail Depth
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['short', 'medium', 'detailed'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDepth(d)}
                      className={`py-1.5 rounded-lg capitalize border text-center font-medium transition-all ${
                        depth === d
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                          : 'bg-[#121214] border-gray-800 text-gray-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateSummary}
              disabled={isLoading || !activeContent.trim()}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-semibold text-xs rounded-lg shadow-lg shadow-amber-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Summary...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Output Summary Viewer */}
        <div className="lg:col-span-7">
          <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 min-h-[480px] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Generated Summary Output
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Source: <span className="text-amber-300 font-medium">{activeTitle}</span>
                  </p>
                </div>

                {summaryResult && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="px-2.5 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
                      title="Copy to clipboard"
                    >
                      {hasCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{hasCopied ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={handleSaveToNotes}
                      className="px-2.5 py-1.5 rounded bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 border border-blue-500/40 text-xs flex items-center gap-1.5 transition-colors"
                      title="Save as Study Note"
                    >
                      <BookmarkPlus className="w-3.5 h-3.5" />
                      <span>Save as Note</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="py-4">
                {isLoading ? (
                  <div className="py-20 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">
                      Reading document, extracting key definitions, and synthesizing summary...
                    </p>
                  </div>
                ) : summaryResult ? (
                  <div className="prose prose-invert max-w-none text-xs text-gray-200 leading-relaxed space-y-3 whitespace-pre-wrap font-sans bg-[#141418] p-4 rounded-xl border border-white/5">
                    {summaryResult}
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-2 text-gray-500">
                    <Sparkles className="w-8 h-8 mx-auto opacity-40 text-amber-400" />
                    <p className="text-xs">No summary generated yet.</p>
                    <p className="text-[11px] text-gray-600 max-w-xs mx-auto">
                      Select a study material or note on the left and click &ldquo;Generate AI Summary&rdquo;.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {summaryResult && (
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                <span>Format: {style.replace('-', ' ')} • Depth: {depth}</span>
                <span>Ready for study & revision</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
