import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private storageService: StorageService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip adding auth token for external APIs (News API, Countries API)
    if (this.isExternalApi(request.url)) {
      return next.handle(request);
    }

    // Add auth token for internal API calls
    return this.addAuthToken(request, next);
  }

  private addAuthToken(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return new Observable((observer) => {
      this.storageService
        .getToken()
        .then((token) => {
          if (token) {
            const authRequest = request.clone({
              headers: new HttpHeaders({
                ...request.headers,
                Authorization: `Bearer ${token}`,
              }),
            });
            next.handle(authRequest).subscribe(observer);
          } else {
            next.handle(request).subscribe(observer);
          }
        })
        .catch(() => {
          next.handle(request).subscribe(observer);
        });
    });
  }

  private isExternalApi(url: string): boolean {
    const externalApis = ['newsapi.org', 'restcountries.com'];
    return externalApis.some((api) => url.includes(api));
  }
}
