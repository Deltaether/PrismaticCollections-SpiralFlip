import { Component, HostListener, ElementRef } from '@angular/core';
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
export class PhantasiaComponent {
  title = 'Project Phantasia';
  currentSection = 'introduction';
  sections = ['introduction', 'disc-1', 'disc-2', 'pv', 'information'];

  constructor(private elementRef: ElementRef) {}

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    const mainElement = this.elementRef.nativeElement.querySelector('main');
    if (!mainElement) return;

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (!element) continue;

      const rect = element.getBoundingClientRect();
      if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
        this.currentSection = section;
        break;
      }
    }
  }
}
