'use client';

import React, { useState } from 'react';
import { Task, Priority, TaskStatus } from '@/types';
import { DeleteModal } from '@/components/Common/DeleteModal';
import {
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit3,
  Columns,
  List as ListIcon,
  Check,
  X,
  AlertTriangle,
} from 'lucide-react';

interface TasksViewProps {
  tasks: Task[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  onSaveTask,
  onDeleteTask,
  onToggleStatus,
  onNotify,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');

  // Task Editor Modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [priority, setPriority] = useState<Priority>('medium');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [deadline, setDeadline] = useState('');

  // Delete Confirmation Modal
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const now = new Date().getTime();

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'todo');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'in-progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'completed');

  // Open Create
  const handleCreateNew = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setCategory('Computer Science');
    setPriority('medium');
    setStatus('todo');
    // Default deadline to tomorrow 6 PM
    const tomorrow = new Date(Date.now() + 86400000);
    setDeadline(tomorrow.toISOString().split('T')[0] + 'T18:00');
    setIsEditorOpen(true);
  };

  // Open Edit
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setPriority(task.priority);
    setStatus(task.status);
    setDeadline(task.deadline || '');
    setIsEditorOpen(true);
  };

  // Save Task
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onNotify('warning', 'Task Title Required', 'Please enter a title for your task.');
      return;
    }

    const updatedTask: Task = {
      id: editingTask ? editingTask.id : `task_${Date.now()}`,
      userId: editingTask ? editingTask.userId : 'user_default',
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || 'General',
      priority,
      status,
      deadline: deadline || new Date(Date.now() + 86400000).toISOString(),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      completedAt: status === 'completed' ? new Date().toISOString() : undefined,
    };

    onSaveTask(updatedTask);
    setIsEditorOpen(false);
    onNotify('success', editingTask ? 'Task Updated' : 'Task Created', `"${updatedTask.title}" saved.`);
  };

  // Delete Action Request
  const handleRequestDelete = (task: Task) => {
    setTaskToDelete(task);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      const deletedTitle = taskToDelete.title;
      onDeleteTask(taskToDelete.id);
      setTaskToDelete(null);
      onNotify('success', 'Task Deleted', `"${deletedTitle}" has been deleted.`);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  // Move status directly in Kanban
  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    const updated = {
      ...task,
      status: newStatus,
      completedAt: newStatus === 'completed' ? new Date().toISOString() : undefined,
    };
    onSaveTask(updated);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Task Tracker</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
              {tasks.filter((t) => t.status === 'completed').length} / {tasks.length} Completed
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Organize study sprints, track deadlines with urgent alerts, and view progress via Kanban or list.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-[#1c1c20] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Columns className="w-4 h-4" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs flex items-center gap-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow' : 'text-gray-400 hover:text-white'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            onClick={handleCreateNew}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#1c1c20] rounded-xl border border-white/5 p-3.5 flex flex-wrap items-center gap-3 shadow-md">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, description, or subject..."
            className="w-full pl-9 pr-3 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* KANBAN VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* COLUMN: TO DO */}
          <div className="bg-[#18181c] rounded-xl border border-white/5 p-4 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">To Do</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-blue-500/10 text-blue-400 font-semibold">
                  {todoTasks.length}
                </span>
              </div>
              <button
                onClick={handleCreateNew}
                className="p-1 text-gray-400 hover:text-white rounded"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {todoTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  now={now}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleRequestDelete(task)}
                  onToggleStatus={() => onToggleStatus(task.id)}
                  onChangeStatus={(s) => handleStatusChange(task, s)}
                />
              ))}

              {todoTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No tasks to do
                </div>
              )}
            </div>
          </div>

          {/* COLUMN: IN PROGRESS */}
          <div className="bg-[#18181c] rounded-xl border border-white/5 p-4 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">In Progress</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-500/10 text-amber-400 font-semibold">
                  {inProgressTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {inProgressTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  now={now}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleRequestDelete(task)}
                  onToggleStatus={() => onToggleStatus(task.id)}
                  onChangeStatus={(s) => handleStatusChange(task, s)}
                />
              ))}

              {inProgressTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No tasks currently in progress
                </div>
              )}
            </div>
          </div>

          {/* COLUMN: COMPLETED */}
          <div className="bg-[#18181c] rounded-xl border border-white/5 p-4 flex flex-col min-h-[450px]">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Completed</h3>
                <span className="text-[10px] px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold">
                  {completedTasks.length}
                </span>
              </div>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  now={now}
                  onEdit={() => handleEdit(task)}
                  onDelete={() => handleRequestDelete(task)}
                  onToggleStatus={() => onToggleStatus(task.id)}
                  onChangeStatus={(s) => handleStatusChange(task, s)}
                />
              ))}

              {completedTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No completed tasks yet
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-[#1c1c20] rounded-xl border border-white/5 overflow-hidden shadow-lg">
          <div className="divide-y divide-white/5">
            {filteredTasks.map((task) => {
              const deadlineDate = new Date(task.deadline);
              const isOverdue = deadlineDate.getTime() < now && task.status !== 'completed';
              const isDueToday =
                deadlineDate.toDateString() === new Date().toDateString() &&
                task.status !== 'completed';

              return (
                <div
                  key={task.id}
                  className="p-4 hover:bg-[#222228] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className="text-gray-400 hover:text-emerald-400 transition-colors"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-xs font-bold ${
                          task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'
                        }`}
                      >
                        {task.title}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate max-w-xl mt-0.5">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {task.category}
                    </span>

                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-500/15 text-red-300'
                          : task.priority === 'medium'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {task.priority}
                    </span>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isOverdue
                          ? 'bg-red-500/20 text-red-300'
                          : isDueToday
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {isOverdue ? 'Overdue' : isDueToday ? 'Today' : deadlineDate.toLocaleDateString()}
                    </span>

                    <button
                      onClick={() => handleEdit(task)}
                      className="p-1 text-gray-400 hover:text-white rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => handleRequestDelete(task)}
                      className="p-1 text-gray-400 hover:text-red-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredTasks.length === 0 && (
              <div className="p-8 text-center text-gray-500 text-xs">
                No tasks match your search or filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Task Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#18181b] border border-gray-800 rounded-2xl shadow-2xl p-6 text-gray-100">
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                {editingTask ? 'Edit Task' : 'Create New Task'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 py-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Finish Operating Systems Lab 3"
                  className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Description / Action Items
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, subtasks, lab instructions..."
                  className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Subject / Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as TaskStatus)}
                    className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Deadline Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Delete Confirmation Pop-up */}
      <DeleteModal
        isOpen={!!taskToDelete}
        itemName={taskToDelete?.title || ''}
        itemType="task"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

// Reusable Task Card for Kanban
interface TaskCardProps {
  task: Task;
  now: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onChangeStatus: (status: TaskStatus) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  now,
  onEdit,
  onDelete,
  onToggleStatus,
  onChangeStatus,
}) => {
  const deadlineDate = new Date(task.deadline);
  const isOverdue = deadlineDate.getTime() < now && task.status !== 'completed';
  const isDueToday =
    deadlineDate.toDateString() === new Date().toDateString() &&
    task.status !== 'completed';

  const priorityColor =
    task.priority === 'high'
      ? 'bg-red-500/10 text-red-400 border-red-500/20'
      : task.priority === 'medium'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  return (
    <div className="p-3.5 rounded-lg bg-[#222228] border border-white/5 hover:border-gray-700 hover:bg-[#272730] transition-all flex flex-col justify-between group shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 truncate max-w-[130px]">
            {task.category}
          </span>
          <span className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded border ${priorityColor}`}>
            {task.priority}
          </span>
        </div>

        <h4
          className={`text-xs font-bold ${
            task.status === 'completed' ? 'line-through text-gray-500' : 'text-white'
          }`}
        >
          {task.title}
        </h4>

        {task.description && (
          <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px]">
        {/* Deadline Alert */}
        <span
          className={`flex items-center gap-1 font-semibold px-1.5 py-0.5 rounded ${
            isOverdue
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : isDueToday
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-gray-400'
          }`}
        >
          {isOverdue && <AlertTriangle className="w-3 h-3 text-red-400" />}
          {isDueToday && <Clock className="w-3 h-3 text-amber-400" />}
          <span>{deadlineDate.toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
        </span>

        {/* Quick actions */}
        <div className="flex items-center gap-1">
          {/* Quick status selector */}
          <select
            value={task.status}
            onChange={(e) => onChangeStatus(e.target.value as TaskStatus)}
            className="text-[10px] bg-[#141414] text-gray-300 border border-gray-700 rounded px-1 py-0.5 focus:outline-none"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Done</option>
          </select>

          <button
            onClick={onEdit}
            title="Edit Task"
            className="p-1 text-gray-400 hover:text-white rounded"
          >
            <Edit3 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Task"
            className="p-1 text-gray-400 hover:text-red-400 rounded"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
