'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Sparkles, X, Send, ChevronDown } from 'lucide-react'

const MOCK_RESPONSES = [
  "Based on the Okafor v. Meridian matter, I found 3 documents that may be relevant to your query. The most recent filing was on March 14, 2026. Would you like me to draft a summary?",
  "The statute of limitations for this matter type in Georgia is 2 years from the date of injury. Based on the intake date, you have approximately 14 months remaining.",
  "I've reviewed the Henderson Trust documents. I identified 2 potentially privileged communications that should be logged. Generating privilege log entry now...",
  "This query has been logged to the matter audit trail with timestamp 2026-04-15 14:32:07 UTC under attorney Sarah Morrison.",
]

interface Message {
  role: 'ai' | 'user'
  text: string
  time: string
}

function nowStr() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'ai',
    text: "Hello, I'm your AI legal assistant. Ask me anything about your matters, deadlines, documents, or legal research. All queries are ZDR-protected and logged to your audit trail.",
    time: nowStr(),
  },
]

export function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [responseIdx, setResponseIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, typing])

  function send() {
    const text = input.trim()
    if (!text || typing) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text, time: nowStr() }])
    setTyping(true)
    setTimeout(() => {
      const reply = MOCK_RESPONSES[responseIdx % MOCK_RESPONSES.length]
      setResponseIdx(i => i + 1)
      setTyping(false)
      setMessages(m => [...m, { role: 'ai', text: reply, time: nowStr() }])
    }, 1500)
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      {/* Floating button */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50 }}>
        {/* Tooltip */}
        {showTooltip && !open && (
          <div style={{
            position: 'absolute', bottom: 'calc(100% + 10px)', right: 0,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-mid)',
            borderRadius: 8, padding: '6px 12px',
            fontSize: 12, color: 'var(--text-1)',
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            pointerEvents: 'none',
          }}>
            Ask AI anything
          </div>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            width: 52, height: 52,
            borderRadius: '50%',
            background: 'var(--gold)',
            color: 'var(--bg-base)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(201,168,76,0.4)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseDown={e => (e.currentTarget.style.transform = 'scale(0.95)')}
          onMouseUp={e => (e.currentTarget.style.transform = 'scale(1.08)')}
          aria-label="AI Assistant"
        >
          <Sparkles style={{ width: 22, height: 22 }} />
        </button>
      </div>

      {/* Slide-up panel */}
      {open && (
        <div
          style={{
            position: 'fixed', bottom: 0, right: 24,
            width: 400, height: 500,
            background: 'var(--bg-card)',
            border: '1px solid var(--border-mid)',
            borderRadius: '16px 16px 0 0',
            boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
            zIndex: 49,
            display: 'flex', flexDirection: 'column',
            animation: 'slide-up-panel 0.25s ease-out',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles style={{ width: 16, height: 16, color: 'var(--gold)' }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)' }}>
                Privilege Vault AI Assistant
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* ZDR badge */}
              <span style={{
                fontSize: 10, fontWeight: 700, color: 'var(--success)',
                background: 'rgba(46,173,110,0.1)',
                border: '1px solid rgba(46,173,110,0.3)',
                borderRadius: 20, padding: '2px 8px',
                letterSpacing: '0.05em',
              }}>ZDR Protected</span>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'var(--text-3)', padding: 4, borderRadius: 4,
                  display: 'flex', alignItems: 'center',
                  transition: 'color 0.15s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1, overflowY: 'auto',
              padding: '16px',
              display: 'flex', flexDirection: 'column', gap: 12,
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{ maxWidth: '85%' }}>
                  <div style={{
                    padding: '10px 13px',
                    borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                    background: msg.role === 'user' ? 'var(--gold-dim)' : 'var(--bg-elevated)',
                    border: msg.role === 'user' ? '1px solid var(--gold-border)' : '1px solid var(--border)',
                    fontSize: 13,
                    color: 'var(--text-1)',
                    lineHeight: 1.5,
                  }}>
                    {msg.role === 'ai' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                        <Sparkles style={{ width: 11, height: 11, color: 'var(--gold)', flexShrink: 0 }} />
                        <span style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 600 }}>AI ASSISTANT</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-3)', marginTop: 3, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div style={{ display: 'flex', gap: 4, padding: '10px 13px', background: 'var(--bg-elevated)', borderRadius: '12px 12px 12px 2px', width: 'fit-content', border: '1px solid var(--border)' }}>
                {[0, 150, 300].map(delay => (
                  <div key={delay} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--text-3)',
                    animation: `pulse-dot 1.2s ${delay}ms infinite`,
                  }} />
                ))}
              </div>
            )}
          </div>

          {/* Matter context + input */}
          <div style={{ borderTop: '1px solid var(--border)', padding: '12px 16px', flexShrink: 0 }}>
            <select
              style={{
                width: '100%', height: 28,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 6, color: 'var(--text-3)',
                fontSize: 11, padding: '0 8px',
                marginBottom: 8,
              }}
            >
              <option value="">Link to matter (optional)</option>
              <option>Okafor v. Meridian Health Systems</option>
              <option>Chen Family Trust Restructuring</option>
              <option>TechVentures IP Portfolio Defense</option>
              <option>State v. Williams — Drug Charges</option>
            </select>

            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about your matters, deadlines, documents…"
                rows={2}
                style={{
                  flex: 1, resize: 'none',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-mid)',
                  borderRadius: 8, color: 'var(--text-1)',
                  fontSize: 13, padding: '8px 12px',
                  lineHeight: 1.5, outline: 'none',
                  transition: 'border-color 0.15s ease',
                  fontFamily: 'Inter, sans-serif',
                }}
                onFocus={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                onBlur={e => (e.currentTarget.style.borderColor = 'var(--border-mid)')}
              />
              <button
                onClick={send}
                disabled={!input.trim() || typing}
                style={{
                  width: 36, height: 36,
                  borderRadius: 8,
                  background: input.trim() && !typing ? 'var(--gold)' : 'var(--bg-elevated)',
                  color: input.trim() && !typing ? 'var(--bg-base)' : 'var(--text-3)',
                  border: 'none', cursor: input.trim() && !typing ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                <Send style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
