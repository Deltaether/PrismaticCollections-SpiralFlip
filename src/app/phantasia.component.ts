import { Component, HostListener, ElementRef, ViewChild, AfterViewInit, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IntroductionComponent } from './pages/introduction/introduction.component';
import { DiscOneComponent } from './pages/disc-one/disc-one.component';
import { DiscTwoComponent } from './pages/disc-two/disc-two.component';
import { PvComponent } from './pages/pv/pv.component';
import { InformationComponent } from './pages/information/information.component';
import { MusicPlayerComponent } from './tools/music-player/music-player.component';
// import { CDCasesComponent } from './tools/cd-cases/cd-cases.component';
import { CDCasesComponent } from './tools/cd-cases/cd-cases.component';
import { AudioService } from './tools/music-player/audio.service';
import { PreloaderService } from './services/preloader.service';
import { PreloaderComponent } from './tools/preloader/preloader.component';
import { DefaultValuePipe } from './pipes/default-value.pipe';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    IntroductionComponent,
    DiscOneComponent,
    DiscTwoComponent,
    PvComponent,
    InformationComponent,
    MusicPlayerComponent,
    // CDCasesComponent
    CDCasesComponent,
    PreloaderComponent,
    DefaultValuePipe
  ],
  template: `
    <!-- Show preloader while loading -->
    <app-preloader *ngIf="!isLoaded" 
      [progress]="loadingProgress$ | async">
    </app-preloader>

    <!-- Show main content when loaded -->
    <ng-container *ngIf="isLoaded">
      <div class="bg-container"></div>
      <div class="main-container" (wheel)="onWheel($event)">
        <main #mainContent>
          <section id="introduction">
            <app-introduction></app-introduction>
          </section>
          
          <section id="disc-1">
            <app-disc-one></app-disc-one>
          </section>
          
          <section id="disc-2">
            <app-disc-two></app-disc-two>
          </section>
          
          <section id="pv">
            <app-pv></app-pv>
          </section>
          
          <section id="information">
            <app-information></app-information>
          </section>
        </main>

        <!-- Navigation Bar -->
        <nav class="nav-bar">
          <div class="nav-content">
            <div class="nav-logo">Project Phantasia</div>
            <ul class="nav-links">
              <li><a (click)="scrollTo('introduction')" [class.active]="currentSection === 'introduction'">Introduction</a></li>
              <li><a (click)="scrollTo('disc-1')" [class.active]="currentSection === 'disc-1'">Disc 1</a></li>
              <li><a (click)="scrollTo('disc-2')" [class.active]="currentSection === 'disc-2'">Disc 2</a></li>
              <li><a (click)="scrollTo('pv')" [class.active]="currentSection === 'pv'">PV</a></li>
              <li><a (click)="scrollTo('information')" [class.active]="currentSection === 'information'">Information</a></li>
            </ul>
          </div>
        </nav>

        <!-- Music Player -->
        <app-music-player></app-music-player>

        <!-- CD Cases -->
        <app-cd-cases></app-cd-cases>
      </div>
    </ng-container>
  `,
  styleUrls: ['./phantasia.component.scss']
})
export class PhantasiaComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mainContent') mainContent!: ElementRef;
  
  title = 'Project Phantasia';
  currentSection = 'introduction';
  sections = ['introduction', 'disc-1', 'disc-2', 'pv', 'information'];
  isAnimating = false;
  lastScrollTime = 0;
  scrollCooldown = 1000;
  isLoaded: boolean = false;
  loadingProgress$ = this.preloaderService.getLoadingProgress();

  constructor(
    private elementRef: ElementRef,
    private audioService: AudioService,
    private preloaderService: PreloaderService
  ) {}

  ngAfterViewInit() {
    this.detectCurrentSection();
    this.updateAudioTrack(this.currentSection);
  }

  ngOnInit() {
    // Start preloading and wait for both assets and component
    combineLatest([
      this.preloaderService.preloadAssets(),
      this.preloaderService.getComponentReady()
    ]).subscribe(
      ([assetsLoaded, componentReady]) => {
        if (assetsLoaded && componentReady) {
          this.isLoaded = true;
          this.initializeServices();
        }
      },
      error => {
        console.error('Error during initialization:', error);
        // Handle error appropriately
      }
    );
  }

  private initializeServices(): void {
    // Initialize your services here after preloading is complete
    this.audioService.initializeWithPreloadedAssets();
    // Add other service initializations as needed
  }

  ngOnDestroy() {
    // Clean up cached resources
    this.preloaderService.clearCache();
  }

  private updateAudioTrack(section: string) {
    this.audioService.setTrackForSection(section);
  }

  scrollTo(section: string) {
    const element = document.getElementById(section);
    if (element && !this.isAnimating) {
      this.isAnimating = true;
      this.currentSection = section;
      this.updateAudioTrack(section);
      element.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        this.isAnimating = false;
      }, this.scrollCooldown);
    }
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault();
    
    const now = Date.now();
    if (now - this.lastScrollTime < this.scrollCooldown) return;
    
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
      this.updateAudioTrack(closestSection);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this.isAnimating) {
      this.detectCurrentSection();
    }
  }

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: Event) {
    event.preventDefault();
    return false;
  }
}
