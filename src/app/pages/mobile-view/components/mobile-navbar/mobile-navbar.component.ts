import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AudioService } from '../../../../tools/music-player/audio.service';

@Component({
  selector: 'app-mobile-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './mobile-navbar.component.html',
  styleUrls: ['./mobile-navbar.component.scss']
})
export class MobileNavbarComponent implements OnInit {
  isScrolled = false;
  isMenuOpen = false;
  
  constructor(
    private router: Router,
    private audioService: AudioService
  ) {}

  ngOnInit(): void {
    // Initialize component (✓)
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  @HostListener('window:scroll')
  onScroll(): void {
    // Check if page is scrolled to add transparency effect (✓)
    this.isScrolled = window.scrollY > 10;
  }

  toggleMenu(): void {
    // Toggle mobile menu open/closed state (✓)
    this.isMenuOpen = !this.isMenuOpen;
    this.playUISound('menu-click');
    
    // Prevent body scrolling when menu is open
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  navigateTo(route: string): void {
    // Navigate to specified route (✓)
    this.isMenuOpen = false;
    document.body.style.overflow = '';
    
    // Play sound and navigate
    this.playUISound('menu-click');
    this.router.navigate([route]);
  }

  private playUISound(soundName: string): void {
    // Play UI interaction sound (✓)
    this.audioService.playUISound(soundName);
  }
}
