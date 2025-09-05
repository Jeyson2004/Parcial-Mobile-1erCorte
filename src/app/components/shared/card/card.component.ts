import { Component, Input, Output, EventEmitter } from "@angular/core"

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
  standalone: false,
})
export class CardComponent {
  @Input() title = ""
  @Input() subtitle = ""
  @Input() imageUrl = ""
  @Input() imageAlt = ""
  @Input() clickable = false
  @Input() loading = false
  @Input() elevated = true

  @Output() cardClick = new EventEmitter<Event>()

  constructor() {}

  onClick(event: Event) {
    if (this.clickable && !this.loading) {
      this.cardClick.emit(event)
    }
  }

  get cardClass() {
    const classes = ["custom-card"]

    if (this.clickable) {
      classes.push("clickable")
    }

    if (this.loading) {
      classes.push("loading")
    }

    if (this.elevated) {
      classes.push("elevated")
    }

    return classes.join(" ")
  }
}
