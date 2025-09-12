import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ScrollHelperService } from './app/shared/services/scroll-helper.service';

/**
 * DEBUG LOGGER - Save all debug output to a downloadable file
 */
class DebugLogger {
  private static logs: string[] = [];
  private static timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  static log(message: string): void {
    const timestampedMessage = `[${new Date().toISOString()}] ${message}`;
    console.log(timestampedMessage);
    this.logs.push(timestampedMessage);
  }

  static saveToFile(): void {
    const logContent = this.logs.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `background-debug-${this.timestamp}.log`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('Debug log saved to file:', a.download);
  }

  static getLogs(): string[] {
    return [...this.logs];
  }

  static setupAutoSave(): void {
    // Auto-save after 10 seconds
    setTimeout(() => {
      this.saveToFile();
    }, 10000);

    // Also save on window beforeunload
    window.addEventListener('beforeunload', () => {
      this.saveToFile();
    });

    // Add manual save button to page
    document.addEventListener('DOMContentLoaded', () => {
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save Debug Log';
      saveButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 10000;
        padding: 8px 16px;
        background: #ff0000;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-family: monospace;
      `;
      saveButton.onclick = () => this.saveToFile();
      document.body.appendChild(saveButton);
    });
  }
}

/**
 * DEBUG: Early background debugging at main.ts level with file logging
 * This will help identify if there are any early style issues
 */
function debugEarlyStyles(): void {
  DebugLogger.log('=== EARLY STYLES DEBUG (MAIN.TS) ===');
  
  // Check initial document state
  const checkStyles = () => {
    const html = document.documentElement;
    const body = document.body;
    
    DebugLogger.log(`Early HTML background: ${getComputedStyle(html).backgroundColor}`);
    DebugLogger.log(`Early BODY background: ${getComputedStyle(body).backgroundColor}`);
    DebugLogger.log(`Document ready state: ${document.readyState}`);
    DebugLogger.log(`Total stylesheets loaded: ${document.styleSheets.length}`);
    
    // List all stylesheets
    Array.from(document.styleSheets).forEach((sheet, index) => {
      DebugLogger.log(`Stylesheet ${index}: ${sheet.href || 'inline'}`);
    });
  };
  
  // Check immediately
  checkStyles();
  
  // Check on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      DebugLogger.log('=== DOM CONTENT LOADED - STYLES CHECK ===');
      checkStyles();
    });
  }
  
  // Check on window load (all resources loaded)
  window.addEventListener('load', () => {
    DebugLogger.log('=== WINDOW LOADED - FINAL STYLES CHECK ===');
    checkStyles();
  });
  
  // Force white background as early as possible
  document.addEventListener('DOMContentLoaded', () => {
    DebugLogger.log('FORCING HTML/BODY WHITE BACKGROUND EARLY');
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
    DebugLogger.log('Early forced backgrounds applied');
  });

  // Setup auto-save functionality
  DebugLogger.setupAutoSave();
  
  // Make DebugLogger globally accessible
  (window as any).DebugLogger = DebugLogger;
}

// Run early debugging
debugEarlyStyles();

// Update the configuration to include animations
const updatedConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideAnimations(),
    ScrollHelperService
  ]
};

bootstrapApplication(AppComponent, updatedConfig)
  .catch((err) => console.error(err));
