import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AudioService } from '../../../../tools/music-player/audio.service';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-mobile-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mobile-contact.component.html',
  styleUrls: ['./mobile-contact.component.scss']
})
export class MobileContactComponent implements OnInit {
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  
  formSubmitted = false;
  formError = false;
  
  socialLinks: SocialLink[] = [
    { name: 'Instagram', url: 'https://instagram.com/projectphantasia', icon: 'fab fa-instagram' },
    { name: 'Twitter', url: 'https://twitter.com/projectphantasia', icon: 'fab fa-twitter' },
    { name: 'YouTube', url: 'https://youtube.com/projectphantasia', icon: 'fab fa-youtube' },
    { name: 'SoundCloud', url: 'https://soundcloud.com/projectphantasia', icon: 'fab fa-soundcloud' }
  ];
  
  constructor(private audioService: AudioService) {}

  ngOnInit(): void {
    // Initialize component (✓)
  }
  
  submitForm(): void {
    // Handle form submission (✓)
    if (this.validateForm()) {
      // In a real app, this would send the form data to a server
      this.formSubmitted = true;
      this.formError = false;
      this.resetForm();
      this.audioService.playUISound('success');
    } else {
      this.formError = true;
      this.audioService.playUISound('error');
    }
  }
  
  validateForm(): boolean {
    // Validate form fields (✓)
    return (
      this.contactForm.name.trim() !== '' &&
      this.contactForm.email.trim() !== '' &&
      this.validateEmail(this.contactForm.email) &&
      this.contactForm.message.trim() !== ''
    );
  }
  
  validateEmail(email: string): boolean {
    // Validate email format (✓)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  resetForm(): void {
    // Reset form fields (✓)
    this.contactForm = {
      name: '',
      email: '',
      subject: '',
      message: ''
    };
  }
  
  openSocialLink(url: string): void {
    // Open social media link (✓)
    window.open(url, '_blank');
    this.audioService.playUISound('menu-click');
  }
} 