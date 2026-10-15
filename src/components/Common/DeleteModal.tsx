'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  itemName: string;
  itemType?: string; // 'note' | 'task' | 'document' | 'quiz' | 'flashcard'
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  title = 'Confirm Deletion',
  itemName,
  itemType = 'item',
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#1e1e24] border border-red-500/30 rounded-xl shadow-2xl p-6 text-gray-100 overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500" />

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="text-xs text-gray-400">Please review before continuing</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 p-3.5 bg-black/40 rounded-lg border border-white/5">
          <p className="text-sm text-gray-300">
            Are you sure you want to delete this {itemType}?
          </p>
          <p className="mt-1.5 text-sm font-semibold text-red-300 truncate">
            &ldquo;{itemName}&rdquo;
          </p>
          <p className="mt-2 text-xs text-gray-400">
            This action is permanent and cannot be undone. All associated progress will be removed.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-600"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-lg shadow-lg shadow-red-900/30 transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
