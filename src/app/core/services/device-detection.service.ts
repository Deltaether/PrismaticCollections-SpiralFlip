import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject, fromEvent } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface ViewportDimensions {
  readonly width: number;
  readonly height: number;
  readonly aspectRatio: number;
}

// 【✓】 Define screen categories with union type
type ScreenCategory = 'MOBILE' | 'TABLET' | 'DESKTOP';

// 【✓】 Define device configuration
interface DeviceConfig {
  readonly minWidth: number;
  readonly maxWidth: number;
  readonly category: ScreenCategory;
}

// 【✓】 Define screen size configuration
interface ScreenSize {
  readonly width: number;
  readonly height: number;
}

// 【✓】 Define viewport orientation
type Orientation = 'portrait' | 'landscape';

// 【✓】 Define device detection events
type DeviceEvent = 'resize' | 'orientationchange' | 'viewportUpdate';

@Injectable({
  providedIn: 'root'
})
export class DeviceDetectionService implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  private readonly mobileCheckDone = false;
  private readonly STORAGE_KEY = 'prismatic_collections_site_version_preference';
  
  // 【✓】 Consolidated constants for better maintainability
  private readonly CONSTANTS = {
    RESOLUTION: {
      FULL_HD_WIDTH: 1920,
      FULL_HD_HEIGHT: 1080
    },
    ASPECT_RATIO: {
      TARGET: 16 / 9,
      TOLERANCE: 0.2 // 20% tolerance
    },
    BREAKPOINTS: {
      MOBILE_MAX: 768,
      TABLET_MIN: 769,
      TABLET_MAX: 1024,
      DESKTOP_MIN: 1025
    },
    SCREEN_SIZES: {
      MOBILE: { width: 768, height: 1024 } as ScreenSize,
      TABLET: { width: 1024, height: 1366 } as ScreenSize,
      HD: { width: 1366, height: 768 } as ScreenSize,
      FULL_HD: { width: 1920, height: 1080 } as ScreenSize,
      QHD: { width: 2560, height: 1440 } as ScreenSize,
      UHD_4K: { width: 3840, height: 2160 } as ScreenSize,
      ULTRAWIDE: { width: 3440, height: 1440 } as ScreenSize
    }
  };

  // 【✓】 Device configurations for categorization
  private readonly DEVICE_CONFIGS: ReadonlyArray<DeviceConfig> = [
    { minWidth: 0, maxWidth: this.CONSTANTS.BREAKPOINTS.MOBILE_MAX, category: 'MOBILE' },
    { minWidth: this.CONSTANTS.BREAKPOINTS.TABLET_MIN, maxWidth: this.CONSTANTS.BREAKPOINTS.TABLET_MAX, category: 'TABLET' },
    { minWidth: this.CONSTANTS.BREAKPOINTS.DESKTOP_MIN, maxWidth: Infinity, category: 'DESKTOP' }
  ];
  
  // 【✓】 Viewport dimensions with default values
  private readonly viewportSubject = new BehaviorSubject<ViewportDimensions>({
    width: window.innerWidth,
    height: window.innerHeight,
    aspectRatio: window.innerWidth / window.innerHeight
  });
  
  // 【✓】 Create cache-optimized observable for viewport dimensions
  readonly viewportDimensions$ = this.viewportSubject.asObservable().pipe(
    shareReplay(1)
  );
  
  // 【✓】 Device type subject with initial value
  private readonly deviceTypeSubject = new BehaviorSubject<ScreenCategory>(this.detectScreenCategory());
  
  // 【✓】 Create cache-optimized observable for device type
  readonly deviceType$ = this.deviceTypeSubject.asObservable().pipe(
    shareReplay(1)
  );
  
  // 【✓】 Create observable for mobile view detection
  readonly shouldUseMobileView$ = this.viewportDimensions$.pipe(
    map(() => this.shouldUseMobileView()),
    distinctUntilChanged(),
    shareReplay(1)
  );
  
  // 【✓】 Create observable for orientation changes
  readonly orientation$ = this.viewportDimensions$.pipe(
    map(() => this.getOrientation()),
    distinctUntilChanged(),
    shareReplay(1)
  );

  constructor(private readonly router: Router) {
    this.debugLog('DeviceDetectionService initialized');
    this.setupResizeListener();
    this.logInitialState();
  }

  // 【✓】 Setup resize listener with debounce
  private setupResizeListener(): void {
    // Listen for window resize events
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateViewportDimensions();
      });
    
    // Listen for orientation change events on mobile devices
    fromEvent(window, 'orientationchange')
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Add small delay to ensure dimensions are updated after orientation change
        setTimeout(() => this.updateViewportDimensions(), 100);
      });
  }

  // 【✓】 Log initial state for debugging
  private logInitialState(): void {
    if (this.isDebugMode) {
      const dimensions = this.getViewportDimensions();
      this.debugLog('Initialized with viewport:', dimensions);
      this.debugLog('Initial screen category:', this.getScreenCategory());
      this.debugLog('Should use mobile view:', this.shouldUseMobileView());
      this.debugLog('Device detection:', {
        isMobileDevice: this.isMobileDevice(),
        isTablet: this.isTablet(),
        isTouchDevice: this.isTouchDevice(),
        orientation: this.getOrientation()
      });
    }
  }

  // 【✓】 Update viewport dimensions
  private updateViewportDimensions(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspectRatio = width / height;
    
    const dimensions: ViewportDimensions = { width, height, aspectRatio };
    this.viewportSubject.next(dimensions);
    
    // Update device type when viewport changes
    this.deviceTypeSubject.next(this.detectScreenCategory());
    
    if (this.isDebugMode) {
      this.debugLog('Viewport updated:', dimensions);
      this.debugLog('New screen category:', this.getScreenCategory());
      this.debugLog('Should use mobile view:', this.shouldUseMobileView());
    }
  }

  // 【✓】 Detect screen category based on viewport width
  private detectScreenCategory(): ScreenCategory {
    const width = window.innerWidth;
    const matchingConfig = this.DEVICE_CONFIGS.find(
      config => width >= config.minWidth && width <= config.maxWidth
    );
    return matchingConfig?.category || 'DESKTOP';
  }

  // 【✓】 Check if aspect ratio is acceptable with tolerance
  private isAcceptableAspectRatio(currentRatio: number): boolean {
    const targetRatio = this.CONSTANTS.ASPECT_RATIO.TARGET;
    const tolerance = this.CONSTANTS.ASPECT_RATIO.TOLERANCE;
    
    // Calculate ratio difference, ensuring we get consistent results regardless of which is larger
    const ratio = currentRatio > targetRatio 
      ? currentRatio / targetRatio 
      : targetRatio / currentRatio;
    
    const isAcceptable = ratio <= (1 + tolerance);
    
    if (this.isDebugMode) {
      this.debugLog(`Aspect ratio check: ${currentRatio.toFixed(3)} vs target ${targetRatio.toFixed(3)}`);
      this.debugLog(`Ratio difference: ${ratio.toFixed(3)}, acceptable: ${isAcceptable}`);
    }
    
    return isAcceptable;
  }

  // 【✓】 Public API - Get current viewport dimensions
  getViewportDimensions(): ViewportDimensions {
    return this.viewportSubject.value;
  }

  // 【✓】 Public API - Get viewport dimensions as observable
  getViewportDimensionsObservable(): Observable<ViewportDimensions> {
    return this.viewportDimensions$;
  }

  // 【✓】 Public API - Get current screen category
  getScreenCategory(): ScreenCategory {
    return this.deviceTypeSubject.value;
  }

  // 【✓】 Public API - Get screen category as observable
  getScreenCategoryObservable(): Observable<ScreenCategory> {
    return this.deviceType$;
  }

  // 【✓】 Public API - Check if mobile view should be used
  shouldUseMobileView(): boolean {
    // First check if user has a stored preference
    const storedPreference = localStorage.getItem(this.STORAGE_KEY);
    
    if (storedPreference) {
      if (this.isDebugMode) {
        this.debugLog('Found stored preference:', storedPreference);
      }
      return storedPreference === 'mobile';
    }
    
    const dimensions = this.getViewportDimensions();
    const screenCategory = this.getScreenCategory();
    
    // Force desktop view for exact 1920x1080 resolution
    if (dimensions.width === this.CONSTANTS.RESOLUTION.FULL_HD_WIDTH && 
        dimensions.height === this.CONSTANTS.RESOLUTION.FULL_HD_HEIGHT) {
      return false;
    }
    
    // Always use mobile view for mobile and tablet devices
    if (screenCategory === 'MOBILE' || screenCategory === 'TABLET') {
      return true;
    }
    
    // Check if DevTools is open in Chrome - this changes aspect ratio but shouldn't trigger view change
    const isDevToolsLikelyOpen = this.isDevToolsOpen();
    if (isDevToolsLikelyOpen) {
      this.debugLog('DevTools likely open, maintaining current view state');
      // Return the current route-based state to prevent switching
      return this.isOnMobilePath();
    }
    
    // For desktop, check if the aspect ratio is acceptable
    const hasAcceptableRatio = this.isAcceptableAspectRatio(dimensions.aspectRatio);
    
    if (this.isDebugMode) {
      this.debugLog('View detection:', {
        screenCategory,
        viewport: `${dimensions.width}x${dimensions.height}`,
        aspectRatio: dimensions.aspectRatio.toFixed(3),
        isFullHD: this.isFullHDScreen(),
        hasAcceptableRatio,
        isDevToolsLikelyOpen,
        shouldUseMobile: !hasAcceptableRatio && !isDevToolsLikelyOpen
      });
    }
    
    return !hasAcceptableRatio && !isDevToolsLikelyOpen;
  }
  
  // 【✓】 Check if DevTools is likely open based on window props and dimensions
  private isDevToolsOpen(): boolean {
    // Common DevTools detection approaches
    const dimensions = this.getViewportDimensions();
    
    // 1. Check for sudden aspect ratio change
    const suddenAspectRatioChange = window.outerHeight / window.outerWidth < 0.7 &&
                                  dimensions.aspectRatio < 0.75;
                                  
    // 2. Check for window resize difference
    const windowResized = window.outerWidth !== window.innerWidth && 
                         (window.outerWidth - window.innerWidth) > 200;
                         
    return suddenAspectRatioChange || windowResized;
  }

  // 【✓】 Public API - Get optimal scale factor for the current viewport
  getOptimalScale(): number {
    const dimensions = this.getViewportDimensions();
    const targetWidth = this.CONSTANTS.RESOLUTION.FULL_HD_WIDTH;
    const targetHeight = this.CONSTANTS.RESOLUTION.FULL_HD_HEIGHT;
    
    const widthScale = dimensions.width / targetWidth;
    const heightScale = dimensions.height / targetHeight;
    
    // Use the smaller scale factor to ensure content fits within viewport
    const scale = Math.min(widthScale, heightScale);
    
    if (this.isDebugMode) {
      this.debugLog('Optimal scale calculation:', {
        targetDimensions: `${targetWidth}x${targetHeight}`,
        viewportDimensions: `${dimensions.width}x${dimensions.height}`,
        widthScale: widthScale.toFixed(3),
        heightScale: heightScale.toFixed(3),
        optimalScale: scale.toFixed(3)
      });
    }
    
    return scale;
  }

  // 【✓】 Check if screen is full HD
  private isFullHDScreen(): boolean {
    const { width, height } = this.getViewportDimensions();
    return width === this.CONSTANTS.RESOLUTION.FULL_HD_WIDTH && 
           height === this.CONSTANTS.RESOLUTION.FULL_HD_HEIGHT;
  }

  // 【✓】 Check if aspect ratio correction is needed
  needsAspectRatioCorrection(): boolean {
    return !this.isAcceptableAspectRatio(this.getViewportDimensions().aspectRatio);
  }

  // 【✓】 Detect mobile device and handle navigation
  detectMobile(): void {
    this.debugLog('Detecting mobile device...', {
      isMobileDevice: this.isMobileDevice(),
      isSmallScreen: this.isSmallViewport(),
      currentUrl: this.router.url
    });
    
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

  // 【✓】 Check if current path is mobile
  private isOnMobilePath(): boolean {
    // Check if current URL path is already the mobile path
    const isMobile = this.router.url.includes('/mobile');
    this.debugLog('isOnMobilePath check:', isMobile, 'URL:', this.router.url);
    return isMobile;
  }

  // 【✓】 Detect mobile device using user agent
  private isMobileDevice(): boolean {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Check for mobile devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Additional check for tablet devices
    const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobi))/i.test(userAgent.toLowerCase());
    
    if (this.isDebugMode) {
      this.debugLog('Device detection:', {
        userAgent,
        isMobile,
        isTablet
      });
    }
    
    return isMobile || isTablet;
  }

  // 【✓】 Check if viewport is small
  private isSmallViewport(): boolean {
    return window.innerWidth <= this.CONSTANTS.BREAKPOINTS.MOBILE_MAX;
  }

  // 【✓】 Check if device supports touch
  private isTouchDevice(): boolean {
    // Modern way to detect touch devices
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // 【✓】 Get current orientation
  public getOrientation(): Orientation {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  }

  // 【✓】 Check if device is a tablet
  public isTablet(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    const isTabletUserAgent = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(userAgent);
    const viewportWidth = window.innerWidth;
    
    return isTabletUserAgent || 
           (viewportWidth > this.CONSTANTS.BREAKPOINTS.MOBILE_MAX && 
            viewportWidth <= this.CONSTANTS.BREAKPOINTS.TABLET_MAX);
  }
  
  // 【✓】 Helper function for consistent logging
  private debugLog(...args: any[]): void {
    if (this.isDebugMode) {
      console.log('[DeviceDetection]', ...args);
    }
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      this.debugLog('Destroying service');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
} 