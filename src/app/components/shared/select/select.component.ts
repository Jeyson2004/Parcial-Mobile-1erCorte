import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core"
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"
import { IonItem } from "@ionic/angular/standalone";

export interface SelectOption {
  value: any
  label: string
  disabled?: boolean
}

@Component({
  selector: "app-select",
  templateUrl: "./select.component.html",
  styleUrls: ["./select.component.scss"],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  @Input() label = ""
  @Input() placeholder = "Seleccionar..."
  @Input() options: SelectOption[] = []
  @Input() required = false
  @Input() disabled = false
  @Input() errorMessage = ""
  @Input() helperText = ""
  @Input() multiple = false
  @Input() interface: "action-sheet" | "alert" | "popover" = "alert"

  @Output() selectionChange = new EventEmitter<any>()

  value: any = null
  isTouched = false

  private onChange = (value: any) => {}
  private onTouched = () => {}

  constructor() {}

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled
  }

  onSelectionChange(event: any) {
    this.value = event.detail.value
    this.isTouched = true
    this.onChange(this.value)
    this.onTouched()
    this.selectionChange.emit(this.value)
  }

  get hasError() {
    return this.errorMessage && this.isTouched
  }

  get selectedLabel() {
    if (!this.value) return ""

    if (this.multiple && Array.isArray(this.value)) {
      const selectedOptions = this.options.filter((option) => this.value.includes(option.value))
      return selectedOptions.map((option) => option.label).join(", ")
    }

    const selectedOption = this.options.find((option) => option.value === this.value)
    return selectedOption ? selectedOption.label : ""
  }
}
