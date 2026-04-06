'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface CompanionContext {
  page: string
  lesson?: string
  domain?: string
  question?: string
}

const QUICK_ACTIONS = [
  { label: '📐 Formula lookup', prompt: 'Show me the most important PMP formulas I need to know for the exam.' },
  { label: '📋 Artifact check', prompt: 'What are the most important PMP artifacts and when are they used?' },
  { label: '💡 Rita technique', prompt: 'What are Rita Mulcahy\'s top exam-taking techniques?' },
  { label: '🔑 Key terms', prompt: 'Define the most commonly confused PMP terms on the exam.' },
]

export default function CompanionChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasGreeted, setHasGreeted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Detect current page context
  const getContext = useCallback((): CompanionContext => {
    if (typeof window === 'undefined') return { page: 'dashboard' }
    const path = window.location.pathname
    const ctx: CompanionContext = { page: path }

    if (path.includes('/course/')) {
      const parts = path.split('/')
      ctx.domain = parts[3] || undefined
      ctx.lesson = parts[4] || undefined
    } else if (path.includes('/practice')) {
      ctx.page = 'practice'
    } else if (path.includes('/tutor')) {
      ctx.page = 'AiTuTorZ'
    } else if (path.includes('/progress')) {
      ctx.page = 'progress dashboard'
    } else if (path.includes('/mindmap')) {
      ctx.page = 'mind map'
    } else if (path.includes('/exam')) {
      ctx.page = 'mock exam'
    }

    return ctx
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Greet on first open
  useEffect(() => {
    if (isOpen && !hasGreeted && messages.length === 0) {
      const ctx = getContext()
      let greeting = '👋 Hey! I\'m your PMP Companion — here to help with quick answers, formulas, artifacts, and exam tips.'

      if (ctx.page.includes('/course/') && ctx.lesson) {
        greeting += `\n\n📖 I see you\'re studying a lesson. Need help with any concept?`
      } else if (ctx.page === 'practice') {
        greeting += `\n\n✏️ You\'re in practice mode! Ask me about any concept you\'re unsure about.`
      } else if (ctx.page === 'progress dashboard') {
        greeting += `\n\n📊 Reviewing your progress? I can explain what to focus on next.`
      }

      greeting += '\n\nTry the quick actions below or ask me anything!'

      setMessages([{ role: 'assistant', content: greeting }])
      setHasGreeted(true)
    }
  }, [isOpen, hasGreeted, messages.length, getContext])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          context: getContext(),
          history: newMessages.slice(-8),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Sorry, I couldn\'t process that. Please try again.',
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const escalateToTutor = (question: string) => {
    window.open('/dashboard/tutor?q=' + encodeURIComponent(question), '_blank')
  }

  // Check if last assistant message suggests escalation
  const lastAssistantMsg = messages.filter(m => m.role === 'assistant').slice(-1)[0]
  const showEscalate = lastAssistantMsg?.content?.includes('AiTuTorZ') || false

  return (
    <>
      {/* Floating Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50 flex items-center justify-center group"
          title="PMP Companion"
        >
          <span className="text-2xl group-hover:scale-110 transition-transform">💬</span>
          {/* Pulse indicator */}
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-pulse" />
        </button>
      )}

      {/* Side Panel */}
      {isOpen && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <p className="text-white font-bold text-sm">PMP Companion</p>
                  <p className="text-violet-200 text-[10px]">Quick help · Formulas · Artifacts · Tips</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setMessages([]); setHasGreeted(false) }}
                  className="text-white/50 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-white/10 transition-all"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/70 hover:text-white text-lg leading-none ml-1"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-violet-600 text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} className={j > 0 ? 'mt-1.5' : ''}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Escalate button */}
          {showEscalate && messages.length > 1 && (
            <div className="px-4 pb-2">
              <button
                onClick={() => escalateToTutor(messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '')}
                className="w-full text-xs bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 py-2 rounded-xl font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                🚀 Open in AiTuTorZ for detailed answer
              </button>
            </div>
          )}

          {/* Quick Actions — show when no messages or just greeting */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(action.prompt)}
                    className="text-xs text-left bg-gray-50 hover:bg-violet-50 border border-gray-200 hover:border-violet-300 rounded-xl px-3 py-2.5 text-gray-700 hover:text-violet-700 transition-all font-medium"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about PMP..."
                className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-200 transition-all"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-violet-600 hover:bg-violet-700 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 flex-shrink-0"
              >
                ↑
              </button>
            </div>
            <p className="text-[9px] text-gray-400 text-center mt-1.5">
              Quick answers · For detailed help, use <a href="/dashboard/tutor" className="text-violet-500 hover:underline">AiTuTorZ</a>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
