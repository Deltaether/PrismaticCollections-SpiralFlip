import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Standard website view for collection information
 * Shows details about the Phantasia album
 * 【✓】
 */
@Component({
  selector: 'app-collection',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CollectionComponent implements OnInit {
  albumInfo = {
    title: 'Phantasia',
    artist: 'An × Feryquitous',
    releaseDate: '2020-10-28',
    trackCount: 12,
    duration: '56:32',
    genre: 'Electronic / Orchestral',
    description: 'Project Phantasia is a groundbreaking album that blends electronic and orchestral elements to create an immersive sonic experience. The collaboration between An and Feryquitous showcases their unique approach to music production and composition.'
  };
  
  tracks = [
    { number: 1, title: 'Entrance', duration: '2:14' },
    { number: 2, title: 'Prismatic', duration: '5:31' },
    { number: 3, title: 'Voyage', duration: '4:43' },
    { number: 4, title: 'Crystalline', duration: '6:02' },
    { number: 5, title: 'Ethereal Heights', duration: '5:18' },
    { number: 6, title: 'Interlude', duration: '1:47' },
    { number: 7, title: 'Resonance', duration: '5:22' },
    { number: 8, title: 'Astral Projection', duration: '4:56' },
    { number: 9, title: 'Harmonic Convergence', duration: '6:12' },
    { number: 10, title: 'Beyond', duration: '5:44' },
    { number: 11, title: 'Reflection', duration: '4:03' },
    { number: 12, title: 'Epilogue', duration: '4:40' }
  ];
  
  artists = [
    { 
      name: 'An',
      bio: 'An is a renowned Japanese composer and producer known for creating emotive electronic music with complex sound design and captivating melodies.',
      imageUrl: 'assets/images/an-artist.jpg'
    },
    {
      name: 'Feryquitous',
      bio: 'Feryquitous is a prolific composer and arranger specializing in orchestral electronic music. His intricate compositions blend classical instrumentation with modern electronic elements.',
      imageUrl: 'assets/images/feryquitous-artist.jpg'
    }
  ];

  constructor() {}

  ngOnInit(): void {
    console.log('[Collection] Component initialized');
  }
} 