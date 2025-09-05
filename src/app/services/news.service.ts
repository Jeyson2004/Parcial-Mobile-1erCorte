import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable, BehaviorSubject, of } from "rxjs"
import { map, catchError } from "rxjs/operators"
import { environment } from "../../environments/environment"
import { NewsResponse, NewsArticle, NewsSearchParams, NewsSourcesResponse } from "../models/news.model"

@Injectable({
  providedIn: "root",
})
export class NewsService {
  private readonly baseUrl = environment.newsApiUrl
  private readonly apiKey = environment.newsApiKey

  private articlesSubject = new BehaviorSubject<NewsArticle[]>([])
  public articles$ = this.articlesSubject.asObservable()

  private loadingSubject = new BehaviorSubject<boolean>(false)
  public loading$ = this.loadingSubject.asObservable()

  private errorSubject = new BehaviorSubject<string | null>(null)
  public error$ = this.errorSubject.asObservable()

  constructor(private http: HttpClient) {}

  // Get top headlines
  getTopHeadlines(params: NewsSearchParams = {}): Observable<NewsResponse> {
    this.loadingSubject.next(true)
    this.errorSubject.next(null)

    let httpParams = new HttpParams().set("apiKey", this.apiKey)

    // Add parameters
    if (params.country) httpParams = httpParams.set("country", params.country)
    if (params.category) httpParams = httpParams.set("category", params.category)
    if (params.sources) httpParams = httpParams.set("sources", params.sources)
    if (params.q) httpParams = httpParams.set("q", params.q)
    if (params.pageSize) httpParams = httpParams.set("pageSize", params.pageSize.toString())
    if (params.page) httpParams = httpParams.set("page", params.page.toString())

    return this.http.get<NewsResponse>(`${this.baseUrl}/top-headlines`, { params: httpParams }).pipe(
      map((response) => {
        this.loadingSubject.next(false)
        this.articlesSubject.next(response.articles)
        return response
      }),
      catchError((error) => {
        this.loadingSubject.next(false)
        this.errorSubject.next("Error al cargar las noticias")
        console.error("News API Error:", error)
        return of({ status: "error", totalResults: 0, articles: [] } as NewsResponse)
      }),
    )
  }

  // Search everything
  searchEverything(params: NewsSearchParams): Observable<NewsResponse> {
    this.loadingSubject.next(true)
    this.errorSubject.next(null)

    let httpParams = new HttpParams().set("apiKey", this.apiKey)

    // Add parameters
    if (params.q) httpParams = httpParams.set("q", params.q)
    if (params.sources) httpParams = httpParams.set("sources", params.sources)
    if (params.domains) httpParams = httpParams.set("domains", params.domains)
    if (params.excludeDomains) httpParams = httpParams.set("excludeDomains", params.excludeDomains)
    if (params.from) httpParams = httpParams.set("from", params.from)
    if (params.to) httpParams = httpParams.set("to", params.to)
    if (params.language) httpParams = httpParams.set("language", params.language)
    if (params.sortBy) httpParams = httpParams.set("sortBy", params.sortBy)
    if (params.pageSize) httpParams = httpParams.set("pageSize", params.pageSize.toString())
    if (params.page) httpParams = httpParams.set("page", params.page.toString())

    return this.http.get<NewsResponse>(`${this.baseUrl}/everything`, { params: httpParams }).pipe(
      map((response) => {
        this.loadingSubject.next(false)
        this.articlesSubject.next(response.articles)
        return response
      }),
      catchError((error) => {
        this.loadingSubject.next(false)
        this.errorSubject.next("Error al buscar noticias")
        console.error("News API Error:", error)
        return of({ status: "error", totalResults: 0, articles: [] } as NewsResponse)
      }),
    )
  }

  // Get news sources
  getSources(category?: string, language?: string, country?: string): Observable<NewsSourcesResponse> {
    let httpParams = new HttpParams().set("apiKey", this.apiKey)

    if (category) httpParams = httpParams.set("category", category)
    if (language) httpParams = httpParams.set("language", language)
    if (country) httpParams = httpParams.set("country", country)

    return this.http.get<NewsSourcesResponse>(`${this.baseUrl}/sources`, { params: httpParams }).pipe(
      catchError((error) => {
        console.error("News Sources API Error:", error)
        return of({ status: "error", sources: [] } as NewsSourcesResponse)
      }),
    )
  }

  // Utility methods
  formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getTimeAgo(dateString: string): string {
    const now = new Date()
    const publishedDate = new Date(dateString)
    const diffInMs = now.getTime() - publishedDate.getTime()
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      return "Hace menos de una hora"
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? "s" : ""}`
    } else if (diffInDays < 7) {
      return `Hace ${diffInDays} día${diffInDays > 1 ? "s" : ""}`
    } else {
      return this.formatDate(dateString)
    }
  }

  // Clear data
  clearArticles(): void {
    this.articlesSubject.next([])
    this.errorSubject.next(null)
  }
}
