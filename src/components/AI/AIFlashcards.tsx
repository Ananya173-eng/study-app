'use client';

import React, { useState } from 'react';
import { FlashcardDeck, Flashcard, Note, StudyMaterial } from '@/types';
import { AIEngine } from '@/lib/ai-engine';
import {
  Layers,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  FileText,
  RotateCw,
  CheckCircle2,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

interface AIFlashcardsProps {
  materials: StudyMaterial[];
  notes: Note[];
  decks: FlashcardDeck[];
  onSaveDeck: (deck: FlashcardDeck) => void;
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const AIFlashcards: React.FC<AIFlashcardsProps> = ({
  materials,
  notes,
  decks,
  onSaveDeck,
  onNotify,
}) => {
  const [sourceType, setSourceType] = useState<'note' | 'material'>('note');
  const [selectedId, setSelectedId] = useState<string>(notes[0]?.id || materials[0]?.id || '');
  const [cardCount, setCardCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Deck State
  const [activeDeck, setActiveDeck] = useState<FlashcardDeck | null>(decks[0] || null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const selectedSource =
    sourceType === 'material'
      ? materials.find((m) => m.id === selectedId)
      : notes.find((n) => n.id === selectedId);

  const handleGenerate = async () => {
    if (!selectedSource) {
      onNotify('warning', 'Source Missing', 'Please select a study material or note.');
      return;
    }

    setIsGenerating(true);
    try {
      const content =
        'fullText' in selectedSource ? selectedSource.fullText : selectedSource.content;
      const title = 'name' in selectedSource ? selectedSource.name : selectedSource.title;

      const cards = await AIEngine.generateFlashcards({
        title,
        content,
        count: cardCount,
      });

      const newDeck: FlashcardDeck = {
        id: `deck_${Date.now()}`,
        title: `Deck: ${title.replace(/\.[^/.]+$/, '').slice(0, 30)}`,
        sourceType,
        sourceTitle: title,
        cards,
        createdAt: new Date().toISOString(),
      };

      onSaveDeck(newDeck);
      setActiveDeck(newDeck);
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setMasteredIds(new Set());

      onNotify('success', 'Flashcards Ready', `Generated ${cards.length} crisp study flashcards.`);
    } catch {
      onNotify('error', 'Generation Error', 'Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNext = () => {
    if (!activeDeck || activeDeck.cards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
  };

  const handlePrev = () => {
    if (!activeDeck || activeDeck.cards.length === 0) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + activeDeck.cards.length) % activeDeck.cards.length);
  };

  const handleToggleMastered = (cardId: string) => {
    setMasteredIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(cardId)) {
        updated.delete(cardId);
      } else {
        updated.add(cardId);
      }
      return updated;
    });
  };

  const handleShuffle = () => {
    if (!activeDeck) return;
    const shuffled = [...activeDeck.cards].sort(() => Math.random() - 0.5);
    setActiveDeck({ ...activeDeck, cards: shuffled });
    setCurrentCardIndex(0);
    setIsFlipped(false);
    onNotify('info', 'Deck Shuffled', 'Cards have been randomized.');
  };

  const handleReset = () => {
    setMasteredIds(new Set());
    setCurrentCardIndex(0);
    setIsFlipped(false);
    onNotify('info', 'Progress Reset', 'Deck mastery reset to 0.');
  };

  const currentCard = activeDeck?.cards[currentCardIndex];
  const isCurrentMastered = currentCard ? masteredIds.has(currentCard.id) : false;
  const masteredCount = masteredIds.size;
  const totalCards = activeDeck?.cards.length || 0;
  const progressPercent = totalCards > 0 ? Math.round((masteredCount / totalCards) * 100) : 0;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 flex items-center justify-center shadow-sm">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-[#edf0f7] tracking-tight">
              AI Flashcards & Spaced Recall
            </h1>
            <p className="text-xs text-[#9aa2b4] mt-0.5">
              Review high-yield concepts with clean, eye-friendly cards and zero distraction.
            </p>
          </div>
        </div>

        {activeDeck && (
          <div className="flex items-center gap-2 text-xs bg-[#242833] border border-[#333947] px-3 py-1.5 rounded-full shadow-sm">
            <span className="text-[#9aa2b4]">Mastery:</span>
            <span className="font-bold text-cyan-400">{masteredCount}/{totalCards}</span>
            <span className="text-xs text-[#9aa2b4]">({progressPercent}%)</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              1. Choose Source & Size
            </h3>

            {/* Source Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setSourceType('note');
                  setSelectedId(notes[0]?.id || '');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  sourceType === 'note'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Notes ({notes.length})</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSourceType('material');
                  setSelectedId(materials[0]?.id || '');
                }}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  sourceType === 'material'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>PDF ({materials.length})</span>
              </button>
            </div>

            {/* Source Selector */}
            {sourceType === 'note' ? (
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Select Study Note
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title} ({n.category})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Select PDF Document
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.fileSizeFormatted})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                Deck Size
              </label>
              <select
                value={cardCount}
                onChange={(e) => setCardCount(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              >
                <option value={4}>4 Cards (Quick Review)</option>
                <option value={8}>8 Cards (Standard Deck)</option>
                <option value={12}>12 Cards (Comprehensive)</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedSource}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Study Deck...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Deck</span>
                </>
              )}
            </button>
          </div>

          {/* Saved Decks Shelf */}
          {decks.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-2.5 shadow-xl">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Saved Flashcard Decks ({decks.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {decks.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => {
                      setActiveDeck(d);
                      setCurrentCardIndex(0);
                      setIsFlipped(false);
                      setMasteredIds(new Set());
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between border transition-all ${
                      activeDeck?.id === d.id
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300 font-semibold'
                        : 'bg-slate-950/60 border-slate-800 text-gray-400 hover:text-white hover:bg-slate-900'
                    }`}
                  >
                    <span className="truncate pr-2">{d.title}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-900 text-gray-400 border border-slate-800">
                      {d.cards.length} cards
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Rock-Solid Flashcard Viewer (ZERO BLEED-THROUGH) */}
        <div className="lg:col-span-7">
          {activeDeck && currentCard ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 flex flex-col justify-between min-h-[520px] shadow-xl">
              <div>
                {/* Header & Controls */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                      Card {currentCardIndex + 1} of {totalCards}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate max-w-sm mt-0.5">
                      {activeDeck.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleShuffle}
                      className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                      title="Shuffle Deck"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
                      title="Reset Progress"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-950/80 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* Flashcard Area with Zero-Ghosting Solid Faces */}
                <div className="my-6">
                  <div
                    onClick={handleFlip}
                    className="cursor-pointer select-none transition-transform hover:scale-[1.01] active:scale-[0.99] duration-200"
                  >
                    {!isFlipped ? (
                      /* FRONT FACE: TOPIC / QUESTION */
                      <div className="min-h-[270px] rounded-2xl p-8 bg-slate-950/70 border-2 border-indigo-500/30 hover:border-indigo-500/60 shadow-lg flex flex-col justify-between items-center text-center transition-all">
                        <div className="w-full flex justify-between items-center text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-semibold uppercase tracking-wider">
                            {currentCard.category || 'Concept / Term'}
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                            <Eye className="w-3.5 h-3.5 text-indigo-400" /> Click to reveal answer
                          </span>
                        </div>

                        <div className="my-auto py-6 max-w-md">
                          <span className="text-xs font-semibold text-indigo-400/90 uppercase tracking-widest block mb-2">
                            Term / Question
                          </span>
                          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                            {currentCard.term}
                          </h2>
                        </div>

                        <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-center gap-2 text-xs text-gray-400">
                          <RotateCw className="w-3.5 h-3.5 text-indigo-400 animate-spin-slow" />
                          <span>Tap card or press &ldquo;Flip Card&rdquo; below</span>
                        </div>
                      </div>
                    ) : (
                      /* BACK FACE: DEFINITION & EXPLANATION ONLY (CLEAN, NO TOPIC OVERLAY) */
                      <div className="min-h-[270px] rounded-2xl p-8 bg-slate-950/90 border-2 border-fuchsia-500/40 shadow-lg flex flex-col justify-between items-center text-center animate-fade-in transition-all">
                        <div className="w-full flex justify-between items-center text-xs">
                          <span className="px-2.5 py-0.5 rounded-full bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30 text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-fuchsia-400" /> Definition & Explanation
                          </span>
                          <span className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                            <RotateCw className="w-3.5 h-3.5 text-fuchsia-400" /> Click to flip back
                          </span>
                        </div>

                        <div className="my-auto py-4 max-w-lg">
                          <p className="text-sm md:text-base font-normal text-gray-100 leading-relaxed">
                            {currentCard.definition}
                          </p>
                        </div>

                        <div className="w-full pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-gray-400">
                          <span className="text-[11px] text-fuchsia-400 font-medium">
                            Recall accuracy check
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Did you know this?
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  onClick={handlePrev}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {/* Flip Button */}
                <button
                  onClick={handleFlip}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>{isFlipped ? 'Show Term' : 'Flip Card'}</span>
                </button>

                {/* Mastery Toggle */}
                <button
                  onClick={() => handleToggleMastered(currentCard.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all shadow-sm ${
                    isCurrentMastered
                      ? 'bg-emerald-600/25 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCurrentMastered ? 'text-emerald-400' : 'text-gray-400'}`} />
                  <span>{isCurrentMastered ? 'Mastered!' : 'Mark Mastered'}</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 space-y-3 min-h-[520px] flex flex-col items-center justify-center shadow-xl">
              <Layers className="w-10 h-10 text-indigo-400 opacity-40 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Flashcard Deck Selected</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Generate flashcards from your study materials or notes to begin your memory review drill.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
