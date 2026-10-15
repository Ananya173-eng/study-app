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
  HelpCircle,
  Shuffle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Award,
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
  const [sourceType, setSourceType] = useState<'material' | 'note'>('note');
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
        title: `Flashcards: ${title.slice(0, 32)}`,
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

      onNotify('success', 'Flashcards Ready', `Generated ${cards.length} study flashcards for "${title}".`);
    } catch {
      onNotify('error', 'Generation Error', 'Failed to generate flashcards. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (!activeDeck) return;
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % activeDeck.cards.length);
  };

  const handlePrev = () => {
    if (!activeDeck) return;
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
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Flashcards & Spaced Recall</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Reinforce high-yield terminology, definitions, and formulas with interactive 3D flashcards.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              1. Choose Source & Size
            </h3>

            {/* Source Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#121214] rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => {
                  setSourceType('note');
                  setSelectedId(notes[0]?.id || '');
                }}
                className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  sourceType === 'note'
                    ? 'bg-blue-600 text-white shadow'
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
                className={`py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                  sourceType === 'material'
                    ? 'bg-purple-600 text-white shadow'
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
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
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
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
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
                className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value={4}>4 Cards (Quick Review)</option>
                <option value={8}>8 Cards (Standard Deck)</option>
                <option value={12}>12 Cards (Full Chapter)</option>
              </select>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedSource}
              className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700 text-white font-semibold text-xs rounded-lg shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Flashcards...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Deck</span>
                </>
              )}
            </button>
          </div>

          {/* Decks Library */}
          {decks.length > 0 && (
            <div className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Your Flashcard Decks ({decks.length})
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
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between border transition-all ${
                      activeDeck?.id === d.id
                        ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                        : 'bg-[#141418] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2 font-medium">{d.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">
                      {d.cards.length} cards
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: 3D Flashcard Viewer */}
        <div className="lg:col-span-7">
          {activeDeck && currentCard ? (
            <div className="p-6 rounded-xl bg-[#1c1c20] border border-white/5 flex flex-col justify-between min-h-[500px] shadow-lg">
              {/* Header with Progress */}
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                      Card {currentCardIndex + 1} of {totalCards}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate max-w-sm mt-0.5">
                      {activeDeck.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShuffle}
                      className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                      title="Shuffle Deck"
                    >
                      <Shuffle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                      title="Reset Progress"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mastery progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1">
                    <span>Mastered: {masteredCount} of {totalCards}</span>
                    <span className="text-cyan-400 font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-[#141414] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* 3D Flashcard Canvas */}
                <div
                  onClick={handleFlip}
                  className="my-6 min-h-[260px] cursor-pointer perspective-1000 select-none"
                >
                  <div
                    className={`relative w-full h-[260px] rounded-2xl transition-all duration-500 transform-style-preserve-3d shadow-2xl border ${
                      isFlipped ? 'rotate-y-180 border-cyan-500/40 bg-gradient-to-br from-[#182428] to-[#12161a]' : 'border-white/10 bg-gradient-to-br from-[#202028] to-[#16161c]'
                    }`}
                  >
                    {/* FRONT: TERM */}
                    <div className="absolute inset-0 backface-hidden p-8 flex flex-col justify-between items-center text-center">
                      <div className="w-full flex justify-between items-center text-[10px] text-gray-400">
                        <span className="uppercase font-semibold tracking-wider text-cyan-400">
                          {currentCard.category || 'Term / Concept'}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <RotateCw className="w-3 h-3" /> Click to flip
                        </span>
                      </div>

                      <div className="my-auto">
                        <h2 className="text-2xl font-extrabold text-white tracking-tight">
                          {currentCard.term}
                        </h2>
                      </div>

                      <span className="text-[11px] text-gray-500">
                        Tap anywhere to reveal definition
                      </span>
                    </div>

                    {/* BACK: DEFINITION */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 p-8 flex flex-col justify-between items-center text-center">
                      <div className="w-full flex justify-between items-center text-[10px] text-cyan-300">
                        <span className="uppercase font-semibold tracking-wider">
                          Explanation / Definition
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <RotateCw className="w-3 h-3" /> Click to flip back
                        </span>
                      </div>

                      <div className="my-auto max-w-lg">
                        <p className="text-sm font-medium text-gray-100 leading-relaxed">
                          {currentCard.definition}
                        </p>
                      </div>

                      <span className="text-[11px] text-cyan-400/80">
                        {currentCard.term}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Controls */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={handlePrev}
                  className="px-3.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Prev</span>
                </button>

                {/* Mark as Mastered button */}
                <button
                  onClick={() => handleToggleMastered(currentCard.id)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all ${
                    isCurrentMastered
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-950/50'
                      : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isCurrentMastered ? 'text-emerald-400' : 'text-gray-500'}`} />
                  <span>{isCurrentMastered ? 'Mastered!' : 'Mark as Mastered'}</span>
                </button>

                <button
                  onClick={handleNext}
                  className="px-3.5 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 flex items-center gap-1 transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#1c1c20] rounded-xl border border-white/5 space-y-3 min-h-[500px] flex flex-col items-center justify-center">
              <Layers className="w-10 h-10 text-cyan-400 opacity-40 mx-auto" />
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
