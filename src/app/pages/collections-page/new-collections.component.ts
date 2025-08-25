import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';

/* Album/Prism Interface Definition */
interface Album {
  id: string;
  title: string;
  artist: string;
  coverImage: string;
  trackCount: number;
  year: number;
  description: string;
  tags: string[];
  featured: boolean;
  route: string;
}

/* Triangle Animation Interface - Matching Home Page */
interface Triangle {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

/**
 * Collections Page Component
 * 
 * Displays album cards (Prisms) in a grid layout with navigation to individual albums.
 * Each album is considered a "Prism" in the Prismatic Collections terminology.
 */
@Component({
  selector: 'app-new-collections',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent],
  templateUrl: './new-collections.component.html',
  styleUrls: ['./new-collections.component.scss'],
  // Enable OnPush change detection for better performance
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewCollectionsComponent implements OnInit {
  
  /* Albums/Prisms Data */
  albums: Album[] = [
    {
      id: 'phantasia',
      title: 'Project Phantasia',
      artist: 'Prismatic Collections',
      coverImage: 'assets/graphic/phantasia_1_cover_final.png',
      trackCount: 12,
      year: 2023,
      description: 'Our flagship collection featuring ethereal soundscapes, intricate rhythms, and emotional melodies.',
      tags: ['Ambient', 'Electronic', 'Experimental'],
      featured: true,
      route: '/phantasia'
    },
    {
      id: 'ethereal',
      title: 'Ethereal Soundscapes', 
      artist: 'Various Artists',
      coverImage: 'assets/graphic/composite.png',
      trackCount: 8,
      year: 2022,
      description: 'Immerse yourself in ambient textures and atmospheric compositions.',
      tags: ['Ambient', 'Atmospheric', 'Meditative'],
      featured: false,
      route: '/collections/ethereal'
    },
    {
      id: 'experimental',
      title: 'Digital Frontiers',
      artist: 'Electronic Collective', 
      coverImage: 'assets/graphic/composite_bg.png',
      trackCount: 10,
      year: 2024,
      description: 'Pushing the boundaries of electronic music with innovative soundscapes.',
      tags: ['Experimental', 'Electronic', 'Futuristic'],
      featured: false,
      route: '/collections/experimental'
    }
  ];

  /* Triangle Animation Data */
  triangles: Triangle[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.initializeTriangles();
  }

  /* Initialize Triangle Animation System - Home Page Style */
  private initializeTriangles(): void {
    const triangleConfigs = [
      { left: 4.2, top: 15, size: 70, duration: 8, delay: 0 },
      { left: 14.7, top: 25, size: 56, duration: 9, delay: 0.5 },
      { left: 24.1, top: 35, size: 80, duration: 10, delay: 1 },
      { left: 33.8, top: 20, size: 64, duration: 8.5, delay: 1.5 },
      { left: 46.3, top: 40, size: 76, duration: 9.5, delay: 2 },
      { left: 55, top: 30, size: 60, duration: 10.5, delay: 2.5 },
      { left: 65, top: 18, size: 84, duration: 8, delay: 3 },
      { left: 75, top: 45, size: 72, duration: 11, delay: 3.5 },
      { left: 85, top: 22, size: 68, duration: 9, delay: 4 },
      { left: 8, top: 60, size: 58, duration: 10, delay: 0.8 },
      { left: 18, top: 70, size: 74, duration: 8.5, delay: 1.3 },
      { left: 28, top: 65, size: 66, duration: 9.5, delay: 1.8 },
      { left: 38, top: 75, size: 78, duration: 10.5, delay: 2.3 },
      { left: 48, top: 80, size: 62, duration: 8, delay: 2.8 },
      { left: 58, top: 68, size: 82, duration: 11.5, delay: 3.3 },
      { left: 68, top: 85, size: 70, duration: 9, delay: 3.8 },
      { left: 78, top: 72, size: 64, duration: 10, delay: 4.3 },
      { left: 88, top: 78, size: 76, duration: 8.5, delay: 4.8 },
      { left: 12, top: 88, size: 68, duration: 9.5, delay: 1.2 },
      { left: 22, top: 92, size: 54, duration: 10.5, delay: 1.7 },
      { left: 32, top: 95, size: 72, duration: 8, delay: 2.2 },
      { left: 42, top: 90, size: 66, duration: 11, delay: 2.7 },
      { left: 52, top: 88, size: 80, duration: 9, delay: 3.2 },
      { left: 62, top: 95, size: 58, duration: 10, delay: 3.7 },
      { left: 92, top: 95, size: 74, duration: 8.5, delay: 4.2 }
    ];

    this.triangles = triangleConfigs;
  }

  /* Navigate to Album */
  navigateToAlbum(albumId: string): void {
    const album = this.albums.find(a => a.id === albumId);
    if (album) {
      this.router.navigate([album.route]);
    }
  }

  /* TrackBy function for better ngFor performance */
  trackByAlbumId(index: number, album: Album): string {
    return album.id;
  }
}