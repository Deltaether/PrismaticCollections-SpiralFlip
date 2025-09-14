import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdJacketComponent } from '../../components/cd-jacket/cd-jacket.component';
import { AudioService } from '../../../services/music-player/audio.service';
import { Section } from '../../../../../core/services/audio/audio.service';

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [CommonModule, CdJacketComponent],
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.scss']
})
export class PageOneComponent {
  // Current active CD case index (✓)
  activeCaseIndex: number | null = null;
  
  // List of CD cases to display (✓)
  cdCases: any[] = [];

  constructor(private audioService: AudioService) {}

  // Handle track selection event (✓)
  onTrackSelected(index: number): void {
    this.activeCaseIndex = index;
    // Map track index to valid section
    const sectionMap: { [key: number]: Section } = {
      1: 'disc-1',
      2: 'disc-2',
      0: 'introduction'
    };
    const section = sectionMap[index] || 'disc-1';
    this.audioService.setTrackForSection(section);
  }
}
