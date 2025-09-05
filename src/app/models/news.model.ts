export interface NewsArticle {
  source: {
    id: string | null
    name: string
  }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

export interface NewsResponse {
  status: string
  totalResults: number
  articles: NewsArticle[]
}

export interface NewsSearchParams {
  q?: string
  sources?: string
  domains?: string
  excludeDomains?: string
  from?: string
  to?: string
  language?: string
  sortBy?: "relevancy" | "popularity" | "publishedAt"
  pageSize?: number
  page?: number
  country?: string
  category?: "business" | "entertainment" | "general" | "health" | "science" | "sports" | "technology"
}

export interface NewsSource {
  id: string
  name: string
  description: string
  url: string
  category: string
  language: string
  country: string
}

export interface NewsSourcesResponse {
  status: string
  sources: NewsSource[]
}
