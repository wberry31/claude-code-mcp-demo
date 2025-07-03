// Simple TF-IDF based document search
export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
}

export class EmbeddingSearch {
  private documents: Document[] = [];
  private vocabulary: Map<string, number> = new Map();
  private idf: Map<string, number> = new Map();
  private documentVectors: Map<string, Map<string, number>> = new Map();

  constructor(documents: Document[]) {
    this.documents = documents;
    this.buildIndex();
  }

  private tokenize(text: string): string[] {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2);
  }

  private buildIndex() {
    // Build vocabulary and document frequency
    const df: Map<string, number> = new Map();
    
    this.documents.forEach(doc => {
      const tokens = new Set(this.tokenize(doc.content + ' ' + doc.title + ' ' + doc.keywords.join(' ')));
      tokens.forEach(token => {
        df.set(token, (df.get(token) || 0) + 1);
        this.vocabulary.set(token, this.vocabulary.size);
      });
    });

    // Calculate IDF
    const N = this.documents.length;
    df.forEach((freq, token) => {
      this.idf.set(token, Math.log(N / freq));
    });

    // Build document vectors
    this.documents.forEach(doc => {
      const vector = this.calculateTfIdf(doc.content + ' ' + doc.title + ' ' + doc.keywords.join(' '));
      this.documentVectors.set(doc.id, vector);
    });
  }

  private calculateTfIdf(text: string): Map<string, number> {
    const tokens = this.tokenize(text);
    const tf: Map<string, number> = new Map();
    
    // Calculate term frequency
    tokens.forEach(token => {
      tf.set(token, (tf.get(token) || 0) + 1);
    });

    // Normalize and multiply by IDF
    const vector: Map<string, number> = new Map();
    const maxFreq = Math.max(...Array.from(tf.values()));
    
    tf.forEach((freq, token) => {
      const normalizedTf = freq / maxFreq;
      const idfValue = this.idf.get(token) || 0;
      vector.set(token, normalizedTf * idfValue);
    });

    return vector;
  }

  private cosineSimilarity(vec1: Map<string, number>, vec2: Map<string, number>): number {
    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    // Calculate dot product and norms
    const allKeys = new Set([...Array.from(vec1.keys()), ...Array.from(vec2.keys())]);
    allKeys.forEach(key => {
      const val1 = vec1.get(key) || 0;
      const val2 = vec2.get(key) || 0;
      dotProduct += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    });

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) return 0;
    return dotProduct / (norm1 * norm2);
  }

  async search(query: string, k: number = 3): Promise<Array<{ document: Document; score: number }>> {
    const queryVector = this.calculateTfIdf(query);
    const scores: Array<{ document: Document; score: number }> = [];

    this.documents.forEach(doc => {
      const docVector = this.documentVectors.get(doc.id);
      if (docVector) {
        const score = this.cosineSimilarity(queryVector, docVector);
        
        // Boost score for title/keyword matches
        const queryLower = query.toLowerCase();
        const titleBoost = doc.title.toLowerCase().includes(queryLower) ? 0.2 : 0;
        const keywordBoost = doc.keywords.some(kw => 
          kw.toLowerCase().includes(queryLower)) ? 0.1 : 0;
        
        scores.push({ 
          document: doc, 
          score: score + titleBoost + keywordBoost 
        });
      }
    });

    // Sort by score and return top k
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, k);
  }

  async initialize() {
    // No async initialization needed for TF-IDF
    return;
  }

  getModelStatus(): { loaded: boolean; modelName: string } {
    return {
      loaded: true,
      modelName: 'tf-idf'
    };
  }
}

// Factory function for consistency
export function getEmbeddingSearch(): EmbeddingSearch | null {
  try {
    const knowledgeBase = require('./knowledgebase.json');
    return new EmbeddingSearch(knowledgeBase.documents);
  } catch (error) {
    console.error('Failed to load knowledge base:', error);
    return null;
  }
}

// Document type is already exported via interface declaration