import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectSelectorComponent } from '../../components/project-selector/project-selector.component';
import { MultiProjectArtistShowcaseComponent } from '../../components/multi-project-artist-showcase/multi-project-artist-showcase.component';
import { CrossProjectRelationshipsComponent } from '../../components/cross-project-relationships/cross-project-relationships.component';
import { DynamicArtistCardsComponent } from '../../components/dynamic-artist-cards/dynamic-artist-cards.component';

/**
 * Navigation sections for the demo
 */
type DemoSection = 'overview' | 'selector' | 'showcase' | 'relationships' | 'dynamic';

/**
 * Multi-Project Demo Component
 * Comprehensive demonstration of the integrated Phantasia 1 & 2 artist system
 */
@Component({
  selector: 'app-multi-project-demo',
  standalone: true,
  imports: [
    CommonModule,
    ProjectSelectorComponent,
    MultiProjectArtistShowcaseComponent,
    CrossProjectRelationshipsComponent,
    DynamicArtistCardsComponent
  ],
  template: `
    <div class="demo-container">
      <!-- Demo Header -->
      <div class="demo-header">
        <h1 class="demo-title">Phantasia Multi-Project System</h1>
        <p class="demo-subtitle">
          Comprehensive integration of Phantasia Project 1 & 2 artist data,
          featuring advanced filtering, cross-project relationships, and dynamic artist management.
        </p>
      </div>

      <!-- Navigation -->
      <nav class="demo-navigation">
        <button
          *ngFor="let section of demoSections"
          class="nav-btn"
          [class.active]="currentSection() === section.id"
          (click)="setCurrentSection(section.id)"
        >
          <span class="nav-icon">{{ section.icon }}</span>
          <span class="nav-label">{{ section.label }}</span>
        </button>
      </nav>

      <!-- Content Sections -->
      <div class="demo-content">
        <!-- Overview Section -->
        @if (currentSection() === 'overview') {
          <div class="content-section overview-section">
            <div class="overview-header">
              <h2 class="section-title">System Overview</h2>
              <p class="section-description">
                This multi-project system demonstrates the complete integration of
                Phantasia Project 1 and Project 2 artist data with advanced features.
              </p>
            </div>

            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">🎛️</div>
                <h3 class="feature-title">Project Selector</h3>
                <p class="feature-description">
                  Seamlessly switch between Phantasia 1 & 2 with real-time analytics
                  and project comparison data.
                </p>
                <ul class="feature-list">
                  <li>Project metadata display</li>
                  <li>Track and artist counts</li>
                  <li>External links (YouTube, Streaming)</li>
                  <li>Cross-project analytics</li>
                </ul>
              </div>

              <div class="feature-card">
                <div class="feature-icon">👥</div>
                <h3 class="feature-title">Artist Showcase</h3>
                <p class="feature-description">
                  Advanced filtering and sorting of artists across both projects
                  with comprehensive social media integration.
                </p>
                <ul class="feature-list">
                  <li>Multi-project filtering</li>
                  <li>Cross-project artist identification</li>
                  <li>Social media links</li>
                  <li>Contribution tracking</li>
                </ul>
              </div>

              <div class="feature-card">
                <div class="feature-icon">🔗</div>
                <h3 class="feature-title">Relationship Mapping</h3>
                <p class="feature-description">
                  Visualize artist evolution and connections between projects
                  with detailed contribution tracking.
                </p>
                <ul class="feature-list">
                  <li>Artist evolution stories</li>
                  <li>Track contribution mapping</li>
                  <li>Project continuity analysis</li>
                  <li>Community insights</li>
                </ul>
              </div>

              <div class="feature-card">
                <div class="feature-icon">⚡</div>
                <h3 class="feature-title">Dynamic Integration</h3>
                <p class="feature-description">
                  Real-time artist display that adapts to music playback
                  with project-aware functionality.
                </p>
                <ul class="feature-list">
                  <li>Time-synchronized display</li>
                  <li>Project-aware switching</li>
                  <li>Performance optimization</li>
                  <li>Credit verification</li>
                </ul>
              </div>
            </div>

            <div class="technical-overview">
              <h3 class="technical-title">Technical Implementation</h3>
              <div class="technical-grid">
                <div class="technical-item">
                  <h4>Services Architecture</h4>
                  <p>Enhanced ArtistCreditService and DynamicArtistService with multi-project support</p>
                </div>
                <div class="technical-item">
                  <h4>Database Integration</h4>
                  <p>Complete Phantasia 1 artist database with 16+ artists and 15 tracks</p>
                </div>
                <div class="technical-item">
                  <h4>Component System</h4>
                  <p>Modular Angular components with reactive state management</p>
                </div>
                <div class="technical-item">
                  <h4>Performance</h4>
                  <p>Optimized caching, lazy loading, and efficient change detection</p>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Project Selector Section -->
        @if (currentSection() === 'selector') {
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">Project Selector</h2>
              <p class="section-description">
                Switch between Phantasia projects and view analytics
              </p>
            </div>
            <app-project-selector></app-project-selector>
          </div>
        }

        <!-- Artist Showcase Section -->
        @if (currentSection() === 'showcase') {
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">Artist Showcase</h2>
              <p class="section-description">
                Explore all artists with advanced filtering and sorting
              </p>
            </div>
            <app-multi-project-artist-showcase></app-multi-project-artist-showcase>
          </div>
        }

        <!-- Cross-Project Relationships Section -->
        @if (currentSection() === 'relationships') {
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">Artist Relationships</h2>
              <p class="section-description">
                Discover artist evolution and cross-project connections
              </p>
            </div>
            <app-cross-project-relationships></app-cross-project-relationships>
          </div>
        }

        <!-- Dynamic Artist Cards Section -->
        @if (currentSection() === 'dynamic') {
          <div class="content-section">
            <div class="section-header">
              <h2 class="section-title">Dynamic Artist Display</h2>
              <p class="section-description">
                Real-time artist cards that adapt to music playback
              </p>
            </div>
            <app-dynamic-artist-cards></app-dynamic-artist-cards>
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./multi-project-demo.component.scss']
})
export class MultiProjectDemoComponent implements OnInit {
  // Component state
  protected readonly currentSection = signal<DemoSection>('overview');

  // Demo sections configuration
  protected readonly demoSections = [
    { id: 'overview' as DemoSection, label: 'Overview', icon: '📋' },
    { id: 'selector' as DemoSection, label: 'Project Selector', icon: '🎛️' },
    { id: 'showcase' as DemoSection, label: 'Artist Showcase', icon: '👥' },
    { id: 'relationships' as DemoSection, label: 'Relationships', icon: '🔗' },
    { id: 'dynamic' as DemoSection, label: 'Dynamic Display', icon: '⚡' }
  ];

  ngOnInit(): void {
    console.log('[MultiProjectDemo] Initializing comprehensive demo system');
  }

  /**
   * Set current demo section
   */
  protected setCurrentSection(section: DemoSection): void {
    this.currentSection.set(section);
    console.log(`[MultiProjectDemo] Switched to section: ${section}`);

    // Smooth scroll to top of content
    document.querySelector('.demo-content')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}