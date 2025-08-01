import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdJacketComponent } from '../../components/cd-jacket/cd-jacket.component';
import { AudioService } from '../../../../tools/music-player/audio.service';

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
    this.audioService.setTrackForSection(`track-${index}`);
  }
}
