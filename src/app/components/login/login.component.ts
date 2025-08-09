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
        <div class="login-header">
          <h1>🔐 Phantasia Testing Site</h1>
          <p>Access Restricted - Please Login</p>
        </div>
        
        <form (ngSubmit)="onLogin()" class="login-form">
          <div class="form-group">
            <label for="username">Username:</label>
            <input 
              type="text" 
              id="username"
              [(ngModel)]="username"
              name="username"
              autocomplete="username"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password:</label>
            <input 
              type="password" 
              id="password"
              [(ngModel)]="password"
              name="password"
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
              Logging in...
            } @else {
              Login
            }
          </button>
        </form>
        
        <div class="auth-info">
          <h3>🔐 Authentication Info:</h3>
          <p><strong>URL:</strong> {{ authInfo.url }}</p>
          <p><strong>Username:</strong> {{ authInfo.username }}</p>
          <p><strong>Password:</strong> {{ authInfo.password }}</p>
        </div>
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
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      padding: 40px;
      max-width: 400px;
      width: 100%;
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-header h1 {
      color: #333;
      font-size: 24px;
      margin-bottom: 10px;
    }
    
    .login-header p {
      color: #666;
      margin: 0;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 5px;
      color: #333;
      font-weight: 500;
    }
    
    .form-group input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 16px;
      box-sizing: border-box;
      transition: border-color 0.3s;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .error-message {
      background: #ff6b6b;
      color: white;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .login-button {
      width: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    .login-button:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    
    .login-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    .auth-info {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }
    
    .auth-info h3 {
      margin: 0 0 15px 0;
      color: #333;
      font-size: 16px;
    }
    
    .auth-info p {
      margin: 5px 0;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      color: #555;
    }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  
  authInfo = this.authService.getAuthInfo();
  
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