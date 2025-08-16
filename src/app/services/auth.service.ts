import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

export interface TokenPayload {
  userId: string;
  username : string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getDecodedToken(): TokenPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode<TokenPayload>(token);
    } catch (err) {
      console.error('Error decoding token', err);
      return null;
    }
  }

  getUsername(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.username || null;
  }

  getUserRole(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.role || null;
  }

  
}
