import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { InactivityService } from './services/inactivity.service';
import { AuthService } from './services/auth.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'todoapp';

}
