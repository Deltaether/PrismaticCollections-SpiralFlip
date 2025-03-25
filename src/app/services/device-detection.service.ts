import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService {
  private mobileCheckDone = false;
  
  // 【✓】 Screen size breakpoints
  private readonly SCREEN_SIZES = {
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
    const height = window.innerHeight;
    const aspect = width / height;

    if (aspect > this.SCALE_THRESHOLDS.ULTRAWIDE) {
      return 'ULTRAWIDE';
    } else if (width >= this.SCREEN_SIZES.UHD_4K.width) {
      return '4K';
    } else if (width >= this.SCREEN_SIZES.QHD.width) {
      return 'QHD';
    } else if (width >= this.SCREEN_SIZES.FULL_HD.width) {
      return 'FULL_HD';
    } else {
      return 'HD';
    }
  }

  // 【✓】 Calculate optimal scale for current screen
  public getOptimalScale(): number {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;
    
    // Base scale calculation on target 16:9 aspect ratio
    let scale = 1.0;
    
    // Adjust scale based on screen category
    if (aspect > this.SCALE_THRESHOLDS.ULTRAWIDE) {
      scale = 1.2; // Ultra-wide needs larger scale
    } else if (width >= this.SCREEN_SIZES.QHD.width) {
      scale = 1.15; // QHD and 4K
    } else if (width >= this.SCREEN_SIZES.FULL_HD.width) {
      scale = 1.1; // Full HD
    } else if (width <= this.SCREEN_SIZES.HD.width) {
      scale = 0.95; // HD and below
    }
    
    // Adjust for extreme aspect ratios
    if (Math.abs(aspect - this.TARGET_ASPECT_RATIO) > 0.4) {
      scale *= 1.1; // Increase scale for very wide or tall screens
    }
    
    return scale;
  }

  // 【✓】 Check if current screen needs aspect ratio correction
  public needsAspectRatioCorrection(): boolean {
    const aspect = window.innerWidth / window.innerHeight;
    return Math.abs(aspect - this.TARGET_ASPECT_RATIO) > 0.2;
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
    // Get current viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Check for mobile/tablet user agent
    const isMobileDevice = this.isMobileDevice();
    
    // Check for touch capability
    const isTouchDevice = this.isTouchDevice();
    
    // Use mobile view ONLY if:
    // 1. It's a mobile device AND viewport width is below tablet threshold OR
    // 2. Viewport width is below mobile threshold
    return (isMobileDevice && viewportWidth <= this.TABLET_MAX_WIDTH) || 
           (viewportWidth <= this.MOBILE_MAX_WIDTH);
  }

  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipod|blackberry|iemobile|opera mini/.test(userAgent) && 
           !/tablet|ipad|playbook|silk/.test(userAgent);
  }

  private isSmallViewport(): boolean {
    return window.innerWidth <= this.MOBILE_MAX_WIDTH || 
           window.innerHeight <= this.MOBILE_MAX_HEIGHT;
  }

  private isTouchDevice(): boolean {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           ((navigator as any).msMaxTouchPoints > 0);
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