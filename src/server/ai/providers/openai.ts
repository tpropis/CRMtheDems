import { AIProvider, AIMessage, GenerateTextOptions, GenerateTextResult, EmbedTextOptions, EmbedTextResult, AIError } from './base'

// Azure OpenAI and OpenAI share similar API shapes
// This provider supports both via environment config

export class OpenAICompatProvider implements AIProvider {
  readonly id: string
  readonly name: string
  readonly type: 'openai' | 'azure_openai'

  private baseUrl: string
  private apiKey: string
  private model: string
  private embedModel: string
  private headers: Record<string, string>

  constructor(type: 'openai' | 'azure_openai' = 'openai') {
    this.type = type

    if (type === 'azure_openai') {
      this.id = 'azure_openai'
      this.name = 'Azure OpenAI (Private Cloud)'
      const endpoint = process.env.AZURE_OPENAI_ENDPOINT!
      const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o'
      const version = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview'
      this.baseUrl = `${endpoint}/openai/deployments/${deployment}`
      this.apiKey = process.env.AZURE_OPENAI_API_KEY!
      this.model = deployment
      this.embedModel = process.env.AZURE_OPENAI_EMBED_DEPLOYMENT || 'text-embedding-3-large'
      this.headers = {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
      }
    } else {
      this.id = 'openai'
      this.name = 'OpenAI (External — Review Data Policy)'
      this.baseUrl = 'https://api.openai.com/v1'
      this.apiKey = process.env.OPENAI_API_KEY!
      this.model = process.env.OPENAI_MODEL || 'gpt-4o'
      this.embedModel = process.env.OPENAI_EMBED_MODEL || 'text-embedding-3-large'
      this.headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      }
    }
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.apiKey && this.baseUrl)
  }

  async generateText(options: GenerateTextOptions): Promise<GenerateTextResult> {
    const startMs = Date.now()
    const url = this.type === 'azure_openai'
      ? `${this.baseUrl}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview'}`
      : `${this.baseUrl}/chat/completions`

    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: this.type === 'openai' ? this.model : undefined,
        messages: options.messages,
        max_tokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.3,
        stream: false,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new AIError(`OpenAI error: ${err}`, this.id, res.status)
    }

    const data = await res.json()
    return {
      content: data.choices[0]?.message?.content || '',
      model: data.model || this.model,
      promptTokens: data.usage?.prompt_tokens || 0,
      completionTokens: data.usage?.completion_tokens || 0,
      totalTokens: data.usage?.total_tokens || 0,
      latencyMs: Date.now() - startMs,
    }
  }

  async *generateStream(options: GenerateTextOptions): AsyncGenerator<string> {
    // SSE streaming for OpenAI-compatible APIs
    const url = this.type === 'azure_openai'
      ? `${this.baseUrl}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION}`
      : `${this.baseUrl}/chat/completions`

    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: this.type === 'openai' ? this.model : undefined,
        messages: options.messages,
        max_tokens: options.maxTokens ?? 2048,
        temperature: options.temperature ?? 0.3,
        stream: true,
      }),
    })

    if (!res.ok || !res.body) throw new AIError('OpenAI stream error', this.id)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        const data = line.slice(6)
        if (data === '[DONE]') return
        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices[0]?.delta?.content
          if (content) yield content
        } catch {}
      }
    }
  }

  async embedText(options: EmbedTextOptions): Promise<EmbedTextResult> {
    const input = Array.isArray(options.text) ? options.text : [options.text]
    const url = this.type === 'azure_openai'
      ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${this.embedModel}/embeddings?api-version=${process.env.AZURE_OPENAI_API_VERSION}`
      : `${this.baseUrl}/embeddings`

    const res = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({ model: this.type === 'openai' ? this.embedModel : undefined, input }),
    })

    if (!res.ok) throw new AIError('Embed error', this.id, res.status)
    const data = await res.json()

    return {
      embeddings: data.data.map((d: any) => d.embedding),
      model: data.model || this.embedModel,
      tokens: data.usage?.total_tokens || 0,
    }
  }

  async summarizeDocument(text: string, maxLength = 500): Promise<string> {
    const result = await this.generateText({
      messages: [
        { role: 'system', content: `Summarize this legal document in ${maxLength} words or fewer. Focus on parties, key obligations, dates, and legal significance. Mark as [DRAFT].` },
        { role: 'user', content: text.slice(0, 10000) },
      ],
      temperature: 0.2,
    })
    return result.content
  }
}
