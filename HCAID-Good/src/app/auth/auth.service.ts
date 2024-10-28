import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  database = [
    {
      email: 'testuser@gmail.com',
      password: '$2a$10$D7W5BAACeVoFJODNHKd2h.2dveVV1W/99R8m.eLKRfRAoWgEITyfy'
    },
    {
      email: 'test123@gmail.com',
      password: '$2a$10$2DjYOl3Oej91OaL8cuF7QuHVTer7zzDkyi7YMtLee2v9TItJnS8xS'
    }
  ];

  constructor() { }

  async login(email: string, password: string): Promise<boolean> {
    for (let i = 0; i < this.database.length; i++) {
      if (this.database[i].email === email && await this.verifyPassword(password, this.database[i].password)) {
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
    this.database.push({ email: email, password: await this.hashPassword(password) });
    return true;
  }

  logout(): void {
    // Placeholder for logout logic
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
