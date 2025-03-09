import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-right-side-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './right-side-menu.component.html',
  styleUrls: ['./right-side-menu.component.scss']
})
export class RightSideMenuComponent implements OnInit {
  @Input() activeCaseIndex: number = -1;
  @Input() cdCases: any[] = [];
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
  }

  selectTrack(index: number): void {
    this.trackSelected.emit(index);
  }
}
