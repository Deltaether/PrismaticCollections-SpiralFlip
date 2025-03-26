import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {
  private mobileCheckDone = false;
  
  // 【✓】 Screen size breakpoints
  private readonly SCREEN_SIZES = {
    MOBILE: { width: 768, height: 1024 },
    TABLET: { width: 1024, height: 1366 },
    HD: { width: 1366, height: 768 },
    FULL_HD: { width: 1920, height: 1080 },
    QHD: { width: 2560, height: 1440 },
    UHD_4K: { width: 3840, height: 2160 },
    ULTRAWIDE: { width: 3440, height: 1440 }
  };

  // Mobile/Tablet thresholds
  private readonly MOBILE_MAX_WIDTH = 768;
  private readonly MOBILE_MAX_HEIGHT = 1024;
  private readonly TABLET_MAX_WIDTH = 1024;
  private readonly MIN_DESKTOP_WIDTH = 1024;

  // Target aspect ratio for desktop (16:9)
  private readonly TARGET_ASPECT_RATIO = 16 / 9;
  
  // Scaling thresholds
  private readonly SCALE_THRESHOLDS = {
    ULTRAWIDE: 21/9,  // Ultra-wide aspect ratio
    QHD: 2560,        // 1440p
    FULL_HD: 1920,    // 1080p
    HD: 1366          // 720p
  };

  // Debug mode flag - turn on to see detailed logging
  private isDebugMode = true;

  constructor(private router: Router) {
    this.debugLog('DeviceDetectionService initialized');
  }

  // 【✓】 Get current screen category
  public getScreenCategory(): string {
    const width = window.innerWidth;
    
    // Debug logging
    console.log('[Device Detection] Getting screen category for width:', width);
    
    // Mobile devices (phones)
    if (width <= 480) {
      return 'MOBILE';
    }
    
    // Tablets
    if (width <= 768) {
      return 'TABLET';
    }
    
    // All other sizes are desktop
    return 'DESKTOP';
  }

  // 【✓】 Calculate optimal scale for current screen
  public getOptimalScale(): number {
    // Always return 1 to maintain consistent size
    return 1;
  }

  // 【✓】 Check if current screen needs aspect ratio correction
  public needsAspectRatioCorrection(): boolean {
    // No aspect ratio correction needed as we're maintaining fixed size
    return false;
  }

  detectMobile(): void {
    this.debugLog('Detecting mobile device...', {
      isMobileDevice: this.isMobileDevice(),
      isSmallScreen: this.isSmallViewport(),
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

  public shouldUseMobileView(): boolean {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Debug logging
    console.log('[Device Detection] Viewport:', viewportWidth, 'x', viewportHeight);
    console.log('[Device Detection] Current Route:', this.router.url);
    
    // Force desktop view for 1920x1080 screens
    if (viewportWidth === 1920 && viewportHeight === 1080) {
      console.log('[Device Detection] Detected 1920x1080 screen - forcing desktop view');
      return false;
    }
    
    // Check if we're already on the introduction route
    if (this.router.url.includes('/introduction')) {
      console.log('[Device Detection] Already on introduction route - staying in desktop view');
      return false;
    }
    
    // Simple mobile detection based on width
    const isMobile = viewportWidth <= 768;
    console.log('[Device Detection] Is Mobile:', isMobile);
    return isMobile;
  }

  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Debug logging
    console.log('[Device Detection] User Agent:', userAgent);
    
    // Check for mobile devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Additional check for tablet devices
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(userAgent.toLowerCase());
    
    console.log('[Device Detection] Is Mobile:', isMobile);
    console.log('[Device Detection] Is Tablet:', isTablet);
    
    return isMobile || isTablet;
  }

  private isSmallViewport(): boolean {
    return window.innerWidth <= this.MOBILE_MAX_WIDTH || 
           window.innerHeight <= this.MOBILE_MAX_HEIGHT;
  }

  private isTouchDevice(): boolean {
    // Modern way to detect touch devices
    const hasTouch = 'ontouchstart' in window || 
                    navigator.maxTouchPoints > 0;
    
    console.log('[Device Detection] Is Touch Device:', hasTouch);
    return hasTouch;
  }

  public getOrientation(): 'portrait' | 'landscape' {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  public isTablet(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    const viewportWidth = window.innerWidth;
    return isTablet || (viewportWidth > this.MOBILE_MAX_WIDTH && viewportWidth <= this.TABLET_MAX_WIDTH);
  }
  
  // Helper function for conditional logging
  private debugLog(...args: any[]): void {
    if (this.isDebugMode) {
      console.log('[DeviceDetection]', ...args);
    }
  }
} 