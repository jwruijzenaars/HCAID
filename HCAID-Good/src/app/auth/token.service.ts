import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private secretKey = environment.jwtSecret;

  constructor() { }

  createToken(payload: object): string {
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    const headerBase64 = btoa(JSON.stringify(header));
    const payloadBase64 = btoa(JSON.stringify(payload));
    const signature = CryptoJS.HmacSHA256(headerBase64 + '.' + payloadBase64, this.secretKey).toString(CryptoJS.enc.Base64);

    return `${headerBase64}.${payloadBase64}.${signature}`;
  }

  decodeToken(token: string): any {
    const [header, payload, signature] = token.split('.');
    return JSON.parse(atob(payload));
  }

  isTokenValid(token: string): boolean {
    const [header, payload, signature] = token.split('.');
    const expectedSignature = CryptoJS.HmacSHA256(`${header}.${payload}`, this.secretKey).toString(CryptoJS.enc.Base64);

    return signature === expectedSignature;
  }
}
