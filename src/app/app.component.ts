import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
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
export class AppComponent implements OnInit, OnDestroy {
  title = 'Phantasia Testing Site';
  private globalStyleObserver?: MutationObserver;
  
  constructor(
    public authService: AuthService,
    @Inject(DOCUMENT) private document: Document
  ) {}
  
  ngOnInit(): void {
    // Access the global DebugLogger from window
    const DebugLogger = (window as any).DebugLogger;
    if (DebugLogger) {
      DebugLogger.log('=== APP COMPONENT INITIALIZED ===');
    } else {
      console.log('=== APP COMPONENT INITIALIZED ===');
    }
    
    // Global debugging immediately on app initialization
    setTimeout(() => {
      this.debugGlobalStyles();
    }, 50);
    
    // Setup global style watching
    this.setupGlobalStyleWatching();
  }
  
  ngOnDestroy(): void {
    if (this.globalStyleObserver) {
      this.globalStyleObserver.disconnect();
    }
  }
  
  /**
   * Debug global styles at app component level
   */
  private debugGlobalStyles(): void {
    const DebugLogger = (window as any).DebugLogger;
    const log = DebugLogger ? DebugLogger.log.bind(DebugLogger) : console.log.bind(console);
    
    const html = this.document.documentElement;
    const body = this.document.body;
    
    log('=== GLOBAL STYLES DEBUG (APP COMPONENT) ===');
    log(`HTML background-color: ${getComputedStyle(html).backgroundColor}`);
    log(`HTML background: ${getComputedStyle(html).background}`);
    log(`BODY background-color: ${getComputedStyle(body).backgroundColor}`);
    log(`BODY background: ${getComputedStyle(body).background}`);
    
    // Check for any inline styles
    log(`HTML inline styles: ${html.getAttribute('style') || 'none'}`);
    log(`BODY inline styles: ${body.getAttribute('style') || 'none'}`);
    
    // Check for dynamic CSS variables
    log('CSS Custom Properties on :root:');
    const rootStyles = getComputedStyle(html);
    const propertyNames = Array.from(rootStyles);
    const customProps = propertyNames.filter(name => name.startsWith('--'));
    customProps.forEach(prop => {
      log(`  ${prop}: ${rootStyles.getPropertyValue(prop)}`);
    });
  }
  
  /**
   * Setup global style watching for HTML and BODY changes
   */
  private setupGlobalStyleWatching(): void {
    const elementsToWatch = [this.document.documentElement, this.document.body];
    
    this.globalStyleObserver = new MutationObserver((mutations) => {
      const DebugLogger = (window as any).DebugLogger;
      const log = DebugLogger ? DebugLogger.log.bind(DebugLogger) : console.log.bind(console);
      
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
          log(`GLOBAL STYLE CHANGE DETECTED: ${JSON.stringify({
            element: (mutation.target as Element).tagName,
            attribute: mutation.attributeName,
            oldValue: mutation.oldValue,
            newValue: (mutation.target as Element).getAttribute(mutation.attributeName || '')
          })}`);
          
          // Re-debug styles after change
          setTimeout(() => {
            log('=== AFTER GLOBAL STYLE CHANGE ===');
            this.debugGlobalStyles();
          }, 10);
        }
      });
    });
    
    elementsToWatch.forEach(element => {
      this.globalStyleObserver?.observe(element, {
        attributes: true,
        attributeOldValue: true,
        attributeFilter: ['style', 'class']
      });
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
} 