import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AudioService } from '../../../../tools/music-player/audio.service';

// 【✓】 Define interfaces for type safety
interface CreditsPerson {
  readonly name: string;
  readonly role: string;
  readonly avatar?: string;
}

interface CreditsSection {
  readonly title: string;
  readonly people: readonly CreditsPerson[];
}

@Component({
  selector: 'app-mobile-credits',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-credits.component.html',
  styleUrls: ['./mobile-credits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileCreditsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;
  
  // 【✓】 Credits data
  readonly creditsSections: readonly CreditsSection[] = [
    {
      title: 'Project Team',
      people: [
        { name: 'An', role: 'Music Production' },
        { name: 'Feryquitous', role: 'Music Production' },
        { name: 'Digital Dreams Studio', role: 'Artwork & Design' }
      ]
    },
    {
      title: 'Development',
      people: [
        { name: 'SpiralFlip Team', role: 'Website Development' },
        { name: 'WebGL Expert', role: '3D Integration' },
        { name: 'UX Designer', role: 'User Experience' }
      ]
    },
    {
      title: 'Special Thanks',
      people: [
        { name: 'Audio Engineers', role: 'Mastering' },
        { name: 'Beta Testers', role: 'Quality Assurance' },
        { name: 'Project Supporters', role: 'Crowdfunding' }
      ]
    }
  ];

  constructor(
    private readonly audioService: AudioService,
    private readonly cdr: ChangeDetectorRef
  ) {
    if (this.isDebugMode) {
      console.log('[MobileCredits] Component constructed');
    }
  }

  // 【✓】 Lifecycle hooks
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileCredits] Component initialized');
    }
  }

  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileCredits] Component destroyed');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  // 【✓】 UI interaction handler
  handleSectionClick(section: CreditsSection): void {
    this.audioService.playUISound('menu-click');
    if (this.isDebugMode) {
      console.log(`[MobileCredits] Section clicked: ${section.title}`);
    }
  }
} 