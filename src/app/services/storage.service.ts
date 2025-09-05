import { Injectable } from "@angular/core"
import { User } from "../models/user.model"

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  // User management
  async setUser(user: User): Promise<void> {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }

  async getUser(): Promise<User | null> {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }

  async removeUser(): Promise<void> {
    localStorage.removeItem("currentUser")
  }

  // Token management
  async setToken(token: string): Promise<void> {
    localStorage.setItem("authToken", token)
  }

  async getToken(): Promise<string | null> {
    return localStorage.getItem("authToken")
  }

  async removeToken(): Promise<void> {
    localStorage.removeItem("authToken")
  }

  // Generic storage methods
  async setItem(key: string, value: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async getItem(key: string): Promise<any> {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }

  async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key)
  }

  async clear(): Promise<void> {
    localStorage.clear()
  }
}
