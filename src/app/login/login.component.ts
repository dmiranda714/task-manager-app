import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { User } from '../models/user.model';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  user: User = {
    username: '',
    password: '',
    role: 'viewer'
  }

  errorMessage = '';

  constructor(private userservice: UserService, private router: Router) {

  }

  login() {
    this.userservice.login(this.user.username, this.user.password).subscribe({
      next: (res) => {
        console.log('Login Response', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['ViewTasks']);
      },
      error: () => {
        this.errorMessage = 'Invalid login credentials';
      }
    })
  }
  

}
