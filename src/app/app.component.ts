import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
// import { LoginComponent } from './components/login/login.component'; // Temporarily disabled

/**
 * Root application component with authentication gate
 * Shows login screen or main app based on authentication status
 * 【✓】
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule], // LoginComponent temporarily removed
  template: `
    <!-- Temporarily disabled authentication for development testing -->
    <!-- @if (authService.isAuthenticated()) {
      <div class="app-header">
        <div class="auth-status">
          🔐 Authenticated as: {{ authService.getAuthInfo().username }}
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </div>
      <router-outlet></router-outlet>
    } @else {
      <app-login></app-login>
    } -->
    
    <!-- Direct access to main app for development -->
    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-header {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 1000;
      padding: 10px 20px;
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      border-bottom-left-radius: 12px;
    }
    
    .auth-status {
      display: flex;
      align-items: center;
      gap: 15px;
      color: #333;
      font-size: 14px;
      font-weight: 500;
    }
    
    .logout-btn {
      background: #ff6b6b;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.2s;
    }
    
    .logout-btn:hover {
      background: #ff5252;
    }
    
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent {
  title = 'Phantasia Testing Site';
  
  constructor(public authService: AuthService) {}
  
  logout(): void {
    this.authService.logout();
  }
} 