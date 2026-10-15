'use client';

import React from 'react';
import { Task, User } from '@/types';
import {
  TrendingUp,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Award,
  Circle,
  BarChart2,
} from 'lucide-react';

interface DeadlinesProgressViewProps {
  tasks: Task[];
  user: User;
  onToggleStatus: (taskId: string) => void;
}

export const DeadlinesProgressView: React.FC<DeadlinesProgressViewProps> = ({
  tasks,
  user,
  onToggleStatus,
}) => {
  const now = new Date().getTime();

  // Sort tasks chronologically by deadline
  const sortedTasks = [...tasks].sort(
    (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const overallPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Categories breakdown
  const categoryStats: { [cat: string]: { total: number; completed: number } } = {};
  tasks.forEach((t) => {
    const cat = t.category || 'General';
    if (!categoryStats[cat]) categoryStats[cat] = { total: 0, completed: 0 };
    categoryStats[cat].total += 1;
    if (t.status === 'completed') categoryStats[cat].completed += 1;
  });

  // Urgency Buckets
  const overdueTasks = sortedTasks.filter(
    (t) => new Date(t.deadline).getTime() < now && t.status !== 'completed'
  );
  const dueTodayTasks = sortedTasks.filter((t) => {
    const isToday = new Date(t.deadline).toDateString() === new Date().toDateString();
    return isToday && t.status !== 'completed';
  });
  const upcomingTasks = sortedTasks.filter((t) => {
    const tTime = new Date(t.deadline).getTime();
    const isToday = new Date(t.deadline).toDateString() === new Date().toDateString();
    return tTime >= now && !isToday && t.status !== 'completed';
  });
  const recentlyCompleted = sortedTasks.filter((t) => t.status === 'completed');

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Deadlines & Progress Analytics</h1>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30">
            {overallPercent}% Complete
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          Monitor exam dates, assignment deadlines, completion velocity, and study streaks in real-time.
        </p>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Completion Velocity */}
        <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{overallPercent}%</span>
            <span className="text-xs text-gray-400">of all sprint tasks completed</span>
          </div>
          <div className="w-full h-2 bg-[#121214] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            {completedCount} tasks completed, {tasks.length - completedCount} tasks remaining.
          </p>
        </div>

        {/* Study Streak */}
        <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Study Consistency</span>
            <Flame className="w-4 h-4 text-orange-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-orange-400">{user.streakDays || 7} Days</span>
            <span className="text-xs text-gray-400">active study streak</span>
          </div>
          <div className="flex gap-1.5 pt-1">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
              <div
                key={idx}
                className="flex-1 py-1.5 rounded text-center text-[10px] font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30"
              >
                {day}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            🔥 In the top 5% of student consistency this semester!
          </p>
        </div>

        {/* Weekly Study Hours */}
        <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-3">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-semibold uppercase tracking-wider">Weekly Target</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-purple-400">19 hrs</span>
            <span className="text-xs text-gray-400">/ {user.targetWeeklyHours || 25} hrs goal</span>
          </div>
          <div className="w-full h-2 bg-[#121214] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((19 / (user.targetWeeklyHours || 25)) * 100))}%` }}
            />
          </div>
          <p className="text-[11px] text-gray-400">
            6 hours remaining to meet your weekly milestone.
          </p>
        </div>
      </div>

      {/* Subject-Wise Progress Breakdown */}
      <div className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 space-y-4">
        <div className="flex items-center gap-2 text-gray-200">
          <BarChart2 className="w-4 h-4 text-blue-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            Subject & Topic Mastery Breakdown
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryStats).map(([cat, stats]) => {
            const pct = Math.round((stats.completed / stats.total) * 100);
            return (
              <div key={cat} className="p-3.5 rounded-lg bg-[#242429] border border-white/5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white truncate">{cat}</span>
                  <span className="text-[11px] font-bold text-blue-400">{pct}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#121214] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 flex justify-between">
                  <span>Completed</span>
                  <span>{stats.completed}/{stats.total}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological Deadlines Timeline */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          Chronological Deadline Timeline
        </h3>

        {/* OVERDUE */}
        {overdueTasks.length > 0 && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>OVERDUE DEADLINES ({overdueTasks.length})</span>
            </div>
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-[#201517] border border-red-500/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="text-gray-500 hover:text-emerald-400"
                  >
                    <Circle className="w-4 h-4 text-red-400" />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-white">{task.title}</h4>
                    <p className="text-[11px] text-red-300">
                      Was due on {new Date(task.deadline).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold">
                  Action Required
                </span>
              </div>
            ))}
          </div>
        )}

        {/* DUE TODAY */}
        {dueTodayTasks.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Clock className="w-4 h-4" />
              <span>DUE TODAY ({dueTodayTasks.length})</span>
            </div>
            {dueTodayTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-[#201d15] border border-amber-500/20 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onToggleStatus(task.id)}
                    className="text-gray-500 hover:text-emerald-400"
                  >
                    <Circle className="w-4 h-4 text-amber-400" />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-white">{task.title}</h4>
                    <p className="text-[11px] text-amber-300">
                      Due at {new Date(task.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                  Due Today
                </span>
              </div>
            ))}
          </div>
        )}

        {/* UPCOMING THIS WEEK & LATER */}
        <div className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
            <Calendar className="w-4 h-4" />
            <span>UPCOMING DEADLINES ({upcomingTasks.length})</span>
          </div>
          {upcomingTasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-lg bg-[#242429] border border-white/5 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onToggleStatus(task.id)}
                  className="text-gray-500 hover:text-emerald-400"
                >
                  <Circle className="w-4 h-4" />
                </button>
                <div>
                  <h4 className="text-xs font-bold text-white">{task.title}</h4>
                  <p className="text-[11px] text-gray-400">
                    Target: {new Date(task.deadline).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                {task.category}
              </span>
            </div>
          ))}

          {upcomingTasks.length === 0 && (
            <div className="text-center py-6 text-gray-500 text-xs">
              No other upcoming deadlines.
            </div>
          )}
        </div>

        {/* RECENTLY COMPLETED */}
        {recentlyCompleted.length > 0 && (
          <div className="p-4 rounded-xl bg-[#1c1c20] border border-white/5 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>COMPLETED MILESTONES ({recentlyCompleted.length})</span>
            </div>
            {recentlyCompleted.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-3 rounded-lg bg-[#242429] border border-white/5 flex items-center justify-between gap-3 opacity-75"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 line-through">{task.title}</h4>
                    <p className="text-[10px] text-gray-500">
                      Completed {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : 'recently'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onToggleStatus(task.id)}
                  className="text-[10px] text-gray-400 hover:text-white underline"
                >
                  Mark Incomplete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
