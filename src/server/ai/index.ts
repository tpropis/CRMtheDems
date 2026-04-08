// ── AI Provider Factory ─────────────────────────────────────
import { OllamaProvider } from './providers/ollama'
import { OpenAICompatProvider } from './providers/openai'
import type { AIProvider } from './providers/base'

let _provider: AIProvider | null = null

export function getAIProvider(): AIProvider {
  if (_provider) return _provider

  const providerType = process.env.AI_PROVIDER || 'ollama'

  switch (providerType) {
    case 'ollama':
      _provider = new OllamaProvider()
      break
    case 'azure_openai':
      _provider = new OpenAICompatProvider('azure_openai')
      break
    case 'openai':
      // WARN: data leaves firm
      console.warn('[PRIVILEGE VAULT] WARNING: OpenAI provider is active. Client data may leave firm control.')
      _provider = new OpenAICompatProvider('openai')
      break
    default:
      _provider = new OllamaProvider()
  }

  return _provider
}

export type { AIProvider, AIMessage, GenerateTextOptions, GenerateTextResult } from './providers/base'
