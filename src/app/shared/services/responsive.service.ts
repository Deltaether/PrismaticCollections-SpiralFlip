import { Injectable, computed, signal } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

/**
 * Comprehensive breakpoint definitions for the Phantasia Collections application
 * Following industry best practices for responsive design
 * 【✓】
 */
export const PHANTASIA_BREAKPOINTS = {
  // Mobile breakpoints
  XS: '(max-width: 319px)',        // Extra small mobile
  SM: '(min-width: 320px) and (max-width: 767px)',  // Mobile
  
  // Tablet breakpoints  
  MD: '(min-width: 768px) and (max-width: 1023px)', // Tablet
  
  // Desktop breakpoints
  LG: '(min-width: 1024px) and (max-width: 1439px)', // Desktop
  XL: '(min-width: 1440px) and (max-width: 2559px)', // Large Desktop
  XXL: '(min-width: 2560px)',      // Ultra-wide
  
  // Specific device orientations
  MOBILE_PORTRAIT: '(max-width: 767px) and (orientation: portrait)',
  MOBILE_LANDSCAPE: '(max-width: 1023px) and (orientation: landscape)',
  TABLET_PORTRAIT: '(min-width: 768px) and (max-width: 1023px) and (orientation: portrait)',
  TABLET_LANDSCAPE: '(min-width: 768px) and (max-width: 1279px) and (orientation: landscape)',
  
  // Touch and hover capabilities
  TOUCH_DEVICE: '(hover: none) and (pointer: coarse)',
  HOVER_DEVICE: '(hover: hover) and (pointer: fine)',
  
  // High DPI displays
  RETINA: '(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)',
  
  // Height-based breakpoints for viewport considerations
  SHORT_HEIGHT: '(max-height: 600px)',
  TALL_HEIGHT: '(min-height: 900px)',
} as const;

/**
 * Device type enumeration for easy component logic
 * 【✓】
 */
export enum DeviceType {
  MOBILE = 'mobile',
  TABLET = 'tablet', 
  DESKTOP = 'desktop',
  LARGE_DESKTOP = 'large-desktop',
  ULTRA_WIDE = 'ultra-wide'
}

/**
 * Screen size information interface
 * 【✓】
 */
export interface ScreenInfo {
  readonly deviceType: DeviceType;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
  readonly isLargeDesktop: boolean;
  readonly isUltraWide: boolean;
  readonly isPortrait: boolean;
  readonly isLandscape: boolean;
  readonly isTouchDevice: boolean;
  readonly isHoverCapable: boolean;
  readonly isRetina: boolean;
  readonly isShortHeight: boolean;
  readonly isTallHeight: boolean;
  readonly breakpointName: string;
}

/**
 * Professional responsive design service for the Phantasia Collections application
 * 
 * Provides comprehensive breakpoint management, device detection, and responsive utilities
 * using Angular CDK BreakpointObserver for optimal performance and reliability.
 * 
 * Features:
 * - Professional breakpoint system (XS, SM, MD, LG, XL, XXL)
 * - Device type detection (mobile, tablet, desktop variants)
 * - Touch and hover capability detection
 * - High DPI/Retina display detection
 * - Orientation change handling
 * - Height-based breakpoints for viewport considerations
 * - Signal-based reactive state management
 * 
 * Usage:
 * ```typescript
 * constructor(private responsive: ResponsiveService) {}
 * 
 * ngOnInit() {
 *   // Get current screen information
 *   const screenInfo = this.responsive.getScreenInfo();
 *   
 *   // Subscribe to screen changes
 *   this.responsive.screenInfo$.subscribe(info => {
 *     if (info.isMobile) {
 *       // Mobile-specific logic
 *     }
 *   });
 *   
 *   // Use computed signals for reactive UI
 *   this.isMobileLayout = this.responsive.isMobile;
 * }
 * ```
 * 【✓】
 */
@Injectable({
  providedIn: 'root'
})
export class ResponsiveService {
  
