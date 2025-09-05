import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;
  private loadingController: HTMLIonLoadingElement | null = null;

  constructor(private loadingCtrl: LoadingController) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // Skip loading for certain requests
    if (this.shouldSkipLoading(request)) {
      return next.handle(request);
    }

    this.activeRequests++;
    this.showLoading();

    return next.handle(request).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse) {
          // Request completed successfully
        }
      }),
      finalize(() => {
        this.activeRequests--;
        if (this.activeRequests === 0) {
          this.hideLoading();
        }
      })
    );
  }

  private shouldSkipLoading(request: HttpRequest<unknown>): boolean {
    // Skip loading for certain endpoints or request types
    const skipUrls = ['/sources', '/everything'];
    return (
      skipUrls.some((url) => request.url.includes(url)) ||
      request.headers.has('X-Skip-Loading')
    );
  }

  private async showLoading(): Promise<void> {
    if (this.loadingController) {
      return; // Loading already shown
    }

    this.loadingController = await this.loadingCtrl.create({
      message: 'Cargando...',
      spinner: 'crescent',
      duration: 10000, // Max 10 seconds
    });

    await this.loadingController.present();
  }

  private async hideLoading(): Promise<void> {
    if (this.loadingController) {
      await this.loadingController.dismiss();
      this.loadingController = null;
    }
  }
}
