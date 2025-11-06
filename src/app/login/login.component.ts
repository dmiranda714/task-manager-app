import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { InactivityService } from '../services/inactivity.service';


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

  constructor(private userservice: UserService, private router: Router, private inactivityService: InactivityService, private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if(params['reason'] === 'inactive') {
        this.errorMessage = 'You were logged out due to inactivity';
      }
    })
  }

  login() {
    this.userservice.login(this.user.username, this.user.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.inactivityService.startMonitoring();
        this.router.navigate(['ViewTasks']);
      },
      error: () => {
        this.errorMessage = 'Invalid login credentials';
      }
    })
  }
  

}
