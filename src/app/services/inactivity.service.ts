import { Injectable, NgZone } from '@angular/core';
import {Router} from '@angular/router'
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root'})
export class InactivityService {
    private timeoutId: any;
    private warningTimeoutId: any;
    private activityHandler = this.resetTimers.bind(this);
    private readonly timeout = 30 * 1000;
    private readonly warningTime = 15 * 1000;

    constructor(private router: Router, private ngZone: NgZone, private userService: UserService) {

    }

    startMonitoring() {
        console.log("Monitoring started!");
        this.resetTimers();
        ['mousemove', 'keydown', 'click', 'scroll'].forEach(event => 
            window.addEventListener(event, this.activityHandler)
        );
    }

    stopMonitoring() {
        clearTimeout(this.timeoutId);
        clearTimeout(this.warningTimeoutId);

        ['mousemove', 'keydown', 'click', 'scroll'].forEach(event =>
        window.removeEventListener(event, this.activityHandler)
  );

  console.log('Inactivity monitoring stopped');

    }

    resetTimers() {

        clearTimeout(this.warningTimeoutId);
        clearTimeout(this.timeoutId);

        this.warningTimeoutId = setTimeout(() => {
        this.showWarningModal(); 
        }, this.warningTime); 

        this.timeoutId = setTimeout(() => {
        this.forceLogout(); 
        }, this.timeout); 
    };
    

  showWarningModal() {
  alert("Session is about to expire in 30 seconds. You will be logged out unless you stay active.");
    
  }

  forceLogout() {
    this.stopMonitoring();
    localStorage.clear();
    console.log("user forcibly logged out due to inactivity");
    this.router.navigate(['/login'], {
        queryParams: {reason: 'inactive'}
    });
  }

}
