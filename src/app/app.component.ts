import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';

/**
 * Root application component with authentication gate
 * Shows login screen or main app based on authentication status
 * 【✓】
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoginComponent],
  template: `
    @if (authService.isAuthenticated()) {
      <router-outlet></router-outlet>
    } @else {
      <app-login></app-login>
    }
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Phantasia Testing Site';
  
  constructor(
    public authService: AuthService
  ) {}
  
  logout(): void {
    this.authService.logout();
  }
} 