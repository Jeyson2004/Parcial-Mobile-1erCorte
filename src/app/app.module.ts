import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { RouteReuseStrategy } from "@angular/router"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"

import { IonicModule, IonicRouteStrategy } from "@ionic/angular"

import { AppComponent } from "./app.component"
import { AppRoutingModule } from "./app-routing.module"

import { AuthInterceptor } from "./interceptors/auth.interceptor"
import { ErrorInterceptor } from "./interceptors/error.interceptor"
import { LoadingInterceptor } from "./interceptors/loading.interceptor"
import { RetryInterceptor } from "./interceptors/retry.interceptor"

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RetryInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
