import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import knowledgeBase from "./knowledgebase.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RAGSource {
  id: string;
  fileName: string;
  snippet: string;
  score: number;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  category: string;
  keywords: string[];
}


// Initialize search engines
const documents = knowledgeBase.documents as Document[];

// Import embedding search
import { EmbeddingSearch } from './embedding-search';

// Initialize embedding search singleton
let embeddingSearchInstance: EmbeddingSearch | null = null;

// Initialize embedding search synchronously at module load
function getEmbeddingSearch(): EmbeddingSearch {
  if (!embeddingSearchInstance) {
    console.log('Initializing TF-IDF search...');
    embeddingSearchInstance = new EmbeddingSearch(documents);
  }
  return embeddingSearchInstance;
}

// Get the instance to trigger initialization at module load
const embeddingSearch = getEmbeddingSearch();

export async function retrieveContext(
  query: string,
  n: number = 3,
): Promise<{
  context: string;
  isRagWorking: boolean;
  ragSources: RAGSource[];
}> {
  try {
    console.log('Using TF-IDF search');
    const searchResults: Array<{ document: Document; score: number }> = await embeddingSearch.search(query, n);
    
    if (searchResults.length === 0) {
      return {
        context: "",
        isRagWorking: true,
        ragSources: [],
      };
    }
    
    // Create context from top documents
    const context = searchResults
      .map((result: { document: Document; score: number }) => `${result.document.title}:\n${result.document.content}`)
      .join("\n\n---\n\n");
    
    // Create RAG sources for display
    const ragSources: RAGSource[] = searchResults.map((result: { document: Document; score: number }) => ({
      id: result.document.id,
      fileName: result.document.title,
      snippet: result.document.content.substring(0, 150) + "...",
      score: Math.round(result.score * 100) / 100
    }));
    
    return {
      context,
      isRagWorking: true,
      ragSources,
    };
    
  } catch (error) {
    console.error("Error in RAG retrieval:", error);
    return {
      context: "",
      isRagWorking: false,
      ragSources: [],
    };
  }
}