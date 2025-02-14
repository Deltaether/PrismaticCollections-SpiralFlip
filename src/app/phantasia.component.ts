import { Component, HostListener, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { DiscOneComponent } from './pages/disc-one/disc-one.component';
import { DiscTwoComponent } from './pages/disc-two/disc-two.component';
import { PvComponent } from './pages/pv/pv.component';
import { InformationComponent } from './pages/information/information.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IntroductionComponent,
    DiscOneComponent,
    DiscTwoComponent,
    PvComponent,
    InformationComponent
  ],
  templateUrl: './phantasia.component.html',
  styleUrls: ['./phantasia.component.scss']
})
export class PhantasiaComponent implements AfterViewInit {
  @ViewChild('mainContent') mainContent!: ElementRef;
  
  title = 'Project Phantasia';
  currentSection = 'introduction';
  sections = ['introduction', 'disc-1', 'disc-2', 'pv', 'information'];
  isAnimating = false;
  lastScrollTime = 0;
  scrollCooldown = 1000;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    this.detectCurrentSection();
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element && !this.isAnimating) {
      this.isAnimating = true;
      this.currentSection = section;
      element.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        this.isAnimating = false;
      }, this.scrollCooldown);
    }
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    
    const now = Date.now();
    if (now - this.lastScrollTime < 50) return; // Minimal debounce to prevent rapid-fire
    
    const direction = event.deltaY > 0 ? 1 : -1;
    const currentIndex = this.sections.indexOf(this.currentSection);
    const nextIndex = currentIndex + direction;
    
    if (nextIndex >= 0 && nextIndex < this.sections.length) {
      this.lastScrollTime = now;
      this.scrollTo(this.sections[nextIndex]);
    }
  }

  detectCurrentSection() {
    const mainElement = this.mainContent?.nativeElement;
    if (!mainElement) return;

    let closestSection = this.currentSection;
    let minDistance = Infinity;

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      const distance = Math.abs(rect.top);
      
      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    }

    if (closestSection !== this.currentSection) {
      this.currentSection = closestSection;
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.isAnimating) {
      this.detectCurrentSection();
    }
  }
}
