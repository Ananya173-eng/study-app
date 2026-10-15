'use client';

import React, { useState } from 'react';
import { Note, Priority, ViewType } from '@/types';
import { DeleteModal } from '@/components/Common/DeleteModal';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Sparkles,
  Tag,
  Clock,
  Layers,
  HelpCircle,
  X,
  Check,
  BookOpen,
} from 'lucide-react';

interface NotesViewProps {
  notes: Note[];
  onSaveNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
  onSelectView: (view: ViewType) => void;
  onSetAIContent?: (title: string, content: string) => void;
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  onSaveNote,
  onDeleteNote,
  onSelectView,
  onSetAIContent,
  onNotify,
}) => {
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Editor Modal State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('Computer Science');
  const [editPriority, setEditPriority] = useState<Priority>('medium');
  const [editTags, setEditTags] = useState('');
  const [editContent, setEditContent] = useState('');

  // Delete Confirmation Modal State
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);

  // Extract all categories and tags
  const categories = Array.from(new Set(notes.map((n) => n.category))).filter(Boolean);
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).filter(Boolean);

  // Filtering Logic
  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || note.priority === selectedPriority;
    const matchesTag = selectedTag === 'all' || note.tags.includes(selectedTag);

    return matchesSearch && matchesCategory && matchesPriority && matchesTag;
  });

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedPriority !== 'all' ? 1 : 0) +
    (selectedTag !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setSelectedTag('all');
  };

  // Open Editor for New Note
  const handleCreateNew = () => {
    setEditingNote(null);
    setEditTitle('');
    setEditCategory('Computer Science');
    setEditPriority('medium');
    setEditTags('');
    setEditContent('');
    setIsEditorOpen(true);
  };

  // Open Editor for Existing Note
  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditCategory(note.category);
    setEditPriority(note.priority);
    setEditTags(note.tags.join(', '));
    setEditContent(note.content);
    setIsEditorOpen(true);
  };

  // Save Note Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      onNotify('warning', 'Missing Title', 'Please enter a title for your note.');
      return;
    }

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const now = new Date().toISOString();
    const updatedNote: Note = {
      id: editingNote ? editingNote.id : `note_${Date.now()}`,
      userId: editingNote ? editingNote.userId : 'user_default',
      title: editTitle.trim(),
      category: editCategory.trim() || 'General',
      priority: editPriority,
      tags: tagsArray.length > 0 ? tagsArray : ['Study'],
      content: editContent,
      createdAt: editingNote ? editingNote.createdAt : now,
      updatedAt: now,
    };

    onSaveNote(updatedNote);
    setIsEditorOpen(false);
    onNotify('success', editingNote ? 'Note Updated' : 'Note Created', `"${updatedNote.title}" saved successfully.`);
  };

  // Delete Handlers
  const handleRequestDelete = (note: Note, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToDelete(note);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      const deletedTitle = noteToDelete.title;
      onDeleteNote(noteToDelete.id);
      setNoteToDelete(null);
      onNotify('success', 'Note Deleted', `"${deletedTitle}" was deleted successfully.`);
    }
  };

  const handleCancelDelete = () => {
    setNoteToDelete(null);
  };

  // AI shortcuts for a note
  const handleLaunchAI = (note: Note, targetView: ViewType, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSetAIContent) {
      onSetAIContent(note.title, note.content);
    }
    onSelectView(targetView);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Study Notes</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              {notes.length} notes
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Organize lecture notes, synthesize concepts, and trigger instant AI summaries & quizzes.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all w-fit"
        >
          <Plus className="w-4 h-4" />
          Create New Note
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-[#1c1c20] rounded-xl border border-white/5 p-3.5 space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by keyword, title, or content..."
              className="w-full pl-9 pr-3 py-2 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-2 border transition-colors ${
              isFilterPanelOpen || activeFilterCount > 0
                ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
                : 'bg-[#121214] border-gray-700 text-gray-300 hover:bg-[#202024]'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
            {activeFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Filter Dropdowns Expandable Panel */}
        {isFilterPanelOpen && (
          <div className="pt-3 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                Category / Subject
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Categories ({categories.length})</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                Priority
              </label>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-gray-400 uppercase mb-1">
                Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#121214] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Tags ({allTags.length})</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const priorityColor =
            note.priority === 'high'
              ? 'bg-red-500/10 text-red-400 border-red-500/20'
              : note.priority === 'medium'
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-blue-500/10 text-blue-400 border-blue-500/20';

          return (
            <div
              key={note.id}
              onClick={() => handleEditNote(note)}
              className="p-5 rounded-xl bg-[#1c1c20] border border-white/5 hover:border-blue-500/40 hover:bg-[#202026] cursor-pointer transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                {/* Meta row */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25 truncate max-w-[150px]">
                    {note.category}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full border uppercase ${priorityColor}`}
                  >
                    {note.priority}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {note.title}
                </h3>

                {/* Preview */}
                <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                  {note.content.replace(/[#*`$]/g, '')}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] text-gray-400 bg-black/40 px-2 py-0.5 rounded border border-white/5 flex items-center gap-1"
                    >
                      <Tag className="w-2.5 h-2.5 text-gray-500" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                <span className="text-[10px] flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  {new Date(note.updatedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  {/* AI Summarize */}
                  <button
                    onClick={(e) => handleLaunchAI(note, 'ai-summarizer', e)}
                    title="Summarize Note with AI"
                    className="p-1.5 rounded hover:bg-amber-500/20 text-gray-400 hover:text-amber-300 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  {/* AI Quiz */}
                  <button
                    onClick={(e) => handleLaunchAI(note, 'ai-quiz', e)}
                    title="Generate Quiz from Note"
                    className="p-1.5 rounded hover:bg-emerald-500/20 text-gray-400 hover:text-emerald-300 transition-colors"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>

                  {/* AI Flashcards */}
                  <button
                    onClick={(e) => handleLaunchAI(note, 'ai-flashcards', e)}
                    title="Generate Flashcards from Note"
                    className="p-1.5 rounded hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditNote(note);
                    }}
                    title="Edit Note"
                    className="p-1.5 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  {/* Delete with Confirmation Modal */}
                  <button
                    onClick={(e) => handleRequestDelete(note, e)}
                    title="Delete Note"
                    className="p-1.5 rounded hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredNotes.length === 0 && (
        <div className="p-12 text-center bg-[#1c1c20] rounded-xl border border-white/5 space-y-3">
          <BookOpen className="w-8 h-8 text-gray-500 mx-auto" />
          <h3 className="text-sm font-semibold text-white">No notes matched your query</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Try resetting your search query or filters, or create a brand new note right away.
          </p>
          <button
            onClick={resetFilters}
            className="px-3.5 py-1.5 bg-gray-800 hover:bg-gray-700 text-xs text-white rounded-lg transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Note Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#18181b] border border-gray-800 rounded-2xl shadow-2xl p-6 text-gray-100 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-white/5">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-400" />
                {editingNote ? 'Edit Study Note' : 'Create New Study Note'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 py-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Operating Systems: Synchronization & Mutexes"
                  className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Subject / Category
                  </label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Computer Science, Biology, etc."
                    className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as Priority)}
                    className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    placeholder="OS, Concurrency, Exam"
                    className="w-full px-3 py-2 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Note Content (Markdown supported)
                </label>
                <textarea
                  rows={12}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Type your notes here... You can use headings (#), bullet points (-), code blocks (```), and formulas ($$)."
                  className="w-full px-3 py-2.5 bg-[#202024] border border-gray-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-blue-500 leading-relaxed custom-scrollbar"
                />
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
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/30 flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mandatory Delete Confirmation Pop-up */}
      <DeleteModal
        isOpen={!!noteToDelete}
        itemName={noteToDelete?.title || ''}
        itemType="study note"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};
