'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import ReactMarkdown from 'react-markdown';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Suggested Prompts ────────────────────────────────────────────────────────

const SUGGESTED_PMBOK7 = [
  'Explain the 12 PMBOK 7 principles with exam tips',
  'What is the difference between a project and a program?',
  'How do I approach agile vs predictive questions on the exam?',
  'Explain servant leadership and when it appears on the exam',
  'What are the 8 performance domains and what should I know for each?',
  'How does Rita Mulcahy suggest approaching difficult PMP questions?',
  'Explain the difference between risk appetite, tolerance, and threshold',
  'What is EVM and how do I calculate CPI and SPI?',
];

const SUGGESTED_PMBOK8 = [
  'What are the key changes in PMBOK 8 vs PMBOK 7?',
  'How does ECO 2026 differ from ECO 2021?',
  'What new agile content is in PMBOK 8?',
  'How is digital project management addressed in PMBOK 8?',
  'Explain sustainability requirements in the new exam',
  'What percentage of questions are agile in the 2026 exam?',
  'How has value delivery changed in PMBOK 8?',
  'What are the updated stakeholder engagement requirements?',
];

// ─── Source Badge ─────────────────────────────────────────────────────────────

function SourceBadge({ framework }: { framework: 'pmbok7' | 'pmbok8' }) {
  const sources =
    framework === 'pmbok7'
      ? ['PMBOK 7', 'ECO 2021', 'Rita Mulcahy']
      : ['PMBOK 8', 'ECO 2026', 'Rita Mulcahy'];

  const colors = ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700'];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-xs text-gray-400">Sources:</span>
      {sources.map((src, i) => (
        <span key={src} className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors[i]}`}>
          {src}
        </span>
      ))}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  message,
  framework,
  isStreaming,
}: {
  message: Message;
  framework: 'pmbok7' | 'pmbok8';
  isStreaming?: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
          isUser ? 'bg-blue-600 text-white' : 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
        }`}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Bubble */}
      <div className={`max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-strong:text-gray-900 prose-ul:my-1 prose-li:my-0.5">
              <ReactMarkdown>{message.content}</ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 bg-violet-500 rounded-sm animate-pulse ml-0.5 align-middle" />
              )}
            </div>
          )}
        </div>

        {/* Source badges for AI messages */}
        {!isUser && !isStreaming && (
          <div className="px-1">
            <SourceBadge framework={framework} />
          </div>
        )}

        <span className="text-xs text-gray-400 px-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TutorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [framework, setFramework] = useState<'pmbok7' | 'pmbok8'>('pmbok7');
  const [streamingContent, setStreamingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Load user's framework from Supabase
  useEffect(() => {
    const loadFramework = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('active_framework')
        .eq('id', user.id)
        .single();
      if (profile?.active_framework?.includes('pmbok8')) {
        setFramework('pmbok8');
      }
    };
    loadFramework();
  }, []);
  // Auto-send question from URL parameter (from Guru panel link)
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const autoQuery = params.get('q');
  if (autoQuery && sendMessage) {
    setTimeout(() => sendMessage(autoQuery), 800);
  }
}, []);

  // Welcome message on mount
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `👋 **Welcome to your PMP AiTuTorZ!**

I'm grounded in **${framework === 'pmbok7' ? 'PMBOK 7 + ECO 2021 + Rita Mulcahy' : 'PMBOK 8 + ECO 2026 + Rita Mulcahy'}** and ready to help you pass the PMP exam.

I can help you:
- 📚 **Understand concepts** from all key exam sources
- ✅ **Practice questions** with detailed explanations
- 🎯 **Apply Rita's techniques** for tricky questions
- 💡 **Remember frameworks** with mnemonics and examples

What would you like to study today?`,
        timestamp: new Date(),
      },
    ]);
  }, [framework]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Cancel any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
          framework,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader');

      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              // Finalize message
              const assistantMessage: Message = {
                role: 'assistant',
                content: accumulatedText,
                timestamp: new Date(),
              };
              setMessages((prev) => [...prev, assistantMessage]);
              setStreamingContent('');
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                accumulatedText += parsed.text;
                setStreamingContent(accumulatedText);
              }
            } catch {
              // ignore parse errors
            }
          }
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return;
      console.error('Tutor error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ I encountered an error. Please check your API key in `.env.local` and try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearChat = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setMessages([]);
    setStreamingContent('');
    setIsLoading(false);
    // Re-trigger welcome message
    setTimeout(() => {
      setMessages([
        {
          role: 'assistant',
          content: `👋 **Chat cleared! Ready for a fresh start.**\n\nWhat would you like to study?`,
          timestamp: new Date(),
        },
      ]);
    }, 100);
  };

  const suggestions = framework === 'pmbok7' ? SUGGESTED_PMBOK7 : SUGGESTED_PMBOK8;
  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            AI
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm">PMP AiTuTorZ</h1>
            <p className="text-xs text-gray-500">
              Grounded in {framework === 'pmbok7' ? 'PMBOK 7 · ECO 2021' : 'PMBOK 8 · ECO 2026'} · Rita Mulcahy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Framework switcher */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 text-xs font-medium">
            <button
              onClick={() => setFramework('pmbok7')}
              className={`px-3 py-1 rounded-md transition-all ${
                framework === 'pmbok7'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              PMBOK 7
            </button>
            <button
              onClick={() => setFramework('pmbok8')}
              className={`px-3 py-1 rounded-md transition-all ${
                framework === 'pmbok8'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              PMBOK 8
            </button>
          </div>

          {/* Clear chat */}
          <button
            onClick={clearChat}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Clear chat
          </button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} framework={framework} />
          ))}

          {/* Streaming message */}
          {streamingContent && (
            <MessageBubble
              message={{ role: 'assistant', content: streamingContent, timestamp: new Date() }}
              framework={framework}
              isStreaming
            />
          )}

          {/* Loading indicator */}
          {isLoading && !streamingContent && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                AI
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ── Suggested Questions ── */}
      {showSuggestions && (
        <div className="px-4 pb-3 flex-shrink-0">
          <div className="max-w-3xl mx-auto">
            <p className="text-xs text-gray-400 mb-2 font-medium">Suggested questions</p>
            <div className="flex gap-2 flex-wrap">
              {suggestions.slice(0, 4).map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => sendMessage(suggestion)}
                  className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Input ── */}
      <div className="bg-white border-t border-gray-200 px-4 py-4 flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about the PMP exam… (Enter to send, Shift+Enter for new line)"
                rows={1}
                className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none outline-none leading-relaxed"
                style={{ maxHeight: '120px' }}
                disabled={isLoading}
              />
            </div>

            <button
              onClick={() => sendMessage(input)}
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 rounded-xl bg-violet-600 text-white flex items-center justify-center hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m-7 7l7-7 7 7" />
              </svg>
            </button>
          </div>

          <p className="text-xs text-gray-400 text-center mt-2">
  AI responses are for exam preparation only. Always verify with official PMI materials.
</p>

{/* Contextual navigation — shown when opened from Guru panel */}
{typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('q') && messages.length > 1 && (
  <div className="mt-3 bg-violet-50 border border-violet-200 rounded-xl p-3 flex items-center justify-between gap-2 flex-wrap">
    <p className="text-xs text-violet-700 font-medium">✅ Lesson complete! Keep the momentum going.</p>
    <div className="flex gap-2">
      <button
        onClick={() => window.close()}
        className="text-xs bg-white border border-violet-200 text-violet-600 hover:bg-violet-50 px-3 py-1.5 rounded-lg transition-all font-medium">
        ← Back to Report
      </button>
      <a href="/dashboard/practice"
        className="text-xs bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-all font-medium">
        🎯 Practice This Topic
      </a>
    </div>
  </div>
)}
        </div>
      </div>
    </div>
  );
}