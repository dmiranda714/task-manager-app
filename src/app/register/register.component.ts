import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  user: User = {
    username: '',
    password: '',
    role: 'viewer'
  }

  message = '';

  constructor(private userservice: UserService, private router: Router) {

  }

  onSubmit() {
     this.userservice.addUser(this.user).subscribe({
        next: () => {
          alert('User added!');
          this.router.navigate(['']);
        },
        error: () => {
          alert('Failed to add User');
        }
      });
  }

}
