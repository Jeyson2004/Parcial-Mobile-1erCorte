import { NgModule } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule, ReactiveFormsModule } from "@angular/forms"
import { IonicModule } from "@ionic/angular"
import { RouterModule } from "@angular/router";

import { InputComponent } from "./input/input.component"
import { SelectComponent } from "./select/select.component"
import { ButtonComponent } from "./button/button.component"
import { CardComponent } from "./card/card.component"
import { ModalComponent } from "./modal/modal.component"
import { LoaderComponent } from "./loader/loader.component"

@NgModule({
  declarations: [InputComponent, SelectComponent, ButtonComponent, CardComponent, ModalComponent, LoaderComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule],
  exports: [InputComponent, SelectComponent, ButtonComponent, CardComponent, ModalComponent, LoaderComponent, RouterModule],
})
export class SharedModule {}
