import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { IonicModule } from "@ionic/angular"
import { NewsPageRoutingModule } from "./news-routing.module"
import { NewsPage } from "./news.page"
import { SharedModule } from "../../components/shared/shared.module"

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, NewsPageRoutingModule, SharedModule],
  declarations: [NewsPage],
})
export class NewsPageModule {}
