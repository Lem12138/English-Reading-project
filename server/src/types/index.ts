export interface UserInfo {
  id: number;
  username: string;
  email: string;
}

export interface ArticleItem {
  id: number;
  title: string;
  description: string;
  content: string;
  url: string;
  source: string;
  author: string | null;
  imageUrl: string | null;
  publishedAt: string;
  createdAt: string;
}

export interface SavedWordItem {
  id: number;
  userId: number;
  word: string;
  phonetic: string | null;
  translation: string;
  context: string | null;
  articleId: number | null;
  createdAt: string;
  article?: { title: string } | null;
}

export interface SavedSentenceItem {
  id: number;
  userId: number;
  sentence: string;
  translation: string | null;
  articleId: number | null;
  createdAt: string;
  article?: { title: string } | null;
}

export interface ReadingHistoryItem {
  id: number;
  userId: number;
  articleId: number;
  readAt: string;
  article: {
    id: number;
    title: string;
    source: string;
  };
}

export interface EnDefinition {
  partOfSpeech: string;
  definition: string;
  example?: string;
}

export interface ContextNote {
  term: string;
  summary: string;
}

export interface DictResult {
  word: string;
  phonetic: string;
  translation: string;
  explains: string[];
  enDefinitions: EnDefinition[];
  contextNotes: ContextNote[];
}
