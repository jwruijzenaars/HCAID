import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';
import { TokenService } from './token.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'auth_token';
  tokenService: TokenService;

  database = [
    {
      id: 0,
      email: 'testuser@gmail.com',
      password: '$2a$10$D7W5BAACeVoFJODNHKd2h.2dveVV1W/99R8m.eLKRfRAoWgEITyfy'
    },
    {
      id: 1,
      email: 'test123@gmail.com',
      password: '$2a$10$2DjYOl3Oej91OaL8cuF7QuHVTer7zzDkyi7YMtLee2v9TItJnS8xS'
    }
  ];

  constructor(tokenservice: TokenService) {
    this.tokenService = tokenservice;
  }

  async login(email: string, password: string): Promise<boolean> {
    for (let i = 0; i < this.database.length; i++) {
      if (this.database[i].email === email && await this.verifyPassword(password, this.database[i].password)) {
        const token = this.tokenService.createToken(this.database[i]);
        localStorage.setItem(this.tokenKey, token);
        return true;
      }
    }

    return false;
  }

  async register(email: string, password: string): Promise<boolean> {
    for (let i = 0; i < this.database.length; i++) {
      if (this.database[i].email === email) {
        return false;
      }
    }

    const user = {
      id: this.database.length,
      email: email,
      password: await this.hashPassword(password)
    }

    this.database.push(user);
    const token = this.tokenService.createToken(user);
    localStorage.setItem(this.tokenKey, token);
    return true;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.tokenService.isTokenValid(token) : false;
  }

  getUser() {
    const token = localStorage.getItem(this.tokenKey);
    return token ? this.tokenService.decodeToken(token) : null;
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
