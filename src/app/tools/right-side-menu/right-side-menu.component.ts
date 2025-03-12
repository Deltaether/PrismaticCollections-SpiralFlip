import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicPlayerComponent } from '../music-player/music-player.component';

@Component({
  selector: 'app-right-side-menu',
  standalone: true,
  imports: [CommonModule, MusicPlayerComponent],
  templateUrl: './right-side-menu.component.html',
  styleUrls: ['./right-side-menu.component.scss']
})
export class RightSideMenuComponent implements OnInit, OnDestroy {
  @Input() cdCases: any[] = [];
  @Input() activeCaseIndex: number | null = null;
  @Output() trackSelected = new EventEmitter<number>();

  // Track list from the CD cases
  public tracks: { title: string, artist: string }[] = [
    { title: 'SpiralFlip - Phantasia ft. Elli', artist: 'SpiralFlip' },
    { title: 'First Steps', artist: 'Bigg Milk' },
    { title: 'Altar of the Sword', artist: 'Heem' },
    { title: 'A Voyage on the Winds of Change', artist: 'Futsuunobito' },
    { title: 'Rohkeutta Etsiä', artist: 'Prower' },
    { title: 'Ivory Flowers', artist: 'AZALI & Seycara' },
    { title: 'Outer Bygone Ruins', artist: 'Qrubey' },
    { title: 'Spiral Into the Abyss', artist: 'Luscinia' },
    { title: 'Wandering Breeze', artist: 'Gardens & sleepy' },
    { title: 'Mystic Nebula', artist: 'はがね' },
    { title: 'Iris', artist: 'LucaProject' },
    { title: 'Half-Asleep in the Middle of Bumfuck Nowhere', artist: 'Mei Naganowa' },
    { title: 'The Traveller', artist: 'ratella' },
    { title: 'Childhood memories', artist: 'dystopian tanuki' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.applyResponsiveSizing();
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  private handleResize(): void {
    this.applyResponsiveSizing();
  }

  private applyResponsiveSizing(): void {
    // This will be handled by CSS variables and responsive classes
    // No need for additional JavaScript logic
  }

  onTrackSelected(index: number): void {
    this.activeCaseIndex = index;
    this.trackSelected.emit(index);
  }
}
