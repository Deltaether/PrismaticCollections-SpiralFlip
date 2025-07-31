import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';

/* 【✓】 Collection Interface Definition */
interface Collection {
  id: string;
  title: string;
  image: string;
  tracks: number;
  year: number;
  description: string;
  tags: string[];
}

/* 【✓】 Triangle Animation Interface - Matching Home Page */
interface Triangle {
  left: number;    // Horizontal position (0-100%)
  delay: number;   // Animation delay in seconds
  size: number;    // Triangle width in pixels
  height: number;  // Triangle height in pixels
  duration: number; // Animation duration in seconds
}

/**
 * NewCollectionsComponent - Fresh Implementation
 * Clean, optimized standalone component with inverted triangle animations
 * 【✓】
 */
@Component({
  selector: 'app-new-collections',
  standalone: true,
  imports: [CommonModule, SiteHeaderComponent],
  templateUrl: './new-collections.component.html',
  styleUrls: ['./new-collections.component.scss']
})
export class NewCollectionsComponent implements OnInit, OnDestroy {
  
  /* 【✓】 Collections Data */
  collections: Collection[] = [
    {
      id: 'phantasia',
      title: 'Project Phantasia',
      image: 'assets/graphic/phantasia_1_cover_final.png',
      tracks: 12,
      year: 2023,
      description: 'Our flagship collection featuring ethereal soundscapes, intricate rhythms, and emotional melodies that transcend conventional electronic music genres.',
      tags: ['Ambient', 'Electronic', 'Experimental']
    },
    {
      id: 'ethereal',
      title: 'Ethereal Soundscapes',
      image: 'assets/collections/ethereal-soundscapes.jpg',
      tracks: 8,
      year: 2022,
      description: 'Immerse yourself in ambient textures and atmospheric compositions designed to transport listeners to otherworldly realms of sound.',
      tags: ['Ambient', 'Atmospheric', 'Meditative']
    },
    {
      id: 'artifacts',
      title: 'Digital Artifacts',
      image: 'assets/collections/digital-artifacts.jpg',
      tracks: 10,
      year: 2023,
      description: 'A bold exploration of glitchy textures, digital processing, and experimental sound design that pushes the boundaries of modern electronic music.',
      tags: ['Glitch', 'IDM', 'Experimental']
    }
  ];

  /* 【✓】 Triangle Animation System - Matching Home Page Behavior */
  triangles: Triangle[] = [];
  
  constructor(private router: Router) {}

  /* 【✓】 Component Initialization */
  ngOnInit(): void {
    this.initializeTriangles();
  }
  
  /* 【✓】 Component Cleanup */
  ngOnDestroy(): void {
    // Clean up any subscriptions or intervals if needed
  }
  
  /* 【✓】 Initialize Triangle Animation System - Home Page Style */
  private initializeTriangles(): void {
    // Predefined positions and timing to match home page density
    const triangleConfigs = [
      { left: 4.2, size: 70, height: 60, duration: 8, delay: 0 },
      { left: 14.7, size: 56, height: 48, duration: 9, delay: 0.5 },
      { left: 24.1, size: 80, height: 70, duration: 10, delay: 1 },
      { left: 33.8, size: 64, height: 56, duration: 8.5, delay: 1.5 },
      { left: 46.3, size: 76, height: 65, duration: 9.5, delay: 2 },
      { left: 55, size: 60, height: 52, duration: 10.5, delay: 2.5 },
      { left: 65, size: 84, height: 72, duration: 8, delay: 3 },
      { left: 75, size: 68, height: 58, duration: 9, delay: 3.5 },
      { left: 85, size: 72, height: 62, duration: 10, delay: 4 },
      { left: 95, size: 58, height: 50, duration: 8.5, delay: 4.5 },
      
      // Second wave
      { left: 10, size: 66, height: 57, duration: 9.5, delay: 5 },
      { left: 20, size: 74, height: 64, duration: 10, delay: 5.5 },
      { left: 30, size: 62, height: 54, duration: 8, delay: 6 },
      { left: 40, size: 78, height: 68, duration: 9, delay: 6.5 },
      { left: 50, size: 70, height: 60, duration: 10.5, delay: 7 },
      { left: 60, size: 82, height: 71, duration: 8.5, delay: 7.5 },
      { left: 70, size: 66, height: 57, duration: 9.5, delay: 8 },
      { left: 80, size: 76, height: 66, duration: 10, delay: 8.5 },
      { left: 90, size: 64, height: 55, duration: 8, delay: 9 },
      { left: 12, size: 72, height: 63, duration: 9, delay: 9.5 },
      
      // Third wave for more density
      { left: 8, size: 65, height: 58, duration: 8.5, delay: 1.2 },
      { left: 18, size: 70, height: 62, duration: 9.2, delay: 2.3 },
      { left: 28, size: 58, height: 50, duration: 10.2, delay: 3.7 },
      { left: 38, size: 75, height: 67, duration: 8.8, delay: 4.8 },
      { left: 48, size: 63, height: 55, duration: 9.8, delay: 6.2 }
    ];
    
    this.triangles = triangleConfigs.map(config => ({
      left: config.left,
      delay: config.delay,
      size: config.size,
      height: config.height,
      duration: config.duration
    }));
  }

  /* 【✓】 Navigate to Collection Details */
  exploreCollection(collectionId: string): void {
    console.log(`Exploring collection: ${collectionId}`);
    
    // Navigate to collection detail page
    this.router.navigate(['/collection', collectionId]);
  }

  /* 【✓】 Track by Function for Performance */
  trackByCollectionId(index: number, collection: Collection): string {
    return collection.id;
  }

  /* 【✓】 Track by Function for Triangles */
  trackByTriangleIndex(index: number, triangle: Triangle): number {
    return index;
  }
} 