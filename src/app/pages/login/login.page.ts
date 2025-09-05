import { Component,  OnInit } from "@angular/core"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import  { Router } from "@angular/router"
import  { LoadingController, AlertController, ToastController } from "@ionic/angular"
import  { AuthService } from "../../services/auth.service"
import  { LoginRequest } from "../../models/user.model"

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup
  showPassword = false

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
    })
  }

  ngOnInit(): void {
    console.log('LoginPage initialized');
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const loading = await this.loadingController.create({
        message: "Iniciando sesión...",
        spinner: "crescent",
      })
      await loading.present()

      const loginData: LoginRequest = this.loginForm.value

      try {
        const response = await this.authService.login(loginData)
        await loading.dismiss()

        if (response.success) {
          const toast = await this.toastController.create({
            message: response.message,
            duration: 2000,
            color: "success",
            position: "top",
          })
          await toast.present()

          this.router.navigate(["/news"])
        } else {
          const alert = await this.alertController.create({
            header: "Error",
            message: response.message,
            buttons: ["OK"],
          })
          await alert.present()
        }
      } catch (error) {
        await loading.dismiss()
        const alert = await this.alertController.create({
          header: "Error",
          message: "Error de conexión",
          buttons: ["OK"],
        })
        await alert.present()
      }
    } else {
      const alert = await this.alertController.create({
        header: "Formulario inválido",
        message: "Por favor, completa todos los campos correctamente.",
        buttons: ["OK"],
      })
      await alert.present()
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
  }

  goToRegister() {
    this.router.navigate(["/register"])
  }

  // Getter methods for form validation
  get email() {
    return this.loginForm.get("email")
  }
  get password() {
    return this.loginForm.get("password")
  }
}

export default LoginPage
