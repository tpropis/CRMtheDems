'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import {
  Bot, Send, AlertTriangle, BookOpen, FileText,
  Save, Download, RefreshCw, ChevronDown, Shield,
  Sparkles, Clock,
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  confidence?: number
  isLoading?: boolean
}

interface Source {
  title: string
  excerpt: string
  type: string
  relevance: number
}

const EXAMPLE_PROMPTS = [
  'Summarize the strongest arguments for dismissal based on the facts in this matter.',
  'What case law supports our position on the statute of limitations issue?',
  'Draft a memo analyzing the key legal risks in this matter.',
  'Identify any potential privilege issues in the uploaded documents.',
]

export default function MatterResearchPage({ params }: { params: { matterId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || isStreaming) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    }

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '',
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setInput('')
    setIsStreaming(true)

    try {
      const res = await fetch(`/api/ai/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matterId: params.matterId, query: userMsg.content, history: messages }),
      })

      if (!res.ok) throw new Error('AI request failed')

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''
      let sources: Source[] = []
      let confidence = 0.85

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6)
              if (data === '[DONE]') continue
              try {
                const parsed = JSON.parse(data)
                if (parsed.content) fullContent += parsed.content
                if (parsed.sources) sources = parsed.sources
                if (parsed.confidence) confidence = parsed.confidence
              } catch {}
            }
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id
                ? { ...m, content: fullContent, isLoading: false, sources, confidence }
                : m
            )
          )
        }
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? {
                ...m,
                content: 'AI service unavailable. Please verify your local model is running and try again.',
                isLoading: false,
                confidence: 0,
              }
            : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }

  return (
    <div className="flex h-full gap-4" style={{ height: 'calc(100vh - 14rem)' }}>
      {/* Chat area */}
      <div className="flex flex-1 flex-col rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-vault-border">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-vault-accent-light" />
            <span className="text-sm font-semibold text-vault-text">AI Research Assistant</span>
            <Badge variant="active">Local · Private</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-xs" disabled={messages.length === 0}>
              <Save className="h-3.5 w-3.5" />
              Save Thread
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" disabled={messages.length === 0}>
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full border border-vault-border bg-vault-elevated p-4">
                <Sparkles className="h-6 w-6 text-vault-accent-light" />
              </div>
              <h3 className="text-sm font-semibold text-vault-text mb-1">Matter Research Assistant</h3>
              <p className="text-sm text-vault-text-secondary mb-6 max-w-sm">
                Ask questions about this matter. The AI searches matter documents and your firm's knowledge base with full citation support.
              </p>
              <div className="space-y-2 w-full max-w-md">
                {EXAMPLE_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => setInput(p)}
                    className="w-full text-left px-4 py-2.5 rounded-md border border-vault-border bg-vault-elevated hover:border-vault-border-strong text-sm text-vault-text-secondary hover:text-vault-text transition-colors"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="shrink-0 h-7 w-7 rounded-full border border-vault-border bg-vault-elevated flex items-center justify-center mt-0.5">
                      <Bot className="h-3.5 w-3.5 text-vault-accent-light" />
                    </div>
                  )}
                  <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`rounded-md px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-vault-accent/20 text-vault-text border border-vault-accent/30'
                        : 'bg-vault-elevated border border-vault-border text-vault-text'
                    }`}>
                      {msg.isLoading ? (
                        <div className="flex items-center gap-2 text-vault-text-secondary">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          <span>Analyzing matter documents and knowledge base…</span>
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>

                    {/* AI response metadata */}
                    {msg.role === 'assistant' && !msg.isLoading && msg.content && (
                      <div className="mt-2 flex items-center gap-3">
                        {msg.confidence !== undefined && (
                          <div className="flex items-center gap-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${
                              msg.confidence > 0.8 ? 'bg-vault-success' :
                              msg.confidence > 0.6 ? 'bg-vault-warning' : 'bg-vault-danger'
                            }`} />
                            <span className="text-xs text-vault-muted">
                              {Math.round(msg.confidence * 100)}% confidence
                            </span>
                          </div>
                        )}
                        <Badge variant="default" className="text-2xs">
                          <Shield className="h-2.5 w-2.5 mr-1" />
                          Draft — verify before use
                        </Badge>
                        {msg.sources && msg.sources.length > 0 && (
                          <span className="text-xs text-vault-text-secondary">
                            {msg.sources.length} source{msg.sources.length !== 1 ? 's' : ''} used
                          </span>
                        )}
                      </div>
                    )}

                    {/* Sources */}
                    {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {msg.sources.map((src, i) => (
                          <div key={i} className="rounded border border-vault-border bg-vault-bg px-3 py-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-vault-text">{src.title}</span>
                              <Badge variant="default" className="text-2xs">{src.type}</Badge>
                            </div>
                            <p className="text-xs text-vault-text-secondary line-clamp-2">{src.excerpt}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-vault-border p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                placeholder="Ask a research question… (e.g., 'What are the strongest arguments for dismissal?')"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                className="min-h-[56px] max-h-40 resize-none pr-12"
                disabled={isStreaming}
              />
            </div>
            <Button onClick={sendMessage} disabled={!input.trim() || isStreaming} className="h-10 shrink-0">
              {isStreaming ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <AlertTriangle className="h-3 w-3 text-vault-warning shrink-0" />
            <p className="text-2xs text-vault-muted">
              AI output requires attorney review. All responses are labeled as draft work product.
              Privileged communications. Inference runs locally.
            </p>
          </div>
        </div>
      </div>

      {/* Sources panel */}
      <div className="w-72 shrink-0 rounded-md border border-vault-border bg-vault-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-vault-border">
          <BookOpen className="h-4 w-4 text-vault-muted" />
          <h3 className="text-sm font-semibold text-vault-text">Sources Panel</h3>
        </div>
        <div className="p-4 space-y-3">
          <div className="rounded-md border border-vault-border bg-vault-elevated p-3">
            <p className="text-xs font-semibold text-vault-text mb-2">Matter Documents</p>
            <p className="text-xs text-vault-text-secondary">
              AI searches all uploaded matter documents for relevant content and cites sources.
            </p>
          </div>
          <div className="rounded-md border border-vault-border bg-vault-elevated p-3">
            <p className="text-xs font-semibold text-vault-text mb-2">Knowledge Base</p>
            <p className="text-xs text-vault-text-secondary">
              Firm's private legal knowledge base, case law, and templates.
            </p>
          </div>
          <div className="rounded-md border border-vault-border/50 bg-vault-bg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Shield className="h-3 w-3 text-vault-success" />
              <p className="text-xs font-semibold text-vault-success">Privacy Guaranteed</p>
            </div>
            <p className="text-xs text-vault-muted">
              All inference runs on your local Ollama or vLLM instance. No data leaves the firm.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
