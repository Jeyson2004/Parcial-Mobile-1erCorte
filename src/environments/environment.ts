export const environment = {
  production: false,
  appName: "News App",
  appVersion: "1.0.0",

  // API Configuration
  newsApiKey: "38340c09300543beb244a9ff4fbf9b15",
  newsApiUrl: "https://newsapi.org/v2",
  countriesApiUrl: "https://countriesnow.space/api/v0.1/countries/flag/unicode",

  // App Configuration
  defaultLanguage: "es",
  defaultCountry: "us",
  defaultPageSize: 20,
  maxRetries: 3,
  requestTimeout: 10000,

  // Security Configuration
  tokenExpirationTime: 24 * 60 * 60 * 1000, // 24 hours
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  encryptionKey: "news-app-dev-key-2024",

  // Feature Flags
  features: {
    enableOfflineMode: true,
    enablePushNotifications: false,
    enableAnalytics: false,
    enableCrashReporting: false,
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
    level: "debug",
    enableConsoleLogging: true,
    enableRemoteLogging: false,
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
