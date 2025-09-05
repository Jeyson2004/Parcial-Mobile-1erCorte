// http.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  skipLoading?: boolean;
  skipAuth?: boolean;
  skipRetry?: boolean;
}

type CleanHttpOptions = {
  headers?: HttpHeaders;
  params?: HttpParams;
  observe: 'body';
  responseType: 'json';
};

@Injectable({ providedIn: 'root' })
export class HttpService {
  constructor(private http: HttpClient) {}

  get<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(url, this.buildHttpOptions(options));
  }

  post<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(url, body, this.buildHttpOptions(options));
  }

  put<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(url, body, this.buildHttpOptions(options));
  }

  patch<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.patch<T>(url, body, this.buildHttpOptions(options));
  }

  delete<T>(url: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(url, this.buildHttpOptions(options));
  }

  deleteWithBody<T>(url: string, body: unknown, options?: HttpOptions): Observable<T> {
    const clean = this.buildHttpOptions(options);
    return this.http.request<T>('DELETE', url, { ...clean, body });
  }

  private buildHttpOptions(options?: HttpOptions): CleanHttpOptions {
    // headers
    let headers = this.buildHeaders(options?.headers);

    // flags para interceptores (solo si están activos)
    if (options?.skipLoading) headers = headers.set('X-Skip-Loading', 'true');
    if (options?.skipAuth)    headers = headers.set('X-Skip-Auth', 'true');
    if (options?.skipRetry)   headers = headers.set('X-Skip-Retry', 'true');

    // params
    const params = this.buildParams(options?.params);

    // Forzamos overload de “body + json” => Observable<T>
    return {
      headers,
      params,
      observe: 'body',
      responseType: 'json',
    } as const;
  }

  private buildHeaders(
    h?: HttpHeaders | Record<string, string | string[]>
  ): HttpHeaders {
    if (!h) return new HttpHeaders();
    if (h instanceof HttpHeaders) return h;

    let headers = new HttpHeaders();
    for (const [k, v] of Object.entries(h)) {
      headers = headers.set(k, Array.isArray(v) ? v : [v]);
    }
    return headers;
  }

  private buildParams(
    p?: HttpParams | Record<string, string | string[]>
  ): HttpParams | undefined {
    if (!p) return undefined;
    if (p instanceof HttpParams) return p;

    let params = new HttpParams();
    for (const [k, v] of Object.entries(p)) {
      if (Array.isArray(v)) {
        v.forEach(val => params = params.append(k, val));
      } else {
        params = params.set(k, v);
      }
    }
    return params;
    }
}
