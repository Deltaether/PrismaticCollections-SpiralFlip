import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeviceDetectionService } from '../../services/device-detection.service';

// 【✓】 Interface for site version options
interface SiteVersion {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly icon: string;
  recommended: boolean;
}

@Component({
  selector: 'app-site-version-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="version-selector-overlay" [class.active]="isVisible">
      <div class="version-selector-container">
        <div class="selector-header">
          <div class="logo-container">
            <h1 class="logo-text">Prismatic Collections</h1>
            <div class="logo-line"></div>
          </div>
          <h2 class="selector-title">Choose Your Experience</h2>
          <p class="selector-subtitle">Select the version that best suits your device and preferences</p>
        </div>
        
        <div class="versions-container">
          <div 
            *ngFor="let version of versions" 
            class="version-option" 
            [class.recommended]="version.recommended"
            (click)="selectVersion(version.id)"
          >
            <div class="version-icon">
              <i [class]="version.icon"></i>
            </div>
            <div class="version-info">
              <h3 class="version-title">{{ version.title }}</h3>
              <p class="version-description">{{ version.description }}</p>
              <span *ngIf="version.recommended" class="recommended-tag">Recommended for your device</span>
            </div>
          </div>
        </div>
        
        <div class="selector-footer">
          <p class="always-use">
            <span class="checkbox" (click)="toggleRememberChoice()">
              <i *ngIf="rememberChoice" class="fas fa-check"></i>
            </span>
            Remember my choice
          </p>
          <button class="close-button" (click)="close()">Continue</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .version-selector-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.5s ease, visibility 0s linear 0.5s;
    }
    
    .version-selector-overlay.active {
      opacity: 1;
      visibility: visible;
      transition: opacity 0.5s ease, visibility 0s;
    }
    
    .version-selector-container {
      width: 90%;
      max-width: 600px;
      background: radial-gradient(circle at center, 
        rgb(142, 45, 45) 0%, 
        rgb(85, 25, 25) 100%
      );
      border-radius: 10px;
      box-shadow: 0 0 30px rgba(255, 100, 100, 0.3);
      padding: 30px;
      color: white;
      animation: float 6s ease-in-out infinite;
      border: 1px solid rgba(255, 100, 100, 0.2);
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        border: 1px solid rgba(255, 180, 90, 0.2);
        border-radius: 11px;
        pointer-events: none;
      }
    }
    
    .selector-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .logo-container {
      margin-bottom: 20px;
    }
    
    .logo-text {
      font-size: 2.5rem;
      margin: 0;
      background: linear-gradient(to right, #f5d884, #bfa26f);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 10px rgba(245, 216, 132, 0.5);
      letter-spacing: 2px;
    }
    
    .logo-line {
      width: 200px;
      height: 1px;
      margin: 5px auto 0;
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 190, 110, 0.7),
        transparent
      );
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: rgba(255, 190, 110, 0.9);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(45deg);
      }
    }
    
    .selector-title {
      font-size: 1.8rem;
      font-weight: 600;
      margin: 0 0 10px;
      color: rgba(255, 200, 120, 0.95);
      text-shadow: 0 2px 10px rgba(180, 100, 50, 0.7);
    }
    
    .selector-subtitle {
      font-size: 1rem;
      opacity: 0.8;
      margin: 0;
    }
    
    .versions-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .version-option {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 20px;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 180, 90, 0.1);
      position: relative;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-3px);
        background: rgba(0, 0, 0, 0.4);
        border-color: rgba(255, 180, 90, 0.3);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }
      
      &.recommended {
        background: rgba(142, 45, 45, 0.2);
        border-color: rgba(255, 180, 90, 0.3);
        
        &::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 100px;
          background: radial-gradient(
            circle at center,
            rgba(255, 180, 90, 0.15),
            transparent 70%
          );
          top: -50px;
          right: -50px;
          pointer-events: none;
        }
      }
    }
    
    .version-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 180, 90, 0.2);
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
      flex-shrink: 0;
      
      i {
        font-size: 1.8rem;
        color: rgba(255, 180, 90, 0.9);
      }
    }
    
    .version-info {
      flex: 1;
    }
    
    .version-title {
      font-size: 1.3rem;
      margin: 0 0 5px;
      color: rgba(255, 200, 120, 0.95);
    }
    
    .version-description {
      font-size: 0.9rem;
      margin: 0 0 8px;
      opacity: 0.8;
      line-height: 1.4;
    }
    
    .recommended-tag {
      display: inline-block;
      font-size: 0.8rem;
      background: rgba(255, 180, 90, 0.2);
      padding: 4px 10px;
      border-radius: 20px;
      color: rgba(255, 180, 90, 0.9);
    }
    
    .selector-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .checkbox {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 22px;
      height: 22px;
      border: 2px solid rgba(255, 180, 90, 0.5);
      border-radius: 4px;
      margin-right: 10px;
      cursor: pointer;
      vertical-align: middle;
      
      i {
        color: rgba(255, 180, 90, 0.9);
        font-size: 0.8rem;
      }
    }
    
    .always-use {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      opacity: 0.8;
      cursor: pointer;
    }
    
    .close-button {
      background: linear-gradient(to right, rgba(255, 150, 70, 0.8), rgba(255, 100, 50, 0.8));
      color: white;
      border: none;
      padding: 10px 25px;
      border-radius: 5px;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        background: linear-gradient(to right, rgba(255, 170, 90, 0.9), rgba(255, 120, 70, 0.9));
        box-shadow: 0 0 15px rgba(255, 150, 70, 0.5);
      }
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    @media (max-width: 600px) {
      .version-selector-container {
        padding: 20px;
      }
      
      .logo-text {
        font-size: 2rem;
      }
      
      .selector-title {
        font-size: 1.5rem;
      }
      
      .version-icon {
        width: 50px;
        height: 50px;
        margin-right: 15px;
        
        i {
          font-size: 1.5rem;
        }
      }
      
      .version-title {
        font-size: 1.2rem;
      }
      
      .selector-footer {
        flex-direction: column;
        gap: 15px;
      }
      
      .close-button {
        width: 100%;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteVersionSelectorComponent implements OnInit {
  @Output() versionSelected = new EventEmitter<string>();
  @Output() selectorClosed = new EventEmitter<void>();
  
  isVisible = true;
  rememberChoice = false;
  private readonly STORAGE_KEY = 'prismatic_collections_site_version_preference';
  private readonly isDebugMode = true;
  
  // 【✓】 Version options with helpful descriptions
  versions: SiteVersion[] = [
    {
      id: '3d',
      title: '3D Experience (Desktop)',
      description: 'Immersive 3D visualization with interactive elements. Recommended for desktop computers with good GPU performance.',
      icon: 'fas fa-cube',
      recommended: false
    },
    {
      id: 'mobile',
      title: 'Standard View (Mobile)',
      description: 'Clean, responsive layout optimized for all devices. Better performance on mobile devices and older computers.',
      icon: 'fas fa-mobile-alt',
      recommended: false
    }
  ];
  
  constructor(
    private readonly deviceDetectionService: DeviceDetectionService,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}
  
  // 【✓】 Initialize component with device detection
  ngOnInit(): void {
    // Check if user has a saved preference
    const savedPreference = localStorage.getItem(this.STORAGE_KEY);
    
    if (savedPreference) {
      if (this.isDebugMode) {
        console.log(`[VersionSelector] Found saved preference: ${savedPreference}`);
      }
      
      // Auto-select based on saved preference
      this.selectVersion(savedPreference);
      this.isVisible = false;
      this.cdr.markForCheck();
      return;
    }
    
    // Set recommended version based on device
    const isMobile = this.deviceDetectionService.getScreenCategory() === 'MOBILE' || 
                     this.deviceDetectionService.getScreenCategory() === 'TABLET';
    
    this.versions[0].recommended = !isMobile;
    this.versions[1].recommended = isMobile;
    
    if (this.isDebugMode) {
      console.log(`[VersionSelector] Device detection: isMobile = ${isMobile}`);
      console.log(`[VersionSelector] Screen category: ${this.deviceDetectionService.getScreenCategory()}`);
    }
    
    this.cdr.markForCheck();
  }
  
  // 【✓】 Handle version selection
  selectVersion(versionId: string): void {
    if (this.isDebugMode) {
      console.log(`[VersionSelector] Selected version: ${versionId}`);
    }
    
    // Save preference if user opted to remember
    if (this.rememberChoice) {
      localStorage.setItem(this.STORAGE_KEY, versionId);
      if (this.isDebugMode) {
        console.log(`[VersionSelector] Saved preference to localStorage`);
      }
    }
    
    // Navigate to appropriate route
    if (versionId === '3d') {
      this.router.navigate(['/introduction'], { replaceUrl: true });
    } else {
      this.router.navigate(['/mobile'], { replaceUrl: true });
    }
    
    // Emit selected version and close selector
    this.versionSelected.emit(versionId);
    this.close();
  }
  
  // 【✓】 Toggle remember choice option
  toggleRememberChoice(): void {
    this.rememberChoice = !this.rememberChoice;
    if (this.isDebugMode) {
      console.log(`[VersionSelector] Remember choice: ${this.rememberChoice}`);
    }
    this.cdr.markForCheck();
  }
  
  // 【✓】 Close selector without selection
  close(): void {
    this.isVisible = false;
    this.selectorClosed.emit();
    this.cdr.markForCheck();
    
    if (this.isDebugMode) {
      console.log(`[VersionSelector] Selector closed`);
    }
  }
} 