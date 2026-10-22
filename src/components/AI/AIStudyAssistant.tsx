'use client';

import React, { useState, useRef, useEffect } from 'react';
import { StudyMaterial, Note, ChatMessage, ChatSource } from '@/types';
import { AIEngine } from '@/lib/ai-engine';
import {
  Sparkles,
  Send,
  BookOpen,
  FileSpreadsheet,
  FileText,
  User,
  Bot,
  Copy,
  Check,
  RotateCcw,
  ExternalLink,
  Loader2,
  Compass,
} from 'lucide-react';

interface AIStudyAssistantProps {
  materials: StudyMaterial[];
  notes: Note[];
  onNotify: (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => void;
}

export const AIStudyAssistant: React.FC<AIStudyAssistantProps> = ({
  materials,
  notes,
  onNotify,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome_msg',
      role: 'assistant',
      content: `Hello! I am your **AI Academic Study Assistant**. I have indexed all of your uploaded PDFs and study notes using Retrieval-Augmented Generation (RAG).\n\nAsk me anything about your coursework—such as explaining complex concepts, comparing algorithms, or quizzing you on key definitions. What would you like to explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | string>('all');
  const [isThinking, setIsThinking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // Suggested prompts for quick exploration
  const suggestedPrompts = [
    'Explain the CAP theorem and why physical networks force a choice between C and A.',
    'Compare Dijkstra and Bellman-Ford in terms of negative weights and time complexity.',
    'What is the net ATP yield of cellular respiration and where does it occur?',
    'How does Singular Value Decomposition (SVD) relate to eigenvalues and eigenvectors?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isThinking) return;

    const userMsg: ChatMessage = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    try {
      // Build context sources
      let contextSources: { title: string; content: string; type: 'pdf' | 'note' }[] = [];

      if (selectedFilter === 'all') {
        contextSources = [
          ...materials.map((m) => ({ title: m.name, content: m.fullText, type: 'pdf' as const })),
          ...notes.map((n) => ({ title: n.title, content: n.content, type: 'note' as const })),
        ];
      } else {
        const mat = materials.find((m) => m.id === selectedFilter);
        if (mat) {
          contextSources = [{ title: mat.name, content: mat.fullText, type: 'pdf' as const }];
        } else {
          const note = notes.find((n) => n.id === selectedFilter);
          if (note) {
            contextSources = [{ title: note.title, content: note.content, type: 'note' as const }];
          }
        }
      }

      const history = messages.slice(-4).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await AIEngine.queryAssistant({
        query: textToSend,
        history,
        contextSources,
      });

      const assistantMsg: ChatMessage = {
        id: `msg_assistant_${Date.now()}`,
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      onNotify('error', 'Assistant Error', 'Could not retrieve answer. Please try again.');
    } finally {
      setIsThinking(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    onNotify('info', 'Copied', 'Response copied to clipboard.');
  };

  const handleClearHistory = () => {
    setMessages([messages[0]]);
    onNotify('info', 'Chat Cleared', 'Conversation history reset.');
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Study Assistant (RAG)</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Ask questions answered strictly with citations from your uploaded PDFs and notes.
              </p>
            </div>
          </div>
        </div>

        {/* Source Scope Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-400 font-medium">Knowledge Scope:</label>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Entire Library ({materials.length + notes.length} sources)</option>
            <optgroup label="Uploaded PDFs">
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  📄 {m.name}
                </option>
              ))}
            </optgroup>
            <optgroup label="Study Notes">
              {notes.map((n) => (
                <option key={n.id} value={n.id}>
                  📝 {n.title}
                </option>
              ))}
            </optgroup>
          </select>

          <button
            onClick={handleClearHistory}
            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Clear Chat History"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-800 flex flex-col h-[650px] shadow-2xl overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                      : 'bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white border border-fuchsia-400/40 shadow-lg shadow-purple-900/40'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`rounded-2xl p-4 text-xs leading-relaxed space-y-2.5 ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none shadow-md'
                      : 'bg-slate-950/70 border border-slate-800 text-gray-200 rounded-tl-none shadow-md'
                  }`}
                >
                  <div className="prose prose-invert max-w-none text-xs whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Grounded RAG Citations */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-300 block">
                        📚 Grounded Knowledge Citations:
                      </span>
                      <div className="space-y-1.5">
                        {msg.sources.map((s, idx) => (
                          <div
                            key={idx}
                            className="p-2 rounded bg-black/40 border border-white/5 text-[11px] text-gray-300"
                          >
                            <div className="font-semibold text-purple-300 flex items-center gap-1">
                              {s.type === 'pdf' ? (
                                <FileSpreadsheet className="w-3 h-3 text-red-400" />
                              ) : (
                                <FileText className="w-3 h-3 text-blue-400" />
                              )}
                              <span>{s.title}</span>
                            </div>
                            <p className="italic text-gray-400 mt-1 line-clamp-2">
                              &ldquo;{s.snippet}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-gray-400 pt-1">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-white flex items-center gap-1 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-3 max-w-2xl mr-auto animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl rounded-tl-none bg-slate-950/70 border border-slate-800 text-xs text-indigo-300 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching knowledge library and generating grounded synthesis...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] uppercase font-bold text-gray-400 shrink-0">
              Suggested:
            </span>
            {suggestedPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-gray-300 hover:text-white border border-slate-800 shrink-0 transition-colors truncate max-w-xs"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything about your uploaded PDFs, notes, or coursework..."
              className="flex-1 px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isThinking || !inputQuery.trim()}
              className="p-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400 disabled:opacity-50 text-white rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 active:scale-[0.98] transition-all shrink-0"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 px-1">
            <span>Grounding on: {selectedFilter === 'all' ? 'All indexed documents & notes' : 'Selected document'}</span>
            <span>RAG Contextual Retrieval Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
