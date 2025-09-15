import { Component, Input, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Renderer2, Inject, RendererStyleFlags2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';

/**
 * Defines position and animation properties for rune elements
 * Controls appearance and movement of magical rune symbols
 */
interface RunePosition {
  x: number;
  y: number;
  scale: number;
  delay: number;
  opacity: number;
  moveX: number;
  moveY: number;
  rotationOffset: number;
  clockwise: boolean;
}

/**
 * Creates an animated loading screen with magical effects
 * Displays during application loading and initialization
 * Provides visual feedback and sets atmosphere for the application
 * 【✓】
 */
@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingScreenComponent implements OnInit, OnDestroy {
  @Input() set progress(value: number) {
    this._progress = value;
    this.progressText = `${Math.floor(value)}%`;
    this.cdr.markForCheck();
  }
  
  get progress(): number {
    return this._progress;
  }
  
  private _progress = 0;
  progressText = '0%';
  runes: RunePosition[] = [];
  private originalHeaderStyles = new Map<HTMLElement, string>();

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}
  
  /**
   * Initializes the loading screen and generates rune positions
   * Creates randomized magical elements with varied animations
   * Also suppresses any high z-index headers while loading
   * 【✓】
   */
  ngOnInit() {
    this.generateRunePositions();
    this.suppressHighZIndexHeaders();
  }

  /**
   * Cleanup on component destruction
   * Restores original header z-index values
   * 【✓】
   */
  ngOnDestroy(): void {
    this.restoreHeaderStyles();
  }

  /**
   * Suppress high z-index headers that might appear above the loading screen
   * Stores original styles for restoration later
   * Uses multiple aggressive approaches to ensure loading screen visibility
   * 【✓】
   */
  private suppressHighZIndexHeaders(): void {
    console.log('🔧 LoadingScreen: Starting header suppression');

    // Find all elements that could interfere with loading screen
    const selectors = [
      'app-site-header',
      '.site-header',
      'header[class*="header"]',
      '.cd-cases-container',
      '.debug-toggle',
      '.debug-panel',
      '.right-side-menu',
      '.mobile-navbar',
      '[class*="z-index"]',
      '[style*="z-index"]'
    ];

    const allPotentialElements = this.document.querySelectorAll(selectors.join(', '));
    console.log(`🔍 Found ${allPotentialElements.length} potential interfering elements`);

    allPotentialElements.forEach((element: Element, index) => {
      const elem = element as HTMLElement;
      const computedStyle = getComputedStyle(elem);
      const originalZIndex = computedStyle.zIndex || 'auto';
      const originalVisibility = computedStyle.visibility || 'visible';

      console.log(`📝 Element ${index}: ${elem.tagName}.${elem.className} - z-index: ${originalZIndex}`);

      // Store original styles for restoration
      this.originalHeaderStyles.set(elem, JSON.stringify({
        zIndex: originalZIndex,
        visibility: originalVisibility,
        display: computedStyle.display || 'block'
      }));

      // AGGRESSIVE APPROACH 1: Set very low z-index
      this.renderer.setStyle(elem, 'z-index', '1', RendererStyleFlags2.Important);

      // AGGRESSIVE APPROACH 2: Make invisible during loading
      this.renderer.setStyle(elem, 'visibility', 'hidden', RendererStyleFlags2.Important);

      console.log(`✅ Suppressed element ${index}`);
    });

    // AGGRESSIVE APPROACH 3: Add body class for global CSS overrides
    this.renderer.addClass(this.document.body, 'loading-screen-active');

    console.log('🎯 Header suppression completed');
  }

  /**
   * Restore original header styles when loading screen is destroyed
   * Restores all suppressed styles including visibility and z-index
   * Enhanced to ensure header visibility is properly restored
   * 【✓】
   */
  private restoreHeaderStyles(): void {
    console.log('🔧 LoadingScreen: Restoring header styles');

    // PRIORITY: Remove body class FIRST to stop CSS suppression
    this.renderer.removeClass(this.document.body, 'loading-screen-active');
    console.log('📝 Removed loading-screen-active class from body');

    this.originalHeaderStyles.forEach((originalStylesJson, element) => {
      try {
        const originalStyles = JSON.parse(originalStylesJson);

        // Restore z-index
        if (originalStyles.zIndex === 'auto' || originalStyles.zIndex === '') {
          this.renderer.removeStyle(element, 'z-index');
        } else {
          this.renderer.setStyle(element, 'z-index', originalStyles.zIndex);
        }

        // Restore visibility - force to visible for headers
        if (element.tagName.toLowerCase() === 'app-site-header' ||
            element.classList.contains('site-header')) {
          this.renderer.setStyle(element, 'visibility', 'visible', RendererStyleFlags2.Important);
          console.log('🎯 Forced header visibility to visible');
        } else if (originalStyles.visibility === 'visible') {
          this.renderer.removeStyle(element, 'visibility');
        } else {
          this.renderer.setStyle(element, 'visibility', originalStyles.visibility);
        }

      } catch (error) {
        console.warn('⚠️ Failed to restore styles for element:', element, error);
        // Fallback: just remove our overrides and ensure header visibility
        this.renderer.removeStyle(element, 'z-index');
        this.renderer.removeStyle(element, 'visibility');

        // Extra safety for headers
        if (element.tagName.toLowerCase() === 'app-site-header' ||
            element.classList.contains('site-header')) {
          this.renderer.setStyle(element, 'visibility', 'visible', RendererStyleFlags2.Important);
        }
      }
    });

    // ADDITIONAL SAFETY: Force all headers to be visible
    const allHeaders = this.document.querySelectorAll('app-site-header, .site-header, header');
    allHeaders.forEach((header: Element) => {
      const elem = header as HTMLElement;
      this.renderer.setStyle(elem, 'visibility', 'visible', RendererStyleFlags2.Important);
      this.renderer.setStyle(elem, 'z-index', '1000', RendererStyleFlags2.Important);
    });

    this.originalHeaderStyles.clear();
    console.log('✅ Header styles restored with enhanced visibility enforcement');
  }

  /**
   * Creates random positions and properties for rune elements
   * Generates visually interesting magical symbols with varied behavior
   * 【✓】
   */
  private generateRunePositions() {
    const numRunes = 48;
    this.runes = Array.from({ length: numRunes }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.6 + Math.random() * 1.4,
      delay: Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
      moveX: 15 + Math.random() * 20,
      moveY: 15 + Math.random() * 20,
      rotationOffset: Math.random() * 360,
      clockwise: Math.random() < 0.5
    }));
  }
} 