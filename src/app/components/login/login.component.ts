import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <input 
              type="text" 
              id="username"
              [(ngModel)]="username"
              name="username"
              placeholder="Username"
              autocomplete="username"
              required
            >
          </div>
          
          <div class="form-group">
            <input 
              type="password" 
              id="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Password"
              autocomplete="current-password"
              required
            >
          </div>
          
          @if (errorMessage()) {
            <div class="error-message">
              {{ errorMessage() }}
            </div>
          }
          
          <button type="submit" class="login-button" [disabled]="isLoading()">
            @if (isLoading()) {
              ...
            } @else {
              →
            }
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      border-radius: 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.1);
      padding: 32px;
      max-width: 320px;
      width: 100%;
    }
    
    .form-group {
      margin-bottom: 16px;
    }
    
    .form-group input {
      width: 100%;
      padding: 16px;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
      transition: all 0.2s ease;
      background: rgba(255, 255, 255, 0.8);
    }
    
    .form-group input::placeholder {
      color: rgba(0,0,0,0.4);
    }
    
    .form-group input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.3);
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
    }
    
    .error-message {
      background: rgba(255, 107, 107, 0.9);
      color: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 16px;
      text-align: center;
      font-size: 14px;
    }
    
    .login-button {
      width: 100%;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 16px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 8px;
    }
    
    .login-button:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }
    
    .login-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  
  constructor(private authService: AuthService) {}
  
  onLogin(): void {
    if (!this.username || !this.password) {
      this.errorMessage.set('Please enter both username and password');
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      const success = this.authService.login(this.username, this.password);
      
      if (!success) {
        this.errorMessage.set('Invalid username or password');
        this.password = ''; // Clear password field
      }
      
      this.isLoading.set(false);
    }, 500);
  }
}