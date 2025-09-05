import { Injectable } from "@angular/core"
import { Router } from "@angular/router"
import { AlertController } from "@ionic/angular"

@Injectable({
  providedIn: "root",
})
export class SecurityService {
  private readonly maxLoginAttempts = 5
  private readonly lockoutDuration = 15 * 60 * 1000 // 15 minutes
  private loginAttempts: { [email: string]: { count: number; lastAttempt: number } } = {}

  constructor(
    private router: Router,
    private alertController: AlertController,
  ) {}

  // Check if user is locked out
  isLockedOut(email: string): boolean {
    const attempts = this.loginAttempts[email]
    if (!attempts || attempts.count < this.maxLoginAttempts) {
      return false
    }

    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt
    if (timeSinceLastAttempt > this.lockoutDuration) {
      // Reset attempts after lockout period
      delete this.loginAttempts[email]
      return false
    }

    return true
  }

  // Record failed login attempt
  recordFailedAttempt(email: string): void {
    if (!this.loginAttempts[email]) {
      this.loginAttempts[email] = { count: 0, lastAttempt: 0 }
    }

    this.loginAttempts[email].count++
    this.loginAttempts[email].lastAttempt = Date.now()
  }

  // Reset login attempts on successful login
  resetAttempts(email: string): void {
    delete this.loginAttempts[email]
  }

  // Get remaining lockout time
  getRemainingLockoutTime(email: string): number {
    const attempts = this.loginAttempts[email]
    if (!attempts || attempts.count < this.maxLoginAttempts) {
      return 0
    }

    const timeSinceLastAttempt = Date.now() - attempts.lastAttempt
    const remainingTime = this.lockoutDuration - timeSinceLastAttempt
    return Math.max(0, remainingTime)
  }

  // Format lockout time for display
  formatLockoutTime(milliseconds: number): string {
    const minutes = Math.ceil(milliseconds / (60 * 1000))
    return `${minutes} minuto${minutes > 1 ? "s" : ""}`
  }

  // Validate password strength
  validatePasswordStrength(password: string): {
    isValid: boolean
    errors: string[]
    strength: "weak" | "medium" | "strong"
  } {
    const errors: string[] = []
    let score = 0

    // Length check
    if (password.length < 6) {
      errors.push("La contraseña debe tener al menos 6 caracteres")
    } else if (password.length >= 8) {
      score++
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push("Debe contener al menos una letra mayúscula")
    } else {
      score++
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push("Debe contener al menos una letra minúscula")
    } else {
      score++
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push("Debe contener al menos un número")
    } else {
      score++
    }

    // Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push("Debe contener al menos un carácter especial")
    } else {
      score++
    }

    let strength: "weak" | "medium" | "strong" = "weak"
    if (score >= 4) {
      strength = "strong"
    } else if (score >= 2) {
      strength = "medium"
    }

    return {
      isValid: errors.length === 0 && password.length >= 6,
      errors,
      strength,
    }
  }

  // Sanitize input to prevent XSS
  sanitizeInput(input: string): string {
    return input
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
  }

  // Check for suspicious activity
  detectSuspiciousActivity(userAgent: string, ipAddress?: string): boolean {
    // Basic checks for suspicious patterns
    const suspiciousPatterns = [/bot/i, /crawler/i, /spider/i, /scraper/i, /curl/i, /wget/i, /python/i, /postman/i]

    return suspiciousPatterns.some((pattern) => pattern.test(userAgent))
  }

  // Show security alert
  async showSecurityAlert(title: string, message: string): Promise<void> {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: [
        {
          text: "Entendido",
          role: "cancel",
        },
      ],
    })

    await alert.present()
  }

  // Navigate to secure route
  navigateToSecureRoute(route: string): void {
    this.router.navigate([route])
  }
}
