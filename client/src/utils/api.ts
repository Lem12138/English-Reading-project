const BASE_URL = '/api';

function getToken(): string | null {
  return localStorage.getItem('token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Request failed');
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { username: string; email: string; password: string }) =>
      request<{ token: string; user: { id: number; username: string; email: string } }>(
        '/auth/register',
        { method: 'POST', body: JSON.stringify(data) }
      ),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: { id: number; username: string; email: string } }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(data) }
      ),
    me: () => request<{ user: { id: number; username: string; email: string } }>('/auth/me'),
  },
  articles: {
    list: (params?: { page?: number; pageSize?: number; category?: string }) => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set('page', String(params.page));
      if (params?.pageSize) sp.set('pageSize', String(params.pageSize));
      if (params?.category) sp.set('category', params.category);
      const qs = sp.toString();
      return request<{ articles: import('../types').ArticleItem[]; total: number; page: number; pageSize: number }>(
        `/articles${qs ? '?' + qs : ''}`
      );
    },
    get: (id: number) =>
      request<{ article: import('../types').ArticleDetail }>(`/articles/${id}`),
    categories: () => request<{ categories: import('../types').CategoryInfo[] }>('/articles/categories'),
    enhance: (id: number) =>
      request<{ summary: string | null; outline: string | null }>(`/articles/${id}/enhance`, { method: 'POST' }),
  },
  words: {
    list: (page?: number) =>
      request<{ words: import('../types').SavedWordItem[]; total: number; page: number; pageSize: number }>(
        `/words?page=${page || 1}`
      ),
    save: (data: { word: string; phonetic?: string; translation: string; context?: string; articleId?: number }) =>
      request<{ word: import('../types').SavedWordItem }>('/words', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: number) => request<{ success: boolean }>(`/words/${id}`, { method: 'DELETE' }),
  },
  sentences: {
    list: () =>
      request<{ sentences: import('../types').SavedSentenceItem[] }>('/sentences'),
    save: (data: { sentence: string; translation?: string; articleId?: number }) =>
      request<{ sentence: import('../types').SavedSentenceItem }>('/sentences', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    delete: (id: number) =>
      request<{ success: boolean }>(`/sentences/${id}`, { method: 'DELETE' }),
  },
  dict: {
    lookup: (word: string) =>
      request<{ result: import('../types').DictResult }>('/dict/lookup', {
        method: 'POST',
        body: JSON.stringify({ word }),
      }),
  },
  history: {
    list: () =>
      request<{ histories: import('../types').ReadingHistoryItem[] }>('/history'),
    record: (articleId: number) =>
      request<{ success: boolean }>('/history', {
        method: 'POST',
        body: JSON.stringify({ articleId }),
      }),
  },
  essays: {
    list: (params?: { page?: number; pageSize?: number; level?: string; type?: string }) => {
      const sp = new URLSearchParams();
      if (params?.page) sp.set('page', String(params.page));
      if (params?.pageSize) sp.set('pageSize', String(params.pageSize));
      if (params?.level) sp.set('level', params.level);
      if (params?.type) sp.set('type', params.type);
      const qs = sp.toString();
      return request<{ essays: import('../types').EssayItem[]; total: number; page: number; pageSize: number }>(
        `/essays${qs ? '?' + qs : ''}`
      );
    },
    get: (id: number) =>
      request<{ essay: import('../types').EssayDetail }>(`/essays/${id}`),
  },
  essayFavorites: {
    list: () =>
      request<{ favorites: { id: number; essay: import('../types').EssayItem }[] }>('/essay-favorites'),
    toggle: (essayId: number) =>
      request<{ favorited: boolean }>(`/essay-favorites/${essayId}`, { method: 'POST' }),
    check: (essayId: number) =>
      request<{ favorited: boolean }>(`/essay-favorites/${essayId}`),
  },
  essayHistory: {
    list: () =>
      request<{ histories: { id: number; essayId: number; readAt: string; essay: { id: number; title: string; level: string } }[] }>('/essay-history'),
    record: (essayId: number) =>
      request<{ success: boolean }>('/essay-history', { method: 'POST', body: JSON.stringify({ essayId }) }),
  },
  favorites: {
    list: () =>
      request<{ favorites: { id: number; article: import('../types').ArticleItem }[] }>('/favorites'),
    toggle: (articleId: number) =>
      request<{ favorited: boolean }>(`/favorites/${articleId}`, { method: 'POST' }),
    check: (articleId: number) =>
      request<{ favorited: boolean }>(`/favorites/${articleId}`),
  },
};
