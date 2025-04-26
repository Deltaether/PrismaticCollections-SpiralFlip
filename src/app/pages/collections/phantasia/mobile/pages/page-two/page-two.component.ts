import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RightSideMenuComponent } from '../../../../tools/right-side-menu/right-side-menu.component';
import { CdJacketComponent } from '../../components/cd-jacket/cd-jacket.component';
import { AudioService } from '../../../services/audio.service';

@Component({
  selector: 'app-page-two',
  standalone: true,
  imports: [CommonModule, RightSideMenuComponent, CdJacketComponent],
  templateUrl: './page-two.component.html',
  styleUrls: ['./page-two.component.scss']
})
export class PageTwoComponent {
  activeCaseIndex: number | null = null;
  cdCases: any[] = [];
  
  // Special tracks with robot language names for disc 2
  robotTracks = [
    { title: '01101001', artist: '010100111' },
    { title: '10100111', artist: '011110001' },
    { title: '01011010', artist: '001011101' },
    { title: '11001010', artist: '010111001' },
    { title: '01001111', artist: '101010001' },
    { title: '10111010', artist: '011101100' },
    { title: '01110101', artist: '101101110' },
    { title: '10010111', artist: '010010001' },
    { title: '01100111', artist: '101110010' },
    { title: '10111001', artist: '010101001' },
    { title: '01010110', artist: '101001110' },
    { title: '11010110', artist: '010101100' },
    { title: '10100101', artist: '101110011' },
    { title: '01101110', artist: '011011010' }
  ];

  constructor(private audioService: AudioService) {}

  // This won't actually play any tracks - it's just for show
  onTrackSelected(index: number): void {
    this.activeCaseIndex = index;
    // Don't play any audio for secret disc
  }
}
