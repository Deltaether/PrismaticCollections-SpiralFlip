import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

/**
 * StyleOverrideDirective - Lightweight Performance Optimized
 * Forces the correct styles for collections page design
 * 【✓】
 */
@Directive({
  standalone: true,
  selector: '[appStyleOverride]'
})
export class StyleOverrideDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  /**
   * Apply styles on init - Minimal operations for performance
   * 【✓】
   */
  ngOnInit() {
    this.applyOptimizedStyles();
  }

  /**
   * Apply only essential styles without heavy DOM operations
   * 【✓】
   */
  private applyOptimizedStyles() {
    // Apply essential styles to body with minimal operations
    this.renderer.addClass(document.body, 'collections-themed-page');
    
    // Style the host element only
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block');
    this.renderer.setStyle(this.el.nativeElement, 'min-height', '100vh');
    this.renderer.setStyle(this.el.nativeElement, 'position', 'relative');
  }
}
