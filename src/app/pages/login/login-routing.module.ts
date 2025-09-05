import { NgModule } from "@angular/core"
import { type Routes, RouterModule } from "@angular/router"
import { LoginPage } from "./login.page"

const routes: Routes = [
  {
    path: "",
    component: LoginPage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginPageRoutingModule {}
