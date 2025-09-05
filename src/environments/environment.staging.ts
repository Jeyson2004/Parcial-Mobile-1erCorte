export const environment = {
  production: false,
  appName: "News App (Staging)",
  appVersion: "1.0.0-staging",

  // API Configuration
  newsApiKey: "YOUR_STAGING_NEWS_API_KEY",
  newsApiUrl: "https://newsapi.org/v2",
  countriesApiUrl: "https://restcountries.com/v3.1",

  // App Configuration
  defaultLanguage: "es",
  defaultCountry: "us",
  defaultPageSize: 20,
  maxRetries: 3,
  requestTimeout: 12000,

  // Security Configuration
  tokenExpirationTime: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  encryptionKey: "news-app-staging-key-2024",

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
    newsArticlesTTL: 5 * 60 * 1000, // 5 minutes
    countriesTTL: 24 * 60 * 60 * 1000, // 24 hours
    userDataTTL: 60 * 60 * 1000, // 1 hour
  },

  // Logging Configuration
  logging: {
    level: "info",
    enableConsoleLogging: true,
    enableRemoteLogging: true,
    logApiCalls: true,
    logUserActions: true,
  },

  // Development Tools
  devTools: {
    enableReduxDevTools: true,
    enablePerformanceMonitoring: true,
    showDebugInfo: true,
  },
}
