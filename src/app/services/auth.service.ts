import { Injectable, Inject } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { User, LoginRequest, RegisterRequest, AuthResponse } from "../models/user.model";
import { StorageService } from "./storage.service";
import { EncryptionService } from "./encryption.service";
import { ConfigService } from "./config.service";
import { LoggerService } from "./logger.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    @Inject(StorageService) private storageService: StorageService,
    @Inject(EncryptionService) private encryptionService: EncryptionService,
    @Inject(ConfigService) private configService: ConfigService,
    @Inject(LoggerService) private logger: LoggerService,
  ) {
    this.loadStoredUser();
  }

  private async loadStoredUser(): Promise<void> {
    try {
      const user = await this.storageService.getUser()
      const token = await this.storageService.getToken()

      if (user && token && this.isTokenValid(token)) {
        this.currentUserSubject.next(user)
        this.isAuthenticatedSubject.next(true)
        this.logger.info("User session restored", { userId: user.id }, "AuthService")
      } else {
        await this.logout()
      }
    } catch (error) {
      this.logger.error("Error loading stored user", error, "AuthService")
      await this.logout()
    }
  }

  private isTokenValid(token: string): boolean {
    // In a real app, you would validate the JWT token
    // For now, we'll just check if it exists and is not expired based on storage time
    const tokenData = this.parseToken(token)
    if (!tokenData) return false

    const expirationTime = this.configService.getSecurityConfig().tokenExpirationTime
    const isExpired = Date.now() - tokenData.createdAt > expirationTime

    return !isExpired
  }

  private parseToken(token: string): { createdAt: number } | null {
    try {
      // Simple token format: "token_randomstring_timestamp"
      const parts = token.split("_")
      if (parts.length === 3) {
        return { createdAt: Number.parseInt(parts[2]) }
      }
      return null
    } catch {
      return null
    }
  }

  async login(loginData: LoginRequest): Promise<AuthResponse> {
    try {
      this.logger.info("Login attempt", { email: loginData.email }, "AuthService")

      // Simulate API call - In real app, this would be an HTTP request
      const storedUsers = await this.getStoredUsers()
      const user = storedUsers.find((u) => u.email === loginData.email)

      if (!user) {
        this.logger.warn("Login failed - user not found", { email: loginData.email }, "AuthService")
        return {
          success: false,
          message: "Usuario no encontrado",
        }
      }

      // Validate password
      const isValidPassword = this.encryptionService.validatePassword(loginData.password, user.password)

      if (!isValidPassword) {
        this.logger.warn("Login failed - invalid password", { email: loginData.email }, "AuthService")
        return {
          success: false,
          message: "Contraseña incorrecta",
        }
      }

      // Generate token (in real app, this would come from server)
      const token = this.generateToken()

      // Store user and token
      await this.storageService.setUser(user)
      await this.storageService.setToken(token)

      // Update subjects
      this.currentUserSubject.next(user)
      this.isAuthenticatedSubject.next(true)

      this.logger.info("Login successful", { userId: user.id }, "AuthService")

      return {
        success: true,
        message: "Inicio de sesión exitoso",
        user: user,
        token: token,
      }
    } catch (error) {
      this.logger.error("Login error", error, "AuthService")
      return {
        success: false,
        message: "Error en el inicio de sesión",
      }
    }
  }

  async register(registerData: RegisterRequest): Promise<AuthResponse> {
    try {
      // Validate passwords match
      if (registerData.password !== registerData.confirmPassword) {
        return {
          success: false,
          message: "Las contraseñas no coinciden",
        }
      }

      // Check if user already exists
      const storedUsers = await this.getStoredUsers()
      const existingUser = storedUsers.find((u) => u.email === registerData.email)

      if (existingUser) {
        return {
          success: false,
          message: "El usuario ya existe",
        }
      }

      // Create new user
      const newUser: User = {
        id: this.generateId(),
        email: registerData.email,
        password: this.encryptionService.hashPassword(registerData.password),
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        country: registerData.country,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Store user
      storedUsers.push(newUser)
      await this.storageService.setItem("users", storedUsers)

      // Generate token
      const token = this.generateToken()

      // Store current user and token
      await this.storageService.setUser(newUser)
      await this.storageService.setToken(token)

      // Update subjects
      this.currentUserSubject.next(newUser)
      this.isAuthenticatedSubject.next(true)

      return {
        success: true,
        message: "Registro exitoso",
        user: newUser,
        token: token,
      }
    } catch (error) {
      return {
        success: false,
        message: "Error en el registro",
      }
    }
  }

  async logout(): Promise<void> {
    await this.storageService.removeUser()
    await this.storageService.removeToken()
    this.currentUserSubject.next(null)
    this.isAuthenticatedSubject.next(false)
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value
  }

  private async getStoredUsers(): Promise<User[]> {
    const users = await this.storageService.getItem("users")
    return users || []
  }

  private generateToken(): string {
    return "token_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  }

  private generateId(): string {
    return "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  }
}
