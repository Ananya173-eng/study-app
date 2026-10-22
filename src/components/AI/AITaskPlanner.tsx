'use client';

import React, { useState } from 'react';
import { PlannedTask, Task, Priority, ViewType } from '@/types';
import { AIEngine } from '@/lib/ai-engine';
import {
  Calendar,
  Sparkles,
  PlusCircle,
  Clock,
  ArrowRight,
  CheckCircle2,
  ListTodo,
  Loader2,
  Check,
  Award,
} from 'lucide-react';

interface AITaskPlannerProps {
  onAddTasks: (newTasks: Task[]) => void;
  onSelectView: (view: ViewType) => void;
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const AITaskPlanner: React.FC<AITaskPlannerProps> = ({
  onAddTasks,
  onSelectView,
  onNotify,
}) => {
  const [goal, setGoal] = useState('Master Distributed Consensus (Paxos & Raft) and CAP Theorem');
  const [subject, setSubject] = useState('Computer Science');
  const [timeframeDays, setTimeframeDays] = useState(10);
  const [isPlanning, setIsPlanning] = useState(false);

  const [planOverview, setPlanOverview] = useState<string>('');
  const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([]);
  const [isImported, setIsImported] = useState(false);

  // Suggested goals
  const sampleGoals = [
    { g: 'Master Distributed Consensus and CAP Theorem', s: 'Computer Science', d: 10 },
    { g: 'Score 90%+ on Cellular Respiration & Biochemistry Exam', s: 'Biology', d: 7 },
    { g: 'Complete Linear Algebra Eigenvalues & SVD Problem Sets', s: 'Mathematics', d: 5 },
    { g: 'Draft 15-page Cognitive Psychology Literature Review', s: 'Psychology', d: 14 },
  ];

  const handleGeneratePlan = async () => {
    if (!goal.trim()) {
      onNotify('warning', 'Goal Required', 'Please enter a learning goal or syllabus topic.');
      return;
    }

    setIsPlanning(true);
    setIsImported(false);

    try {
      const plan = await AIEngine.planGoal({
        goal: goal.trim(),
        subject: subject.trim(),
        timeframeDays,
      });

      setPlanOverview(plan.overview);
      setPlannedTasks(plan.tasks);
      onNotify(
        'success',
        'Study Roadmap Generated',
        `Decomposed your goal into ${plan.tasks.length} actionable study milestones.`
      );
    } catch {
      onNotify('error', 'Planning Error', 'Could not generate plan. Please try again.');
    } finally {
      setIsPlanning(false);
    }
  };

  const handleToggleTaskSelection = (id: string) => {
    setPlannedTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleImportSelectedToTracker = () => {
    const selected = plannedTasks.filter((t) => t.selected !== false);
    if (selected.length === 0) {
      onNotify('warning', 'No Tasks Selected', 'Please check at least one task to import.');
      return;
    }

    const realTasks: Task[] = selected.map((t) => ({
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: 'user_default',
      title: t.title,
      description: `${t.description} (Estimated: ${t.estimatedHours} hrs)`,
      category: t.category,
      priority: t.priority,
      status: 'todo',
      deadline: t.suggestedDeadline,
      createdAt: new Date().toISOString(),
    }));

    onAddTasks(realTasks);
    setIsImported(true);
    onNotify(
      'success',
      'Tasks Imported!',
      `Successfully added ${realTasks.length} tasks to your Task Tracker with deadlines.`
    );
  };

  const selectedCount = plannedTasks.filter((t) => t.selected !== false).length;
  const totalEstimatedHours = plannedTasks.reduce((acc, t) => acc + (t.selected !== false ? t.estimatedHours : 0), 0);

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Study Task Planner</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Transform high-level academic goals or exam syllabi into scheduled, step-by-step task roadmaps.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              1. Define Your Goal
            </h3>

            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                Learning Goal or Exam Topic *
              </label>
              <textarea
                rows={3}
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Master React 19, Server Actions, and Next.js App Router"
                className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Subject / Field
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                  Timeframe (Days)
                </label>
                <select
                  value={timeframeDays}
                  onChange={(e) => setTimeframeDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={3}>3 Days (Crash Sprint)</option>
                  <option value={7}>7 Days (1 Week Sprint)</option>
                  <option value={10}>10 Days (Recommended)</option>
                  <option value={14}>14 Days (2 Weeks)</option>
                  <option value={30}>30 Days (Full Month)</option>
                </select>
              </div>
            </div>

            {/* Quick Inspiration Buttons */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">
                Sample Goals:
              </label>
              <div className="space-y-1.5">
                {sampleGoals.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setGoal(sample.g);
                      setSubject(sample.s);
                      setTimeframeDays(sample.d);
                    }}
                    className="w-full text-left p-2 rounded-lg bg-slate-950/60 hover:bg-slate-900 border border-slate-800 text-[11px] text-gray-300 hover:text-white transition-colors truncate"
                  >
                    🎯 {sample.g} ({sample.d}d)
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isPlanning || !goal.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isPlanning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Study Roadmap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Task Plan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Planned Roadmap & Import */}
        <div className="lg:col-span-7">
          <div className="p-6 rounded-xl bg-slate-900/60 backdrop-blur-xl border border-slate-800 min-h-[500px] flex flex-col justify-between shadow-xl">
            <div>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    Decomposed Milestone Roadmap
                  </h3>
                  {plannedTasks.length > 0 && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {plannedTasks.length} Milestones • Total Estimated Effort: ~{totalEstimatedHours} Study Hours
                    </p>
                  )}
                </div>

                {plannedTasks.length > 0 && (
                  <button
                    onClick={handleImportSelectedToTracker}
                    disabled={isImported || selectedCount === 0}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all ${
                      isImported
                        ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 text-white shadow-indigo-500/25 active:scale-[0.98]'
                    }`}
                  >
                    {isImported ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Imported into Tasks!</span>
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-4 h-4" />
                        <span>Add {selectedCount} to My Tasks</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="py-4 space-y-4">
                {isPlanning ? (
                  <div className="py-24 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto" />
                    <p className="text-xs text-gray-400">
                      Analyzing syllabus requirements, optimizing study loads, and formulating milestones...
                    </p>
                  </div>
                ) : plannedTasks.length > 0 ? (
                  <>
                    {/* Overview box */}
                    {planOverview && (
                      <div className="p-3.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200 leading-relaxed">
                        <strong className="text-indigo-300 block mb-1">Strategic Overview:</strong>
                        {planOverview}
                      </div>
                    )}

                    {/* Task checklist */}
                    <div className="space-y-3">
                      {plannedTasks.map((task, idx) => {
                        const isSelected = task.selected !== false;
                        const deadline = new Date(task.suggestedDeadline);

                        return (
                          <div
                            key={task.id}
                            onClick={() => handleToggleTaskSelection(task.id)}
                            className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                              isSelected
                                ? 'bg-slate-950/80 border-indigo-500/40 shadow-md shadow-indigo-500/10'
                                : 'bg-slate-950/40 border-slate-800 opacity-60'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // handled by parent onClick
                              className="mt-1 w-4 h-4 rounded text-indigo-600 bg-slate-900 border-slate-700 focus:ring-indigo-500 cursor-pointer"
                            />

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <h4 className="text-xs font-bold text-white truncate">
                                  Phase {idx + 1}: {task.title}
                                </h4>
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                  ~{task.estimatedHours} hrs
                                </span>
                              </div>

                              <p className="text-[11px] text-gray-400 leading-relaxed">
                                {task.description}
                              </p>

                              <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-500 font-medium">
                                <span className="flex items-center gap-1 text-amber-400/90">
                                  <Clock className="w-3 h-3" />
                                  Target: {deadline.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <span>•</span>
                                <span className="uppercase text-gray-400">
                                  Priority: {task.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="py-24 text-center space-y-2 text-gray-500">
                    <ListTodo className="w-8 h-8 mx-auto opacity-40 text-indigo-400" />
                    <p className="text-xs">No roadmap generated yet.</p>
                    <p className="text-[11px] text-gray-600 max-w-xs mx-auto">
                      Fill out your learning goal and timeframe on the left to produce an AI-structured task plan.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer with jump link */}
            {isImported && (
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between animate-fade-in">
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Tasks are now live in your Task Tracker!
                </span>
                <button
                  onClick={() => onSelectView('tasks')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                >
                  <span>Go to Task Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
