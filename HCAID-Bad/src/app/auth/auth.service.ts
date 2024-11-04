import { Injectable } from '@angular/core';
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
      password: 'password123'
    },
    {
      id: 1,
      email: 'test123@gmail.com',
      password: 'Password123'
    }
  ];

  constructor(tokenservice: TokenService) {
    this.tokenService = tokenservice;
  }

  async login(email: string, password: string): Promise<boolean> {
    for (let i = 0; i < this.database.length; i++) {
      if (this.database[i].email === email && this.database[i].password === password) {
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
      password: password
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
}
