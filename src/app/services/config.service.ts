import { Injectable } from "@angular/core"
import { environment } from "../../environments/environment"

export interface AppConfig {
  production: boolean
  appName: string
  appVersion: string
  newsApiKey: string
  newsApiUrl: string
  countriesApiUrl: string
  defaultLanguage: string
  defaultCountry: string
  defaultPageSize: number
  maxRetries: number
  requestTimeout: number
  tokenExpirationTime: number
  maxLoginAttempts: number
  lockoutDuration: number
  encryptionKey: string
  features: {
    enableOfflineMode: boolean
    enablePushNotifications: boolean
    enableAnalytics: boolean
    enableCrashReporting: boolean
    enableDarkMode: boolean
    enableSocialSharing: boolean
    enableBookmarks: boolean
    enableSearch: boolean
    enableCategories: boolean
  }
  cache: {
    newsArticlesTTL: number
    countriesTTL: number
    userDataTTL: number
  }
  logging: {
    level: string
    enableConsoleLogging: boolean
    enableRemoteLogging: boolean
    logApiCalls: boolean
    logUserActions: boolean
  }
  devTools: {
    enableReduxDevTools: boolean
    enablePerformanceMonitoring: boolean
    showDebugInfo: boolean
  }
}

@Injectable({
  providedIn: "root",
})
export class ConfigService {
  private config: AppConfig = environment

  constructor() {
    this.validateConfig()
  }

  // Get full configuration
  getConfig(): AppConfig {
    return this.config
  }

  // Get specific configuration sections
  getApiConfig() {
    return {
      newsApiKey: this.config.newsApiKey,
      newsApiUrl: this.config.newsApiUrl,
      countriesApiUrl: this.config.countriesApiUrl,
      requestTimeout: this.config.requestTimeout,
      maxRetries: this.config.maxRetries,
    }
  }

  getSecurityConfig() {
    return {
      tokenExpirationTime: this.config.tokenExpirationTime,
      maxLoginAttempts: this.config.maxLoginAttempts,
      lockoutDuration: this.config.lockoutDuration,
      encryptionKey: this.config.encryptionKey,
    }
  }

  getFeatureFlags() {
    return this.config.features
  }

  getCacheConfig() {
    return this.config.cache
  }

  getLoggingConfig() {
    return this.config.logging
  }

  // Feature flag checks
  isFeatureEnabled(feature: keyof AppConfig["features"]): boolean {
    return this.config.features[feature] || false
  }

  // Environment checks
  isProduction(): boolean {
    return this.config.production
  }

  isDevelopment(): boolean {
    return !this.config.production
  }

  // App info
  getAppName(): string {
    return this.config.appName
  }

  getAppVersion(): string {
    return this.config.appVersion
  }

  // Validation
  private validateConfig(): void {
    const requiredFields = ["newsApiKey", "newsApiUrl", "countriesApiUrl", "encryptionKey"]

    const missingFields = requiredFields.filter(
      (field) =>
        !this.config[field as keyof AppConfig] ||
        this.config[field as keyof AppConfig] === `YOUR_${field.toUpperCase()}`,
    )

    if (missingFields.length > 0 && this.config.production) {
      console.error("Missing required configuration fields:", missingFields)
      throw new Error(`Missing required configuration: ${missingFields.join(", ")}`)
    }

    if (missingFields.length > 0 && !this.config.production) {
      console.warn("Missing configuration fields (development mode):", missingFields)
    }
  }

  // Dynamic configuration updates (for remote config)
  updateConfig(newConfig: Partial<AppConfig>): void {
    this.config = { ...this.config, ...newConfig }
    this.validateConfig()
  }

  // Get configuration for specific environment
  getEnvironmentInfo() {
    return {
      production: this.config.production,
      appName: this.config.appName,
      appVersion: this.config.appVersion,
      environment: this.config.production ? "production" : "development",
    }
  }
}
