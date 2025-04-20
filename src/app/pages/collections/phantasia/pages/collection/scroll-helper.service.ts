import { Injectable, Renderer2, RendererFactory2, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollHelperService {
  private renderer: Renderer2;
  private observers: IntersectionObserver[] = [];

  constructor(
    private rendererFactory: RendererFactory2,
    private ngZone: NgZone
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * 【✓】 Initialize scrollable container with smooth scrolling behavior
   */
  enableScroll(container: HTMLElement): void {
    if (!container) {
      console.warn('ScrollHelperService: No container provided for enableScroll');
      return;
    }
    
    this.renderer.addClass(container, 'scrollable-container');
    this.renderer.setStyle(container, 'scroll-behavior', 'smooth');
    console.log('ScrollHelperService: Smooth scrolling enabled for container');
  }

  /**
   * 【✓】 Apply animations to elements as they scroll into view
   */
  applyScrollAnimations(container: HTMLElement, selector: string, animationClass: string = 'fade-in', delay: number = 100): void {
    if (!container || !selector) {
      console.warn('ScrollHelperService: Missing container or selector for scroll animations');
      return;
    }

    const elements = container.querySelectorAll(selector);
    if (elements.length === 0) {
      console.warn(`ScrollHelperService: No elements found for selector "${selector}"`);
      return;
    }

    // Add the animation class to all elements
    elements.forEach((el, index) => {
      this.renderer.addClass(el, animationClass);
      this.renderer.addClass(el, 'observe-element');
      
      // Set delay based on index if needed
      if (delay > 0) {
        this.renderer.setStyle(el, 'transition-delay', `${index * delay}ms`);
      }
    });

    // Create an observer to detect when elements enter viewport
    this.ngZone.runOutsideAngular(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.ngZone.run(() => {
              this.renderer.addClass(entry.target, 'visible');
            });
          } else {
            // Optional: remove visible class when element leaves viewport
            // this.renderer.removeClass(entry.target, 'visible');
          }
        });
      }, {
        root: container === document.documentElement ? null : container,
        rootMargin: '0px',
        threshold: 0.1
      });

      // Observe all elements
      elements.forEach(el => observer.observe(el));
      this.observers.push(observer);
    });

    console.log(`ScrollHelperService: Applied ${animationClass} to ${elements.length} elements`);
  }

  /**
   * 【✓】 Scroll to specific element in the collection
   */
  scrollToCollection(container: HTMLElement, selector: string): void {
    if (!container || !selector) {
      console.warn('ScrollHelperService: Missing container or selector for scrollToCollection');
      return;
    }

    const targetElement = container.querySelector(selector);
    if (!targetElement) {
      console.warn(`ScrollHelperService: Target element not found with selector "${selector}"`);
      return;
    }

    targetElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
    
    // Highlight the target element briefly
    this.renderer.addClass(targetElement, 'highlight-item');
    setTimeout(() => {
      this.renderer.removeClass(targetElement, 'highlight-item');
    }, 1500);

    console.log(`ScrollHelperService: Scrolled to element with selector "${selector}"`);
  }

  /**
   * 【✓】 Clean up observers when component is destroyed
   */
  cleanUpObservers(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
    console.log('ScrollHelperService: Cleaned up all intersection observers');
  }
} 