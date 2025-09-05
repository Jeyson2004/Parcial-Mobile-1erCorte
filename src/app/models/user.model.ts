export interface User {
  id?: string
  email: string
  password: string
  firstName: string
  lastName: string
  country: string
  createdAt?: Date
  updatedAt?: Date
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  country: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
  token?: string
}
