import { AIProvider, AIMessage, GenerateTextOptions, GenerateTextResult, EmbedTextOptions, EmbedTextResult, AIError } from './base'

export class OllamaProvider implements AIProvider {
  readonly id = 'ollama'
  readonly name = 'Ollama (Local)'
  readonly type = 'ollama' as const

  private baseUrl: string
  private model: string
  private embedModel: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
    this.model = process.env.OLLAMA_MODEL || 'llama3.1:8b'
    this.embedModel = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text'
  }

  async isAvailable(): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, { signal: AbortSignal.timeout(3000) })
      return res.ok
    } catch {
      return false
    }
  }

  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const startMs = Date.now()

    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: options.messages,
        stream: false,
        options: {
          temperature: options.temperature ?? 0.3,
          num_predict: options.maxTokens ?? 2048,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new AIError(`Ollama error: ${err}`, this.id, res.status)
    }

    const data = await res.json()

    return {
      content: data.message?.content || '',
      model: data.model || this.model,
      promptTokens: data.prompt_eval_count || 0,
      completionTokens: data.eval_count || 0,
      totalTokens: (data.prompt_eval_count || 0) + (data.eval_count || 0),
      latencyMs: Date.now() - startMs,
    }
  }

  async *generateStream(options: GenerateTextOptions): AsyncGenerator<string> {
    const res = await fetch(`${this.baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        messages: options.messages,
        stream: true,
        options: {
          temperature: options.temperature ?? 0.3,
          num_predict: options.maxTokens ?? 2048,
        },
      }),
    })

    if (!res.ok || !res.body) {
      throw new AIError(`Ollama stream error`, this.id, res.status)
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(Boolean)
      for (const line of lines) {
        try {
          const data = JSON.parse(line)
          if (data.message?.content) {
            yield data.message.content
          }
        } catch {}
      }
    }
  }

  async embedText(options: EmbedTextOptions): Promise<EmbedTextResult> {
    const texts = Array.isArray(options.text) ? options.text : [options.text]
    const embeddings: number[][] = []

    for (const text of texts) {
      const res = await fetch(`${this.baseUrl}/api/embeddings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: this.embedModel, prompt: text }),
      })

      if (!res.ok) throw new AIError('Ollama embed error', this.id, res.status)
      const data = await res.json()
      embeddings.push(data.embedding)
    }

    return {
      embeddings,
      model: this.embedModel,
      tokens: 0,
    }
  }

  async summarizeDocument(text: string, maxLength = 500): Promise<string> {
    const result = await this.generateText({
      messages: [
        {
          role: 'system',
          content: `You are a legal document analyst. Summarize the following document concisely in ${maxLength} words or less. Focus on legally significant facts, parties, dates, and obligations. Label your output as a draft summary.`,
        },
        { role: 'user', content: text.slice(0, 8000) },
      ],
      temperature: 0.2,
    })
    return result.content
  }
}
