import { Injectable, ElementRef, NgZone, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollHelperService {
  private observers: IntersectionObserver[] = [];
  private parallaxListeners: (() => void)[] = [];
  private renderer: Renderer2;

  constructor(
    private ngZone: NgZone,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  // 【✓】 Initialize scroll animations for elements
  initScrollAnimations(
    containerRefOrElement?: ElementRef | HTMLElement | null,
    selectors: string[] = ['.fade-in', '.slide-in-left', '.slide-in-right', '.scale-in', '.stagger-item'],
    threshold = 0.2
  ): void {
    // Handle case when no container is provided - use document
    const container = containerRefOrElement 
      ? (containerRefOrElement instanceof ElementRef 
          ? containerRefOrElement.nativeElement 
          : containerRefOrElement)
      : document.documentElement;
    
    const options = {
      root: container === document.documentElement ? null : container,
      rootMargin: '0px',
      threshold: threshold
    };

    const observer = new IntersectionObserver((entries) => {
      this.ngZone.run(() => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.renderer.addClass(entry.target, 'animate');
            this.renderer.addClass(entry.target, 'visible');
          } else {
            this.renderer.removeClass(entry.target, 'animate');
            if (!entry.target.classList.contains('persist-animation')) {
              this.renderer.removeClass(entry.target, 'visible');
            }
          }
        });
      });
    }, options);

    selectors.forEach(selector => {
      const elements = container.querySelectorAll(selector);
      elements.forEach((el: HTMLElement) => {
        observer.observe(el);
      });
    });

    this.observers.push(observer);
  }

  // 【✓】 Apply staggered animations to elements
  applyStaggeredAnimation(
    elementsOrContainer: ElementRef | HTMLElement | NodeList | null,
    animationClassOrSelector: string = 'visible',
    delayStep: number = 0.1
  ): void {
    if (!elementsOrContainer) return;

    let elements: NodeListOf<Element> | HTMLElement[] | NodeList;
    
    // Handle different types of input
    if (elementsOrContainer instanceof ElementRef) {
      elements = elementsOrContainer.nativeElement.querySelectorAll(
        typeof animationClassOrSelector === 'string' && animationClassOrSelector.includes('.') 
          ? animationClassOrSelector 
          : '.stagger-item'
      );
    } else if (elementsOrContainer instanceof HTMLElement) {
      elements = elementsOrContainer.querySelectorAll(
        typeof animationClassOrSelector === 'string' && animationClassOrSelector.includes('.') 
          ? animationClassOrSelector 
          : '.stagger-item'
      );
    } else {
      // NodeList
      elements = elementsOrContainer;
    }
    
    // If animationClass contains a dot, it's a selector, not a class name
    const animationClass = (typeof animationClassOrSelector === 'string' && animationClassOrSelector.startsWith('.')) 
      ? animationClassOrSelector.substring(1) 
      : animationClassOrSelector;
    
    // Convert to array and ensure elements are treated as Elements
    Array.from(elements as NodeListOf<Element>).forEach((el, index) => {
      const element = el as Element;
      if (animationClass !== 'visible') {
        this.renderer.addClass(element, animationClass);
      }
      this.renderer.setStyle(element, 'transition-delay', `${index * delayStep}s`);
    });
  }

  // 【✓】 Apply parallax scrolling effect
  applyParallaxEffect(
    elementsOrContainer: ElementRef | HTMLElement | NodeList | null,
    selector?: string,
    intensity: number = 0.5
  ): void {
    if (!elementsOrContainer) return;

    let elements: NodeListOf<Element> | HTMLElement[] | NodeList;
    
    // Handle different types of input
    if (elementsOrContainer instanceof ElementRef) {
      elements = selector 
        ? elementsOrContainer.nativeElement.querySelectorAll(selector)
        : elementsOrContainer.nativeElement.querySelectorAll('[data-parallax-speed]');
    } else if (elementsOrContainer instanceof HTMLElement) {
      elements = selector 
        ? elementsOrContainer.querySelectorAll(selector) 
        : elementsOrContainer.querySelectorAll('[data-parallax-speed]');
    } else {
      // NodeList
      elements = elementsOrContainer;
    }
    
    const handleScroll = () => {
      this.ngZone.runOutsideAngular(() => {
        // Convert to array and ensure elements are treated as Elements
        Array.from(elements as NodeListOf<Element>).forEach(el => {
          const htmlEl = el as HTMLElement;
          const rect = htmlEl.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Check if element is in viewport
          if (rect.top < viewportHeight && rect.bottom > 0) {
            // Calculate how far the element is from the center of the viewport
            const distanceFromCenter = (rect.top + rect.height / 2) - (viewportHeight / 2);
            
            // Get speed from data attribute or use default intensity
            const parallaxSpeedAttr = 'parallaxSpeed';
            const speed = htmlEl.dataset[parallaxSpeedAttr]
              ? parseFloat(htmlEl.dataset[parallaxSpeedAttr])
              : intensity;
              
            const translateY = distanceFromCenter * speed;
            
            this.renderer.setStyle(htmlEl, 'transform', `translateY(${translateY}px)`);
          }
        });
      });
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    this.parallaxListeners.push(() => {
      window.removeEventListener('scroll', handleScroll);
    });
    
    // Initial calculation
    handleScroll();
  }

  // 【✓】 Scroll to element with ID with offset
  scrollToElement(elementIdOrSelector: string, offset: number = 0, useHighlight: boolean = false): void {
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        // Handle both ID and selector
        const element = elementIdOrSelector.startsWith('#') || elementIdOrSelector.startsWith('.')
          ? document.querySelector(elementIdOrSelector)
          : document.getElementById(elementIdOrSelector);
          
        if (element) {
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset + offset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Add highlight animation class if requested
          if (useHighlight) {
            this.renderer.addClass(element, 'highlight-scroll');
            setTimeout(() => {
              this.renderer.removeClass(element, 'highlight-scroll');
            }, 2000);
          }
        }
      }, 100);
    });
  }

  // 【✓】 Backward compatibility method for scrollToCollection
  scrollToCollection(container: HTMLElement | ElementRef, selector: string): void {
    const containerEl = container instanceof ElementRef ? container.nativeElement : container;
    const targetElement = containerEl.querySelector(selector);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Highlight the target element briefly
      this.renderer.addClass(targetElement, 'highlight-scroll');
      setTimeout(() => {
        this.renderer.removeClass(targetElement, 'highlight-scroll');
      }, 1500);
    }
  }

  // 【✓】 Enable smooth scrolling on container
  enableScroll(container: HTMLElement): void {
    this.renderer.setStyle(container, 'overflow-y', 'auto');
    this.renderer.setStyle(container, 'scroll-behavior', 'smooth');
  }

  // 【✓】 Clean up all observers to prevent memory leaks
  cleanUpObservers(): void {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers = [];
  }

  // 【✓】 Clean up parallax event listeners
  cleanUpParallax(): void {
    this.parallaxListeners.forEach(removeListener => {
      removeListener();
    });
    this.parallaxListeners = [];
  }
  
  // 【✓】 Cleanup all (combined method)
  cleanup(): void {
    this.cleanUpObservers();
    this.cleanUpParallax();
  }
} 