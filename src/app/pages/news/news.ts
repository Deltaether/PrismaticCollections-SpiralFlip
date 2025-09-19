import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/components/site-header/site-header.component';
import { SquaresAnimationComponent } from '../../shared/components/squares-animation/squares-animation.component';
// Twitter Scraper Integration
import { TwitterTimelineComponent } from '../../components/twitter-timeline/twitter-timeline.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, SiteHeaderComponent, SquaresAnimationComponent, TwitterTimelineComponent],
  templateUrl: './news.html',
  styleUrl: './news.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class News implements OnInit, OnDestroy {
  // Twitter Configuration
  readonly twitterUsername = environment.twitter.username;
  readonly twitterProfileUrl = `https://x.com/${environment.twitter.username}`;

  constructor(public router: Router) {}
  
  ngOnInit(): void {
    console.log('News component initialized - Twitter Timeline Focus');
    // Add body class for global scrolling support
    document.body.classList.add('news-page-active');
  }

  ngOnDestroy(): void {
    // Clean up body class when component is destroyed
    document.body.classList.remove('news-page-active');
  }


  // Twitter Profile interaction methods
  onFollowClick(): void {
    console.log(`📱 Opening X profile: ${this.twitterProfileUrl}`);
    window.open(this.twitterProfileUrl, '_blank', 'noopener,noreferrer');
  }

}
