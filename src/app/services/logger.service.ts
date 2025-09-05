import { Injectable } from "@angular/core"
import { ConfigService } from "./config.service"

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  data?: any
  source?: string
}

@Injectable({
  providedIn: "root",
})
export class LoggerService {
  private logs: LogEntry[] = []
  private maxLogs = 1000

  constructor(private configService: ConfigService) {}

  debug(message: string, data?: any, source?: string): void {
    this.log(LogLevel.DEBUG, message, data, source)
  }

  info(message: string, data?: any, source?: string): void {
    this.log(LogLevel.INFO, message, data, source)
  }

  warn(message: string, data?: any, source?: string): void {
    this.log(LogLevel.WARN, message, data, source)
  }

  error(message: string, data?: any, source?: string): void {
    this.log(LogLevel.ERROR, message, data, source)
  }

  private log(level: LogLevel, message: string, data?: any, source?: string): void {
    const config = this.configService.getLoggingConfig()
    const minLevel = this.getLogLevel(config.level)

    if (level < minLevel) {
      return
    }

    const logEntry: LogEntry = {
      timestamp: new Date(),
      level,
      message,
      data,
      source,
    }

    // Store log entry
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console logging
    if (config.enableConsoleLogging) {
      this.logToConsole(logEntry)
    }

    // Remote logging (in production)
    if (config.enableRemoteLogging && this.configService.isProduction()) {
      this.logToRemote(logEntry)
    }
  }

  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString()
    const source = entry.source ? `[${entry.source}]` : ""
    const message = `${timestamp} ${source} ${entry.message}`

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(message, entry.data)
        break
      case LogLevel.INFO:
        console.info(message, entry.data)
        break
      case LogLevel.WARN:
        console.warn(message, entry.data)
        break
      case LogLevel.ERROR:
        console.error(message, entry.data)
        break
    }
  }

  private logToRemote(entry: LogEntry): void {
    // In a real app, this would send logs to a remote service
    // For now, we'll just store them locally
    const remoteLog = {
      ...entry,
      appVersion: this.configService.getAppVersion(),
      environment: this.configService.isProduction() ? "production" : "development",
      userAgent: navigator.userAgent,
      url: window.location.href,
    }

    // Store in localStorage for now (in real app, send to logging service)
    const remoteLogs = JSON.parse(localStorage.getItem("remoteLogs") || "[]")
    remoteLogs.push(remoteLog)

    // Keep only last 100 remote logs
    if (remoteLogs.length > 100) {
      remoteLogs.splice(0, remoteLogs.length - 100)
    }

    localStorage.setItem("remoteLogs", JSON.stringify(remoteLogs))
  }

  private getLogLevel(levelString: string): LogLevel {
    switch (levelString.toLowerCase()) {
      case "debug":
        return LogLevel.DEBUG
      case "info":
        return LogLevel.INFO
      case "warn":
        return LogLevel.WARN
      case "error":
        return LogLevel.ERROR
      default:
        return LogLevel.INFO
    }
  }

  // Get logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Clear logs
  clearLogs(): void {
    this.logs = []
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}
