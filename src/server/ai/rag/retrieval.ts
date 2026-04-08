// ── RAG Retrieval Layer ──────────────────────────────────────
// Permission-aware, matter-scoped vector retrieval
// Designed to swap to pgvector, Elastic, or Pinecone

import { db } from '@/lib/db'
import { getAIProvider } from '../index'
import type { RetrievalChunk } from '@prisma/client'

export interface RetrievalQuery {
  query: string
  firmId: string
  matterId?: string
  limit?: number
  minRelevance?: number
}

export interface RetrievedChunk {
  id: string
  content: string
  documentId: string
  documentName: string
  matterId?: string
  relevance: number
  metadata: Record<string, unknown>
}

// Naive full-text retrieval for MVP
// Replace with pgvector cosine similarity in production
export async function retrieveRelevantChunks(query: RetrievalQuery): Promise<RetrievedChunk[]> {
  const { query: q, firmId, matterId, limit = 5 } = query

  // Extract keywords from query for full-text search
  const keywords = q.toLowerCase().split(/\s+/).filter((w) => w.length > 3).slice(0, 10)

  // Build where clause with firm/matter scoping
  const where: any = {
    document: {
      firmId,
      ...(matterId ? { matterId } : {}),
      isCurrentVersion: true,
    },
  }

  const chunks = await db.retrievalChunk.findMany({
    where,
    include: {
      document: {
        select: { id: true, name: true, matterId: true, metadata: true },
      },
    },
    take: limit * 3,
  })

  // Score chunks by keyword overlap (MVP; replace with vector similarity)
  const scored = chunks
    .map((chunk) => {
      const contentLower = chunk.content.toLowerCase()
      const hits = keywords.filter((kw) => contentLower.includes(kw)).length
      const relevance = keywords.length > 0 ? hits / keywords.length : 0
      return { chunk, relevance }
    })
    .filter((r) => r.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit)

  return scored.map(({ chunk, relevance }) => ({
    id: chunk.id,
    content: chunk.content,
    documentId: chunk.document.id,
    documentName: chunk.document.name,
    matterId: chunk.document.matterId || undefined,
    relevance,
    metadata: chunk.metadata as Record<string, unknown>,
  }))
}

// Ingest a document into chunks for retrieval
export async function ingestDocument(documentId: string, firmId: string): Promise<void> {
  const doc = await db.document.findFirst({
    where: { id: documentId, firmId },
  })

  if (!doc || !doc.extractedText) return

  // Chunk the document
  const text = doc.extractedText
  const chunkSize = 1000
  const overlap = 100
  const chunks: string[] = []

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.slice(i, i + chunkSize)
    if (chunk.trim().length > 50) chunks.push(chunk)
  }

  // Store chunks
  await db.retrievalChunk.deleteMany({ where: { documentId } })

  await db.retrievalChunk.createMany({
    data: chunks.map((content, index) => ({
      documentId,
      chunkIndex: index,
      content,
      metadata: {
        firmId,
        matterId: doc.matterId,
        documentName: doc.name,
        chunkOffset: index * (chunkSize - overlap),
      },
    })),
  })

  await db.document.update({
    where: { id: documentId },
    data: { embeddingDone: true },
  })
}
