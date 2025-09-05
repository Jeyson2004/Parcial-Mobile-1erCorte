import { NgModule } from "@angular/core"
import { PreloadAllModules, RouterModule, type Routes } from "@angular/router"
import { AuthGuard } from "./guards/auth.guard"
import { GuestGuard } from "./guards/guest.guard"

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomePageModule),
    canActivate: [GuestGuard],
  },
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "login",
    loadChildren: () => import("./pages/login/login.module").then((m) => m.LoginPageModule),
    canActivate: [GuestGuard],
  },
  {
    path: "register",
    loadChildren: () => import("./pages/register/register.module").then((m) => m.RegisterPageModule),
    canActivate: [GuestGuard],
  },
  {
    path: "profile",
    loadChildren: () => import("./pages/profile/profile.module").then((m) => m.ProfilePageModule),
    canActivate: [AuthGuard],
  },
  {
    path: "news",
    loadChildren: () => import("./pages/news/news.module").then((m) => m.NewsPageModule),
    canActivate: [AuthGuard],
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
