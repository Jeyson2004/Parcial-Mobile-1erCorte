export const environment = {
  production: true,
  appName: "News App",
  appVersion: "1.0.0",

  // API Configuration
  newsApiKey: "YOUR_PRODUCTION_NEWS_API_KEY",
  newsApiUrl: "https://newsapi.org/v2",
  countriesApiUrl: "https://restcountries.com/v3.1",

  // App Configuration
  defaultLanguage: "es",
  defaultCountry: "us",
  defaultPageSize: 20,
  maxRetries: 3,
  requestTimeout: 15000,

  // Security Configuration
  tokenExpirationTime: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  encryptionKey: "news-app-prod-key-2024-secure",

  // Feature Flags
  features: {
    enableOfflineMode: true,
    enablePushNotifications: true,
    enableAnalytics: true,
    enableCrashReporting: true,
    enableDarkMode: true,
    enableSocialSharing: true,
    enableBookmarks: true,
    enableSearch: true,
    enableCategories: true,
  },

  // Cache Configuration
  cache: {
    newsArticlesTTL: 10 * 60 * 1000, // 10 minutes
    countriesTTL: 24 * 60 * 60 * 1000, // 24 hours
    userDataTTL: 60 * 60 * 1000, // 1 hour
  },

  // Logging Configuration
  logging: {
    level: "error",
    enableConsoleLogging: false,
    enableRemoteLogging: true,
    logApiCalls: false,
    logUserActions: true,
  },

  // Development Tools
  devTools: {
    enableReduxDevTools: false,
    enablePerformanceMonitoring: true,
    showDebugInfo: false,
  },
}
