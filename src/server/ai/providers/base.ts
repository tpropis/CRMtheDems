// ============================================================
// AI Model Provider Abstraction
// Supports: Ollama (local), vLLM, Azure OpenAI, OpenAI
// Default: Ollama (no data leaves firm)
// ============================================================

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface GenerateTextOptions {
  messages: AIMessage[]
  maxTokens?: number
  temperature?: number
  stream?: boolean
}

export interface GenerateTextResult {
  content: string
  model: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  latencyMs: number
}

export interface EmbedTextOptions {
  text: string | string[]
  model?: string
}

export interface EmbedTextResult {
  embeddings: number[][]
  model: string
  tokens: number
}

export interface AIProvider {
  readonly id: string
  readonly name: string
  readonly type: 'ollama' | 'vllm' | 'azure_openai' | 'openai'

  isAvailable(): Promise<boolean>
  generateText(options: GenerateTextOptions): Promise<GenerateTextResult>
  generateStream(options: GenerateTextOptions): AsyncGenerator<string>
  embedText(options: EmbedTextOptions): Promise<EmbedTextResult>
  summarizeDocument(text: string, maxLength?: number): Promise<string>
}

export class AIError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = 'AIError'
  }
}
