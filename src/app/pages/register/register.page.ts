import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoadingController,
  AlertController,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { CountriesService} from '../../services/countries.service';
import { RegisterRequest } from '../../models/user.model';
import { CountryOption } from '../../models/country.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm: FormGroup;
  countries: CountryOption[] = [];
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private countriesService: CountriesService,
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        country: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  ngOnInit() {
    this.loadCountries();
  }

  async loadCountries() {
    const loading = await this.loadingController.create({
      message: 'Cargando países...',
      spinner: 'crescent',
    });
    await loading.present();

    this.countriesService.getCountries().subscribe({
      next: (countries) => {
        this.countries = countries;
        loading.dismiss();
      },
      error: (error) => {
        console.error('Error loading countries:', error);
        loading.dismiss();
      },
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const loading = await this.loadingController.create({
        message: 'Registrando usuario...',
        spinner: 'crescent',
      });
      await loading.present();

      const registerData: RegisterRequest = this.registerForm.value;

      try {
        const response = await this.authService.register(registerData);
        await loading.dismiss();

        if (response.success) {
          const toast = await this.toastController.create({
            message: response.message,
            duration: 2000,
            color: 'success',
            position: 'top',
          });
          await toast.present();

          this.router.navigate(['/news']);
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: response.message,
            buttons: ['OK'],
          });
          await alert.present();
        }
      } catch (error) {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Error de conexión',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Formulario inválido',
        message: 'Por favor, completa todos los campos correctamente.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Getter methods for form validation
  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get country() {
    return this.registerForm.get('country');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
}

export default RegisterPage;
