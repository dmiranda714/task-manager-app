import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { InactivityService } from './services/inactivity.service';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'todoapp';

  selectedLang = 'en';

 constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
  }

  switchLanguage(lang: string) {
    this.translate.use(lang);
  }

}




