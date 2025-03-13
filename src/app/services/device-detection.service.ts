import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {
  private mobileCheckDone = false;
  private readonly MOBILE_WIDTH_THRESHOLD = 768; // Standard mobile breakpoint
  private readonly TABLET_WIDTH_THRESHOLD = 1024; // Standard tablet breakpoint

  // Debug mode flag - turn on to see detailed logging
  private isDebugMode = true;

  constructor(private router: Router) {
    this.debugLog('DeviceDetectionService initialized');
  }

  detectMobile(): void {
    this.debugLog('Detecting mobile device...', {
      isMobileDevice: this.isMobileDevice(),
      isSmallScreen: this.isSmallScreen(),
      currentUrl: this.router.url,
      mobileCheckDone: this.mobileCheckDone
    });
    
    // Don't prevent repeated checks so switching back works properly
    // this.mobileCheckDone = true;

    // If URL explicitly includes 'introduction', we should be in desktop mode
    if (this.router.url.includes('/introduction')) {
      this.debugLog('URL contains /introduction - staying in desktop mode');
      return;
    }

    // If we're in a desktop route but have mobile parameters, send to mobile
    if (this.shouldUseMobileView() && !this.isOnMobilePath()) {
      // Navigate to mobile view
      this.debugLog('Redirecting to mobile view from', this.router.url);
      this.router.navigate(['/mobile']);
    }
    
    // If we're in a mobile route but have desktop parameters, send to desktop
    if (!this.shouldUseMobileView() && this.isOnMobilePath()) {
      this.debugLog('Redirecting to desktop view from', this.router.url);
      this.router.navigate(['/introduction']);
    }
  }

  private isOnMobilePath(): boolean {
    // Check if current URL path is already the mobile path
    const isMobile = this.router.url.includes('/mobile');
    this.debugLog('isOnMobilePath check:', isMobile, 'URL:', this.router.url);
    return isMobile;
  }

  private isMobileDevice(): boolean {
    // Check for common mobile user agent patterns
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // RegExp pattern for mobile devices
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    
    const result = mobileRegex.test(userAgent);
    this.debugLog('isMobileDevice check:', result, 'UserAgent:', userAgent);
    return result;
  }

  private isSmallScreen(): boolean {
    // Check if screen dimensions are below our threshold
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // More reasonable threshold based on standard breakpoints
    const isSmall = width < this.MOBILE_WIDTH_THRESHOLD;
    
    this.debugLog('Screen size check:', {width, height, isSmall});
    return isSmall;
  }

  shouldUseMobileView(): boolean {
    // Check if Chrome DevTools is open with a mobile device emulation
    const isDevToolsMobile = /Android|webOS|iPhone|iPad|iPod/.test(navigator.userAgent) && 
                             /Chrome\//.test(navigator.userAgent) && 
                             /Google Inc/.test(navigator.vendor);
    
    // For mobile devices/small screens return true
    const result = this.isMobileDevice() || this.isSmallScreen();
    
    this.debugLog('shouldUseMobileView result:', result, {
      isMobileDevice: this.isMobileDevice(),
      isSmallScreen: this.isSmallScreen(),
      screen: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
    
    return result;
  }
  
  // Helper function for conditional logging
  private debugLog(...args: any[]): void {
    if (this.isDebugMode) {
      console.log('[DeviceDetection]', ...args);
    }
  }
} 