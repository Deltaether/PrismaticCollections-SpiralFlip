import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollHelperService } from '../services/scroll-helper.service';

@Component({
  selector: 'app-scroll-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="demo-section">
      <h2 class="demo-title fade-in">Scroll Animation Demo</h2>
      
      <div class="demo-block">
        <h3 class="slide-in-left">Fade In Elements</h3>
        <p class="fade-in">This element will fade in when scrolled into view.</p>
        <p class="fade-in">This element will also fade in, but with a slight delay.</p>
        <p class="fade-in">And one more fade-in element for good measure.</p>
      </div>
      
      <div class="demo-block">
        <h3 class="slide-in-right">Slide In Elements</h3>
        <div class="demo-row">
          <div class="demo-card slide-in-left">Slide In From Left</div>
          <div class="demo-card slide-in-right">Slide In From Right</div>
        </div>
      </div>
      
      <div class="demo-block">
        <h3 class="fade-in">Staggered Elements</h3>
        <ul class="stagger-container">
          <li class="stagger-item" *ngFor="let item of items">Item {{ item }}</li>
        </ul>
        <button class="demo-button scale-in" (click)="scrollToSection('parallax')">
          Go to Parallax Section
        </button>
      </div>
      
      <div id="parallax" class="demo-block parallax-section">
        <h3 class="fade-in">Parallax Effect</h3>
        <div class="parallax-elements">
          <div class="parallax-element" data-parallax-speed="0.2">Layer 1 (Slow)</div>
          <div class="parallax-element" data-parallax-speed="0.5">Layer 2 (Medium)</div>
          <div class="parallax-element" data-parallax-speed="0.8">Layer 3 (Fast)</div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .demo-section {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .demo-title {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .demo-block {
      margin-bottom: 5rem;
      padding: 2rem;
      border-radius: 8px;
      background-color: #f8f9fa;
    }
    
    .demo-row {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
    }
    
    .demo-card {
      flex: 1;
      min-width: 200px;
      padding: 2rem;
      border-radius: 8px;
      background-color: #fff;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    
    .stagger-container {
      list-style: none;
      padding: 0;
    }
    
    .stagger-item {
      padding: 1rem;
      margin-bottom: 0.5rem;
      background-color: #fff;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }
    
    .demo-button {
      display: block;
      margin: 2rem auto 0;
      padding: 0.75rem 1.5rem;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
    }
    
    .parallax-section {
      height: 500px;
      overflow: hidden;
      position: relative;
    }
    
    .parallax-elements {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 2rem;
    }
    
    .parallax-element {
      padding: 2rem;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      text-align: center;
      font-size: 1.25rem;
    }
  `]
})
export class ScrollDemoComponent implements OnInit, OnDestroy {
  // 【✓】 Demo data
  items: number[] = Array.from({ length: 8 }, (_, i) => i + 1);
  
  // 【✓】 Query for stagger elements
  @ViewChildren('staggerItem') staggerItems!: QueryList<ElementRef>;
  
  constructor(
    private scrollHelper: ScrollHelperService,
    private el: ElementRef
  ) {}
  
  // 【✓】 Initialize scroll animations
  ngOnInit(): void {
    // Initialize standard fade and slide animations
    this.scrollHelper.initScrollAnimations();
    
    // Apply staggered animations to list items
    setTimeout(() => {
      const staggerElements = this.el.nativeElement.querySelectorAll('.stagger-item');
      this.scrollHelper.applyStaggeredAnimation(staggerElements);
    }, 100);
    
    // Apply parallax effect
    const parallaxElements = this.el.nativeElement.querySelectorAll('[data-parallax-speed]');
    this.scrollHelper.applyParallaxEffect(parallaxElements);
  }
  
  // 【✓】 Scroll to specified section
  scrollToSection(sectionId: string): void {
    this.scrollHelper.scrollToElement(sectionId, -80, true);
  }
  
  // 【✓】 Clean up on destroy
  ngOnDestroy(): void {
    this.scrollHelper.cleanup();
  }
} 