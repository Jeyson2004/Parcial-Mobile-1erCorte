import { Component, Input } from "@angular/core"

@Component({
  selector: "app-loader",
  templateUrl: "./loader.component.html",
  styleUrls: ["./loader.component.scss"],
  standalone: false,
})
export class LoaderComponent {
  @Input() message = "Cargando..."
  @Input() spinner = "crescent"
  @Input() size: "small" | "default" | "large" = "default"
  @Input() color = "primary"
  @Input() overlay = false
  @Input() transparent = false

  constructor() {}

  get loaderClass() {
    const classes = ["loader-container"]

    if (this.overlay) {
      classes.push("overlay")
    }

    if (this.transparent) {
      classes.push("transparent")
    }

    classes.push(`size-${this.size}`)

    return classes.join(" ")
  }
}
