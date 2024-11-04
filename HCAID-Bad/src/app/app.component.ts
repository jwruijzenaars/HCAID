import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'HCAID-Bad';
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  logout() {
    this.authService.logout();
    alert("Logged out successfully!");
  }
}
