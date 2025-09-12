import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResponsiveService, DeviceType } from '../services/responsive.service';

/**
 * Structural directive for conditional rendering based on screen size
 * 
 * Usage examples:
 * ```html
 * <!-- Show only on mobile devices -->
 * <div *appResponsive="'mobile'">Mobile content</div>
 * 
 * <!-- Show on tablet and above -->
 * <div *appResponsive="['tablet', 'desktop', 'large-desktop', 'ultra-wide']">Desktop content</div>
 * 
 * <!-- Show on desktop and above -->
 * <div *appResponsiveFrom="'desktop'">Desktop+ content</div>
 * 
 * <!-- Show only up to tablet -->
 * <div *appResponsiveTo="'tablet'">Mobile + Tablet content</div>
 * 
 * <!-- Show on touch devices -->
 * <div *appResponsive="'touch'">Touch-specific content</div>
 * 
 * <!-- Show on hover-capable devices -->
 * <div *appResponsive="'hover'">Hover-capable content</div>
 * ```
 * 【✓】
 */
@Directive({
  selector: '[appResponsive]',
  standalone: true
})
export class ResponsiveDirective implements OnInit, OnDestroy {
  
  private readonly destroy$ = new Subject<void>();
  private readonly responsiveService = inject(ResponsiveService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  
  private hasView = false;
  
  @Input('appResponsive') 
  set responsive(value: string | string[] | DeviceType | DeviceType[]) {
    this.targetDevices = Array.isArray(value) ? value : [value];
    this.updateView();
  }
  
  private targetDevices: (string | DeviceType)[] = [];
  
  ngOnInit(): void {
    // Subscribe to screen info changes
    this.responsiveService.screenInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private updateView(): void {
    const screenInfo = this.responsiveService.getScreenInfo();
    const shouldShow = this.shouldShowForCurrentDevice(screenInfo);
    
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  
  private shouldShowForCurrentDevice(screenInfo: any): boolean {
    return this.targetDevices.some(target => {
      switch (target) {
        case 'mobile':
          return screenInfo.isMobile;
        case 'tablet':
          return screenInfo.isTablet;
        case 'desktop':
          return screenInfo.isDesktop;
        case 'large-desktop':
          return screenInfo.isLargeDesktop;
        case 'ultra-wide':
          return screenInfo.isUltraWide;
        case 'touch':
          return screenInfo.isTouchDevice;
        case 'hover':
          return screenInfo.isHoverCapable;
        case 'portrait':
          return screenInfo.isPortrait;
        case 'landscape':
          return screenInfo.isLandscape;
        case 'retina':
          return screenInfo.isRetina;
        case DeviceType.MOBILE:
          return screenInfo.isMobile;
        case DeviceType.TABLET:
          return screenInfo.isTablet;
        case DeviceType.DESKTOP:
          return screenInfo.isDesktop;
        case DeviceType.LARGE_DESKTOP:
          return screenInfo.isLargeDesktop;
        case DeviceType.ULTRA_WIDE:
          return screenInfo.isUltraWide;
        default:
          return false;
      }
    });
  }
}

/**
 * Structural directive for showing content from a specific breakpoint and up
 * 
 * Usage:
 * ```html
 * <div *appResponsiveFrom="'tablet'">Shows on tablet and larger</div>
 * ```
 * 【✓】
 */
@Directive({
  selector: '[appResponsiveFrom]',
  standalone: true
})
export class ResponsiveFromDirective implements OnInit, OnDestroy {
  
  private readonly destroy$ = new Subject<void>();
  private readonly responsiveService = inject(ResponsiveService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  
  private hasView = false;
  
  @Input('appResponsiveFrom') 
  set responsiveFrom(value: string | DeviceType) {
    this.fromDevice = value;
    this.updateView();
  }
  
  private fromDevice: string | DeviceType = 'mobile';
  
  ngOnInit(): void {
    this.responsiveService.screenInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private updateView(): void {
    const screenInfo = this.responsiveService.getScreenInfo();
    const shouldShow = this.shouldShowFromDevice(screenInfo);
    
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  
  private shouldShowFromDevice(screenInfo: any): boolean {
    const deviceOrder = ['mobile', 'tablet', 'desktop', 'large-desktop', 'ultra-wide'];
    const currentDeviceIndex = this.getDeviceIndex(screenInfo.deviceType);
    const fromDeviceIndex = this.getDeviceIndex(this.fromDevice);
    
    return currentDeviceIndex >= fromDeviceIndex;
  }
  
  private getDeviceIndex(device: string | DeviceType): number {
    const deviceMap: Record<string, number> = {
      'mobile': 0,
      'tablet': 1,
      'desktop': 2,
      'large-desktop': 3,
      'ultra-wide': 4
    };
    
    // Handle enum values
    if (typeof device === 'string') {
      return deviceMap[device] ?? 0;
    } else {
      // Convert enum to string mapping
      const enumToString: Record<DeviceType, string> = {
        [DeviceType.MOBILE]: 'mobile',
        [DeviceType.TABLET]: 'tablet',
        [DeviceType.DESKTOP]: 'desktop',
        [DeviceType.LARGE_DESKTOP]: 'large-desktop',
        [DeviceType.ULTRA_WIDE]: 'ultra-wide'
      };
      
      return deviceMap[enumToString[device]] ?? 0;
    }
  }
}

/**
 * Structural directive for showing content up to a specific breakpoint
 * 
 * Usage:
 * ```html
 * <div *appResponsiveTo="'tablet'">Shows on mobile and tablet only</div>
 * ```
 * 【✓】
 */
@Directive({
  selector: '[appResponsiveTo]',
  standalone: true
})
export class ResponsiveToDirective implements OnInit, OnDestroy {
  
  private readonly destroy$ = new Subject<void>();
  private readonly responsiveService = inject(ResponsiveService);
  private readonly templateRef = inject(TemplateRef<any>);
  private readonly viewContainer = inject(ViewContainerRef);
  
  private hasView = false;
  
  @Input('appResponsiveTo') 
  set responsiveTo(value: string | DeviceType) {
    this.toDevice = value;
    this.updateView();
  }
  
  private toDevice: string | DeviceType = 'ultra-wide';
  
  ngOnInit(): void {
    this.responsiveService.screenInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateView();
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private updateView(): void {
    const screenInfo = this.responsiveService.getScreenInfo();
    const shouldShow = this.shouldShowToDevice(screenInfo);
    
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  
  private shouldShowToDevice(screenInfo: any): boolean {
    const deviceOrder = ['mobile', 'tablet', 'desktop', 'large-desktop', 'ultra-wide'];
    const currentDeviceIndex = this.getDeviceIndex(screenInfo.deviceType);
    const toDeviceIndex = this.getDeviceIndex(this.toDevice);
    
    return currentDeviceIndex <= toDeviceIndex;
  }
  
  private getDeviceIndex(device: string | DeviceType): number {
    const deviceMap: Record<string, number> = {
      'mobile': 0,
      'tablet': 1,
      'desktop': 2,
      'large-desktop': 3,
      'ultra-wide': 4
    };
    
    // Handle enum values
    if (typeof device === 'string') {
      return deviceMap[device] ?? 4;
    } else {
      // Convert enum to string mapping
      const enumToString: Record<DeviceType, string> = {
        [DeviceType.MOBILE]: 'mobile',
        [DeviceType.TABLET]: 'tablet',
        [DeviceType.DESKTOP]: 'desktop',
        [DeviceType.LARGE_DESKTOP]: 'large-desktop',
        [DeviceType.ULTRA_WIDE]: 'ultra-wide'
      };
      
      return deviceMap[enumToString[device]] ?? 4;
    }
  }
}