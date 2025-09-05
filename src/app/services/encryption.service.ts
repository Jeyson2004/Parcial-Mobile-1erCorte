import { Injectable } from "@angular/core"
import * as CryptoJS from "crypto-js"
import { ConfigService } from "./config.service"

@Injectable({
  providedIn: "root",
})
export class EncryptionService {
  private secretKey: string

  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.getSecurityConfig().encryptionKey
  }

  encryptPassword(password: string): string {
    return CryptoJS.AES.encrypt(password, this.secretKey).toString()
  }

  decryptPassword(encryptedPassword: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, this.secretKey)
    return bytes.toString(CryptoJS.enc.Utf8)
  }

  hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.secretKey).toString()
  }

  validatePassword(password: string, hashedPassword: string): boolean {
    const hash = this.hashPassword(password)
    return hash === hashedPassword
  }
}
