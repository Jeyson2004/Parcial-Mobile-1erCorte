import { Component, Input, Output, EventEmitter, forwardRef } from "@angular/core"
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms"

@Component({
  selector: "app-input",
  templateUrl: "./input.component.html",
  styleUrls: ["./input.component.scss"],
  standalone: false,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  @Input() label = ""
  @Input() placeholder = ""
  @Input() type = "text"
  @Input() required = false
  @Input() disabled = false
  @Input() errorMessage = ""
  @Input() helperText = ""
  @Input() icon = ""
  @Input() clearable = false
  @Input() showPasswordToggle = false

  @Output() ionInput = new EventEmitter<any>()
  @Output() ionBlur = new EventEmitter<any>()
  @Output() ionFocus = new EventEmitter<any>()
  @Output() clearClicked = new EventEmitter<void>()

  value: any = ""
  showPassword = false
  isTouched = false

  private onChange = (value: any) => {}
  private onTouched = () => {}

  constructor() {}

  writeValue(value: any): void {
    this.value = value || ""
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

  onInputChange(event: any) {
    this.value = event.detail.value
    this.onChange(this.value)
    this.ionInput.emit(event)
  }

  onInputBlur(event: any) {
    this.isTouched = true
    this.onTouched()
    this.ionBlur.emit(event)
  }

  onInputFocus(event: any) {
    this.ionFocus.emit(event)
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  clearInput() {
    this.value = ""
    this.onChange(this.value)
    this.clearClicked.emit()
  }

  get inputType() {
    if (this.type === "password" && this.showPasswordToggle) {
      return this.showPassword ? "text" : "password"
    }
    return this.type
  }

  get hasError() {
    return this.errorMessage && this.isTouched
  }
}
