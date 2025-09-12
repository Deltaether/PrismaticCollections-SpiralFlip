import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { TrianglesAnimationComponent } from '../../shared/components/triangles-animation/triangles-animation.component';

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


/**
 * Collections Page Component
 * 
 * Displays album cards (Prisms) in a grid layout with navigation to individual albums.
 * Each album is considered a "Prism" in the Prismatic Collections terminology.
 */
@Component({
  selector: 'app-new-collections',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent, TrianglesAnimationComponent],
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
      title: 'Project Phantasia I',
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/thumbnails/phantasia_1_cover_thumbnail.webp',
      trackCount: 14,
      year: 2024,
      description: 'Our flagship collection featuring ethereal soundscapes, intricate rhythms, and emotional melodies.',
      tags: ['Ambient', 'Fantasy', 'Orchestral'],
      featured: true,
      route: '/phantasia'
    },
    {
      id: 'phantasia2',
      title: 'Phantasia Project II', 
      artist: 'Prismatic Collections',
      coverImage: 'assets/images/project_phantasia2/album_cover.png',
      trackCount: 14,
      year: 2025,
      description: 'The highly anticipated sequel featuring expanded orchestral arrangements and deeper ambient textures.',
      tags: ['Ambient', 'Fantasy', 'Orchestral'],
      featured: false,
      route: '/phantasia/phantasia2'
    },
    {
      id: 'unknown-prism',
      title: '???',
      artist: 'CORRUPTED_DATA',
      coverImage: 'assets/images/featured/prism-unreadable.svg',
      trackCount: 0,
      year: 0,
      description: 'PRISM UNREADABLE - This prism appears to be corrupted ./restoration in progress...',
      tags: ['ERROR', 'UNREADABLE', 'CORRUPTED'],
      featured: false,
      route: '/collections/unknown'
    }
  ];


  constructor(private router: Router) {}

  ngOnInit(): void {
    // Component initialization - triangles now handled by TrianglesAnimationComponent
  }


  /* Navigate to Album */
  navigateToAlbum(albumId: string): void {
    const album = this.albums.find(a => a.id === albumId);
    if (album) {
      this.router.navigate([album.route]);
    }
  }

  /* TrackBy function for better ngFor performance */
  trackByAlbumId(_index: number, album: Album): string {
    return album.id;
  }
}