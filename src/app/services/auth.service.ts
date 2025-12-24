import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { InactivityService } from './inactivity.service';
import { BehaviorSubject } from 'rxjs';


export interface TokenPayload {
  userId: string;
  username : string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private isSignedInGoogle = new BehaviorSubject<boolean>(false);
  signedIn$ = this.isSignedInGoogle.asObservable();

  constructor(private router: Router, private inactivityService : InactivityService) {
   
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getGoogleToken(): string | null {
    return localStorage.getItem('google_access_token');
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

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout() {
  if (confirm('Are you sure you want to log out?')) {
    localStorage.clear();
    alert('Logged out successfully.');
    this.inactivityService.stopMonitoring();
    this.router.navigate(['/login']);
  }
}

setSignedIn(value: boolean) {
  this.isSignedInGoogle.next(value);
}


}
