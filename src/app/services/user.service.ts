import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { APP_CONFIG } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private apiURL = APP_CONFIG.api.baseUrl;

  constructor(private http: HttpClient, private router: Router) {

   }

   addUser(user: User): Observable<void>{
    return this.http.post<void>(this.apiURL+'register', user);
   }

   login(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.apiURL+'login', {username, password});
   }


   saveUserId(userId: string) {
    localStorage.setItem('userId', userId);
   }

   saveUserRole(role: string) {
    localStorage.setItem('userRole', role);
   }

}
