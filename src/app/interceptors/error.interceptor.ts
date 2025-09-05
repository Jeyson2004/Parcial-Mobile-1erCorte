import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        this.handleError(error);
        return throwError(() => error);
      })
    );
  }

  private async handleError(error: HttpErrorResponse): Promise<void> {
    let errorMessage = 'Ha ocurrido un error inesperado';

    switch (error.status) {
      case 0:
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
        break;
      case 400:
        errorMessage = 'Solicitud inválida. Verifica los datos enviados.';
        break;
      case 401:
        errorMessage = 'No autorizado. Tu sesión ha expirado.';
        await this.handleUnauthorized();
        break;
      case 403:
        errorMessage = 'Acceso denegado. No tienes permisos para esta acción.';
        break;
      case 404:
        errorMessage = 'Recurso no encontrado.';
        break;
      case 429:
        errorMessage = 'Demasiadas solicitudes. Intenta más tarde.';
        break;
      case 500:
        errorMessage = 'Error interno del servidor. Intenta más tarde.';
        break;
      case 503:
        errorMessage = 'Servicio no disponible. Intenta más tarde.';
        break;
      default:
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        break;
    }

    // Show error toast for non-401 errors
    if (error.status !== 401) {
      await this.showErrorToast(errorMessage);
    }

    console.error('HTTP Error:', {
      status: error.status,
      message: errorMessage,
      url: error.url,
      error: error.error,
    });
  }

  private async handleUnauthorized(): Promise<void> {
    // Clear user session
    await this.authService.logout();

    // Show unauthorized message
    await this.showErrorToast(
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
    );

    // Redirect to login
    this.router.navigate(['/login']);
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      color: 'danger',
      position: 'top',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel',
        },
      ],
    });
    await toast.present();
  }
}
