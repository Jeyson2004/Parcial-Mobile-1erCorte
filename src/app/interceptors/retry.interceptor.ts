import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retryWhen, mergeMap, take } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000; // 1 second

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen((errors) =>
        errors.pipe(
          mergeMap((error: HttpErrorResponse, index: number) => {
            // Only retry for certain error codes and within retry limit
            if (this.shouldRetry(error, index)) {
              console.log(
                `Retrying request (${index + 1}/${this.maxRetries}):`,
                request.url
              );
              return timer(this.retryDelay * (index + 1)); // Exponential backoff
            }
            return throwError(() => error);
          }),
          take(this.maxRetries)
        )
      )
    );
  }

  private shouldRetry(error: HttpErrorResponse, retryCount: number): boolean {
    // Don't retry if we've exceeded max retries
    if (retryCount >= this.maxRetries) {
      return false;
    }

    // Only retry for certain error codes
    const retryableErrors = [0, 408, 429, 500, 502, 503, 504];
    return retryableErrors.includes(error.status);
  }
}
