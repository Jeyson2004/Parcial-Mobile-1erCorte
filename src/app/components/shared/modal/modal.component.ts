import { Component, Input, Output, EventEmitter, ViewChild } from "@angular/core"
import { IonModal } from "@ionic/angular"

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.scss"],
  standalone: false,
})
export class ModalComponent {
  @ViewChild(IonModal, { static: true }) modal!: IonModal

  @Input() title = ""
  @Input() subtitle = ""
  @Input() isOpen = false
  @Input() showCloseButton = true
  @Input() showBackdrop = true
  @Input() backdropDismiss = true
  @Input() size: "small" | "medium" | "large" | "full" = "medium"

  @Output() didDismiss = new EventEmitter<any>()
  @Output() willDismiss = new EventEmitter<any>()
  @Output() didPresent = new EventEmitter<any>()
  @Output() willPresent = new EventEmitter<any>()
  @Output() closeClicked = new EventEmitter<void>()

  constructor() {}

  onDidDismiss(event: any) {
    this.didDismiss.emit(event)
  }

  onWillDismiss(event: any) {
    this.willDismiss.emit(event)
  }

  onDidPresent(event: any) {
    this.didPresent.emit(event)
  }

  onWillPresent(event: any) {
    this.willPresent.emit(event)
  }

  close() {
    this.modal.dismiss()
    this.closeClicked.emit()
  }

  async present() {
    await this.modal.present()
  }

  async dismiss(data?: any, role?: string) {
    await this.modal.dismiss(data, role)
  }

  get modalClass() {
    return `modal-${this.size}`
  }
}
