import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AudioService } from '../../../../tools/music-player/audio.service';

@Component({
  selector: 'app-mobile-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-home.component.html',
  styleUrls: ['./mobile-home.component.scss']
})
export class MobileHomeComponent implements OnInit {
  featuredItems = [
    {
      title: 'Phantasia',
      subtitle: 'Latest Album',
      image: 'assets/images/album-covers/phantasia-cover.jpg',
      route: '/mobile/music'
    },
    {
      title: 'About',
      subtitle: 'The Project',
      image: 'assets/images/backgrounds/about-bg.jpg',
      route: '/mobile/about'
    },
    {
      title: 'Contact',
      subtitle: 'Get in Touch',
      image: 'assets/images/backgrounds/contact-bg.jpg',
      route: '/mobile/contact'
    }
  ];
  
  constructor(
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    // Initialize component (✓)
  }
  
  navigateTo(route: string): void {
    // Navigate to the specified route (✓)
    this.audioService.playUISound('menu-click');
    this.router.navigate([route]);
  }
} 