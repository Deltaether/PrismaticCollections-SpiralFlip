import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// 【✓】 Define interfaces for type safety
interface TeamMember {
  readonly name: string;
  readonly role: string;
  readonly image: string;
}

interface Milestone {
  readonly date: string;
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-mobile-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="about-container">
      <section class="team-section">
        <h2>Our Team</h2>
        <div class="team-grid">
          <div class="team-member" *ngFor="let member of teamMembers">
            <img [src]="member.image" [alt]="member.name" />
            <h3>{{ member.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>
      </section>

      <section class="milestones-section">
        <h2>Milestones</h2>
        <div class="milestones-timeline">
          <div class="milestone" *ngFor="let milestone of milestones">
            <div class="milestone-date">{{ milestone.date }}</div>
            <div class="milestone-content">
              <h3>{{ milestone.title }}</h3>
              <p>{{ milestone.description }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .about-container {
      padding: 20px;
      color: #fff;
    }

    section {
      margin-bottom: 40px;
    }

    h2 {
      font-size: 24px;
      margin-bottom: 20px;
      text-align: center;
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 20px;
      padding: 10px;
    }

    .team-member {
      text-align: center;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 15px;
      transition: transform 0.3s ease;
    }

    .team-member:hover {
      transform: translateY(-5px);
    }

    .team-member img {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 10px;
      object-fit: cover;
    }

    .team-member h3 {
      font-size: 18px;
      margin: 10px 0;
    }

    .team-member p {
      font-size: 14px;
      opacity: 0.8;
    }

    .milestones-timeline {
      position: relative;
      padding: 20px 0;
    }

    .milestone {
      position: relative;
      padding: 20px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .milestone-date {
      font-size: 14px;
      color: #888;
      margin-bottom: 10px;
    }

    .milestone-content h3 {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .milestone-content p {
      font-size: 14px;
      opacity: 0.8;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class MobileAboutComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = true;

  // 【✓】 Team members data
  readonly teamMembers: readonly TeamMember[] = [
    {
      name: 'Member 1',
      role: 'Role 1',
      image: 'assets/images/team/member1.jpg'
    },
    {
      name: 'Member 2',
      role: 'Role 2',
      image: 'assets/images/team/member2.jpg'
    },
    {
      name: 'Member 3',
      role: 'Role 3',
      image: 'assets/images/team/member3.jpg'
    }
  ];

  // 【✓】 Milestones data
  readonly milestones: readonly Milestone[] = [
    {
      date: '2024-01-01',
      title: 'Project Launch',
      description: 'Project Phantasia officially launched.'
    },
    {
      date: '2024-02-01',
      title: 'First Release',
      description: 'First major release of the project.'
    },
    {
      date: '2024-03-01',
      title: 'Community Milestone',
      description: 'Reached 1000 community members.'
    }
  ];

  constructor(private readonly cdr: ChangeDetectorRef) {}

  // 【✓】 Initialize component
  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileAbout] Initializing component');
    }
  }

  // 【✓】 Cleanup resources
  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileAbout] Destroying component');
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
} 