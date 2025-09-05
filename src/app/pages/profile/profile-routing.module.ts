import { NgModule } from "@angular/core"
import { type Routes, RouterModule } from "@angular/router"
import { ProfilePage } from "./profile.page"

const routes: Routes = [
  {
    path: "",
    component: ProfilePage,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
