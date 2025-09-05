import { Component, Input, Output, EventEmitter } from "@angular/core"
import { IonButton, IonIcon, IonSpinner } from "@ionic/angular/standalone";

@Component({
  selector: "app-button",
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"],
  standalone: false,
})
export class ButtonComponent {
  @Input() text = ""
  @Input() type: "button" | "submit" | "reset" = "button"
  @Input() color = "primary"
  @Input() fill: "clear" | "outline" | "solid" = "solid"
  @Input() size: "small" | "default" | "large" = "default"
  @Input() expand: "full" | "block" = "block"
  @Input() shape: "round" | "square" = "round"
  @Input() disabled = false
  @Input() loading = false
  @Input() icon = ""
  @Input() iconPosition: "start" | "end" = "start"
  @Input() routerLink = ""

  @Output() buttonClick = new EventEmitter<Event>()

  constructor() {}

  onClick(event: Event) {
    if (!this.disabled && !this.loading) {
      this.buttonClick.emit(event)
    }
  }

  get buttonClass() {
    const classes = ["custom-button"]

    if (this.size !== "default") {
      classes.push(`size-${this.size}`)
    }

    if (this.loading) {
      classes.push("loading")
    }

    return classes.join(" ")
  }
}