  // Private breakpoint observables using Angular CDK
  private readonly isXS$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.XS);
  private readonly isSM$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.SM);
  private readonly isMD$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.MD);
  private readonly isLG$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.LG);
  private readonly isXL$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.XL);
  private readonly isXXL$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.XXL);
  
  // Orientation observables
  private readonly isMobilePortrait$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.MOBILE_PORTRAIT);
  private readonly isMobileLandscape$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.MOBILE_LANDSCAPE);
  private readonly isTabletPortrait$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TABLET_PORTRAIT);
  private readonly isTabletLandscape$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TABLET_LANDSCAPE);
  
  // Device capability observables
  private readonly isTouchDevice$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TOUCH_DEVICE);
  private readonly isHoverCapable$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.HOVER_DEVICE);
  private readonly isRetina$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.RETINA);
  
  // Height-based observables
  private readonly isShortHeight$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.SHORT_HEIGHT);
  private readonly isTallHeight$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TALL_HEIGHT);
  
  // Combined screen information observable
  public readonly screenInfo$: Observable<ScreenInfo> = combineLatest([
    this.isXS$, this.isSM$, this.isMD$, this.isLG$, this.isXL$, this.isXXL$,
    this.isMobilePortrait$, this.isMobileLandscape$, this.isTabletPortrait$, this.isTabletLandscape$,
    this.isTouchDevice$, this.isHoverCapable$, this.isRetina$,
    this.isShortHeight$, this.isTallHeight$
  ]).pipe(
    map(([xs, sm, md, lg, xl, xxl, mobilePortrait, mobileLandscape, tabletPortrait, tabletLandscape, touchDevice, hoverCapable, retina, shortHeight, tallHeight]) => {
      
      // Determine device type and breakpoint
      let deviceType: DeviceType;
      let breakpointName: string;
      
      if (xs.matches) {
        deviceType = DeviceType.MOBILE;
        breakpointName = 'XS';
      } else if (sm.matches) {
        deviceType = DeviceType.MOBILE;
        breakpointName = 'SM';
      } else if (md.matches) {
        deviceType = DeviceType.TABLET;
        breakpointName = 'MD';
      } else if (lg.matches) {
        deviceType = DeviceType.DESKTOP;
        breakpointName = 'LG';
      } else if (xl.matches) {
        deviceType = DeviceType.LARGE_DESKTOP;
        breakpointName = 'XL';
      } else {
        deviceType = DeviceType.ULTRA_WIDE;
        breakpointName = 'XXL';
      }
      
      const isMobile = xs.matches || sm.matches;
      const isTablet = md.matches;
      const isDesktop = lg.matches;
      const isLargeDesktop = xl.matches;
      const isUltraWide = xxl.matches;
      
      // Determine orientation
      const isPortrait = mobilePortrait.matches || tabletPortrait.matches || 
                        (!mobileLandscape.matches && !tabletLandscape.matches && window.innerHeight > window.innerWidth);
      const isLandscape = !isPortrait;
      
      const screenInfo: ScreenInfo = {
        deviceType,
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        isUltraWide,
        isPortrait,
        isLandscape,
        isTouchDevice: touchDevice.matches,
        isHoverCapable: hoverCapable.matches,
        isRetina: retina.matches,
        isShortHeight: shortHeight.matches,
        isTallHeight: tallHeight.matches,
        breakpointName
      };
      
      return screenInfo;
    }),
    shareReplay(1)
  );
  
  // Reactive signals for easy component consumption
  private readonly _screenInfo = signal<ScreenInfo>({
    deviceType: DeviceType.DESKTOP,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeDesktop: false,
    isUltraWide: false,
    isPortrait: false,
    isLandscape: true,
    isTouchDevice: false,
    isHoverCapable: true,
    isRetina: false,
    isShortHeight: false,
    isTallHeight: false,
    breakpointName: 'LG'
  });
  
  // Public computed signals for component consumption
  public readonly screenInfo = this._screenInfo.asReadonly();
  public readonly isMobile = computed(() => this._screenInfo().isMobile);
  public readonly isTablet = computed(() => this._screenInfo().isTablet);
  public readonly isDesktop = computed(() => this._screenInfo().isDesktop);
  public readonly isLargeDesktop = computed(() => this._screenInfo().isLargeDesktop);
  public readonly isUltraWide = computed(() => this._screenInfo().isUltraWide);
  public readonly isPortrait = computed(() => this._screenInfo().isPortrait);
  public readonly isLandscape = computed(() => this._screenInfo().isLandscape);
  public readonly isTouchDevice = computed(() => this._screenInfo().isTouchDevice);
  public readonly isHoverCapable = computed(() => this._screenInfo().isHoverCapable);
  public readonly isRetina = computed(() => this._screenInfo().isRetina);
  public readonly deviceType = computed(() => this._screenInfo().deviceType);
  public readonly breakpointName = computed(() => this._screenInfo().breakpointName);
  
  constructor(private readonly breakpointObserver: BreakpointObserver) {
    // Initialize signal with current screen information
    this.screenInfo$.subscribe(info => {
      this._screenInfo.set(info);
    });
  }
  
  /**
   * Get current screen information synchronously
   * 【✓】
   */
  getScreenInfo(): ScreenInfo {
    return this._screenInfo();
  }
  
  /**
   * Check if device matches specific breakpoint
   * 【✓】
   */
  matches(breakpoint: string): Observable<boolean> {
    return this.breakpointObserver.observe(breakpoint).pipe(
      map(result => result.matches)
    );
  }
  
  /**
   * Check if device matches any of the provided breakpoints
   * 【✓】
   */
  matchesAny(breakpoints: string[]): Observable<boolean> {
    return this.breakpointObserver.observe(breakpoints).pipe(
      map(result => result.matches)
    );
  }
  
  /**
   * Get optimal number of columns for grid layouts based on screen size
   * 【✓】
   */
  getGridColumns(): number {
    const info = this.getScreenInfo();
    
    if (info.isMobile) return 1;
    if (info.isTablet) return 2;
    if (info.isDesktop) return 3;
    if (info.isLargeDesktop) return 4;
    return 5; // Ultra-wide
  }
  
  /**
   * Get optimal content max-width based on screen size
   * 【✓】
   */
  getContentMaxWidth(): string {
    const info = this.getScreenInfo();
    
    if (info.isMobile) return '100%';
    if (info.isTablet) return '768px';
    if (info.isDesktop) return '1024px';
    if (info.isLargeDesktop) return '1200px';
    return '1400px'; // Ultra-wide
  }
  
  /**
   * Get optimal spacing scale based on screen size
   * 【✓】
   */
  getSpacingScale(): number {
    const info = this.getScreenInfo();
    
    if (info.isMobile) return 0.75;  // 75% of base spacing
    if (info.isTablet) return 0.9;   // 90% of base spacing
    if (info.isDesktop) return 1.0;  // Base spacing
    if (info.isLargeDesktop) return 1.1;  // 110% of base spacing
    return 1.2; // 120% for ultra-wide
  }
  
  /**
   * Get optimal typography scale based on screen size
   * 【✓】
   */
  getTypographyScale(): number {
    const info = this.getScreenInfo();
    
    if (info.isMobile) return 0.85;  // Smaller text on mobile
    if (info.isTablet) return 0.95;  // Slightly smaller on tablet
    if (info.isDesktop) return 1.0;  // Base size
    if (info.isLargeDesktop) return 1.05;  // Slightly larger
    return 1.1; // Larger text for ultra-wide
  }
  
  /**
   * Check if reduced motion is preferred (accessibility)
   * 【✓】
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  
  /**
   * Check if dark mode is preferred
   * 【✓】
   */
  prefersDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  
  /**
   * Get safe area insets for devices with notches
   * 【✓】
   */
  getSafeAreaInsets(): { top: string; right: string; bottom: string; left: string } {
    const computedStyle = getComputedStyle(document.documentElement);
    
    return {
      top: computedStyle.getPropertyValue('env(safe-area-inset-top)') || '0px',
      right: computedStyle.getPropertyValue('env(safe-area-inset-right)') || '0px',
      bottom: computedStyle.getPropertyValue('env(safe-area-inset-bottom)') || '0px',
      left: computedStyle.getPropertyValue('env(safe-area-inset-left)') || '0px'
    };
  }
}