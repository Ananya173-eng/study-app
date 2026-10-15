'use client';

import React, { useState } from 'react';
import { Quiz, QuizQuestion, StudyMaterial, Note } from '@/types';
import { AIEngine } from '@/lib/ai-engine';
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  Loader2,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';

interface AIQuizGeneratorProps {
  materials: StudyMaterial[];
  notes: Note[];
  quizzes: Quiz[];
  onSaveQuiz: (quiz: Quiz) => void;
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const AIQuizGenerator: React.FC<AIQuizGeneratorProps> = ({
  materials,
  notes,
  quizzes,
  onSaveQuiz,
  onNotify,
}) => {
  const [sourceType, setSourceType] = useState<'material' | 'note'>('material');
  const [selectedId, setSelectedId] = useState<string>(materials[0]?.id || notes[0]?.id || '');
  const [questionCount, setQuestionCount] = useState<number>(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active quiz session state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(quizzes[0] || null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Get active source text
  const selectedSource =
    sourceType === 'material'
      ? materials.find((m) => m.id === selectedId)
      : notes.find((n) => n.id === selectedId);

  const handleGenerate = async () => {
    if (!selectedSource) {
      onNotify('warning', 'Source Missing', 'Please select a study material or note to generate a quiz.');
      return;
    }

    setIsGenerating(true);
    try {
      const content =
        'fullText' in selectedSource ? selectedSource.fullText : selectedSource.content;
      const title = 'name' in selectedSource ? selectedSource.name : selectedSource.title;

      const questions = await AIEngine.generateQuiz({
        title,
        content,
        count: questionCount,
        difficulty,
      });

      const newQuiz: Quiz = {
        id: `quiz_${Date.now()}`,
        title: `${difficulty.toUpperCase()} Quiz: ${title.slice(0, 32)}`,
        sourceType,
        sourceTitle: title,
        questions,
        createdAt: new Date().toISOString(),
      };

      onSaveQuiz(newQuiz);
      setActiveQuiz(newQuiz);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);

      onNotify('success', 'Quiz Generated', `Created ${questions.length} MCQs for "${title}".`);
    } catch {
      onNotify('error', 'Generation Error', 'Failed to generate quiz. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return; // locked after completion
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleFinishQuiz = () => {
    setIsSubmitted(true);
    // Calculate score
    if (!activeQuiz) return;
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correct++;
      }
    });
    const pct = Math.round((correct / activeQuiz.questions.length) * 100);
    const updatedQuiz = { ...activeQuiz, bestScore: Math.max(activeQuiz.bestScore || 0, pct) };
    onSaveQuiz(updatedQuiz);
    setActiveQuiz(updatedQuiz);

    onNotify('success', 'Quiz Completed!', `You scored ${correct}/${activeQuiz.questions.length} (${pct}%).`);
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsSubmitted(false);
  };

  // Score calculations
  const calculateScore = () => {
    if (!activeQuiz) return { correct: 0, total: 0, pct: 0 };
    let correct = 0;
    activeQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) correct++;
    });
    return {
      correct,
      total: activeQuiz.questions.length,
      pct: Math.round((correct / activeQuiz.questions.length) * 100),
    };
  };

  const currentQ = activeQuiz?.questions[currentQuestionIndex];
  const { correct, total, pct } = calculateScore();

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Quiz Generator & Practice</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Test your recall with Multiple Choice Questions extracted automatically from your study materials.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-4 shadow-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" />
              1. Quiz Parameters
            </h3>

            {/* Source Type Toggle */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-[#121214] rounded-lg border border-white/5">
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
                <span>Note ({notes.length})</span>
              </button>
            </div>

            {/* Source Selector */}
            {sourceType === 'material' ? (
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Select PDF Document
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.fileSizeFormatted})
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Select Study Note
                </label>
                <select
                  value={selectedId}
                  onChange={(e) => setSelectedId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title} ({n.category})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Difficulty & Count */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Question Count
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={3}>3 Questions (Quick)</option>
                  <option value={5}>5 Questions (Standard)</option>
                  <option value={8}>8 Questions (Deep Drill)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="easy">Easy (Fundamentals)</option>
                  <option value="medium">Medium (Application)</option>
                  <option value="hard">Hard (Analysis & Edge Cases)</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !selectedSource}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating MCQs...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Quiz</span>
                </>
              )}
            </button>
          </div>

          {/* Previous Quizzes Library */}
          {quizzes.length > 0 && (
            <div className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Your Saved Quizzes ({quizzes.length})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
                {quizzes.map((q) => (
                  <button
                    key={q.id}
                    onClick={() => {
                      setActiveQuiz(q);
                      setCurrentQuestionIndex(0);
                      setSelectedAnswers({});
                      setIsSubmitted(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between border transition-all ${
                      activeQuiz?.id === q.id
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-[#141418] border-white/5 text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2 font-medium">{q.title}</span>
                    {q.bestScore !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                        {q.bestScore}%
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Quiz Player */}
        <div className="lg:col-span-7">
          {activeQuiz && currentQ ? (
            <div className="p-6 rounded-xl bg-[#1c1c20] border border-white/5 flex flex-col justify-between min-h-[500px] shadow-lg">
              <div>
                {/* Header & Progress */}
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                    </span>
                    <h3 className="text-sm font-bold text-white truncate max-w-md mt-0.5">
                      {activeQuiz.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {activeQuiz.questions.map((_, idx) => {
                      const isAnswered = selectedAnswers[idx] !== undefined;
                      const isCurrent = idx === currentQuestionIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => setCurrentQuestionIndex(idx)}
                          className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                            isCurrent
                              ? 'bg-emerald-400 ring-2 ring-emerald-400/40 scale-110'
                              : isAnswered
                              ? 'bg-emerald-600'
                              : 'bg-gray-700'
                          }`}
                          title={`Question ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Question Text */}
                <div className="my-5">
                  <h4 className="text-sm font-semibold text-white leading-relaxed">
                    {currentQ.question}
                  </h4>
                </div>

                {/* Options List */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;
                    const isCorrect = currentQ.correctAnswerIndex === optIdx;
                    const showFeedback = isSubmitted || isSelected;

                    let optionStyle = 'bg-[#141418] border-gray-800 text-gray-300 hover:border-gray-700';
                    if (isSubmitted) {
                      if (isCorrect) {
                        optionStyle = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        optionStyle = 'bg-red-950/40 border-red-500/60 text-red-200';
                      }
                    } else if (isSelected) {
                      optionStyle = 'bg-emerald-600/20 border-emerald-500/60 text-emerald-300';
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(currentQuestionIndex, optIdx)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{opt}</span>

                        {isSubmitted && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (Shown when submitted) */}
                {isSubmitted && (
                  <div className="mt-4 p-3.5 rounded-xl bg-blue-950/30 border border-blue-500/30 text-xs text-blue-200 leading-relaxed animate-fade-in">
                    <strong className="text-blue-300 block mb-1">💡 Professor Explanation:</strong>
                    {currentQ.explanation}
                  </div>
                )}
              </div>

              {/* Navigation & Submit footer */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 disabled:opacity-40 flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {isSubmitted ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-400">
                      Score: {correct}/{total} ({pct}%)
                    </span>
                    <button
                      onClick={handleRestartQuiz}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                  </div>
                ) : currentQuestionIndex === activeQuiz.questions.length - 1 ? (
                  <button
                    onClick={handleFinishQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
                  >
                    <span>Submit & Check Score</span>
                    <Award className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((prev) =>
                        Math.min(activeQuiz.questions.length - 1, prev + 1)
                      )
                    }
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1"
                  >
                    <span>Next Question</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#1c1c20] rounded-xl border border-white/5 space-y-3 min-h-[480px] flex flex-col items-center justify-center">
              <HelpCircle className="w-10 h-10 text-emerald-400 opacity-40 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Active Quiz</h3>
              <p className="text-xs text-gray-400 max-w-sm">
                Select a document or note on the left and click &ldquo;Generate AI Quiz&rdquo; to test your knowledge!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
