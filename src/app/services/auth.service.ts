import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly CORRECT_USERNAME = 'SpiralFlipFlop';
  private readonly CORRECT_PASSWORD = 'FlippyFloppoTesty##';
  private readonly AUTH_KEY = 'phantasia_authenticated';
  
  // Signal to track authentication status
  isAuthenticated = signal<boolean>(false);
  
  constructor(private router: Router) {
    // Check if user is already authenticated on service init
    this.checkAuthStatus();
  }
  
  private checkAuthStatus(): void {
    const isAuth = localStorage.getItem(this.AUTH_KEY) === 'true';
    this.isAuthenticated.set(isAuth);
  }
  
  login(username: string, password: string): boolean {
    if (username === this.CORRECT_USERNAME && password === this.CORRECT_PASSWORD) {
      localStorage.setItem(this.AUTH_KEY, 'true');
      this.isAuthenticated.set(true);
      return true;
    } else {
      this.isAuthenticated.set(false);
      return false;
    }
  }
  
  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
  }
  
  getAuthInfo(): { username: string; password: string; url: string } {
    return {
      username: '',
      password: '',
      url: 'http://212.227.85.148/'
    };
  }
}