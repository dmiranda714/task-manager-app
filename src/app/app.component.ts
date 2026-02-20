import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from './services/auth.service';

declare const gapi: any;
declare const google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todoapp';
  selectedLang = 'en';
  gapiInitialized = false;
  tokenClient: any;
  isTokenClientReady = false;

  constructor(private translate: TranslateService, private authService: AuthService) {
    (window as any).ngAuthService = authService;
    translate.setDefaultLang('en');
  }

  ngOnInit() {
  const interval = setInterval(() => {
    if ((window as any).tokenClient) {
      this.isTokenClientReady = true;
      clearInterval(interval);
    }
  }, 500);
}

   signInWithGoogle() {
    const tokenClient = (window as any).tokenClient;
    if (!tokenClient) {
      console.error("Token client not initialized yet");
      return;
    }

    if (gapi.client.getToken() === null) {
      console.log("No token yet, requesting with consent prompt...");
      tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      console.log("Token already present, requesting silently...");
      tokenClient.requestAccessToken({ prompt: "" });
    }
}

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }
}
