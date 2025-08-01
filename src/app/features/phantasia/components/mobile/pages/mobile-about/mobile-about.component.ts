import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  image: string;
}

interface Milestone {
  year: string;
  event: string;
}

@Component({
  selector: 'app-mobile-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-about.component.html',
  styleUrls: ['./mobile-about.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileAboutComponent implements OnInit {
  readonly projectDescription = `Project Phantasia is a futuristic musical experience that blends electronic music with immersive visual storytelling. Created in 2023, our goal is to transport listeners to a digital realm where sound and visuals converge to create a unique sensory journey.`;
  
  readonly teamMembers: TeamMember[] = [
    {
      name: 'Alex Synth',
      role: 'Music Producer',
      bio: 'Alex specializes in electronic music production with a focus on ambient and futuristic soundscapes.',
      image: 'assets/images/team/producer.jpg'
    },
    {
      name: 'Maya Visual',
      role: 'Visual Artist',
      bio: 'Maya creates the digital artwork and animations that bring the Project Phantasia universe to life.',
      image: 'assets/images/team/artist.jpg'
    },
    {
      name: 'Kai Code',
      role: 'Web Developer',
      bio: 'Kai is responsible for building the interactive digital experiences that showcase our music and visuals.',
      image: 'assets/images/team/developer.jpg'
    }
  ];
  
  readonly milestones: Milestone[] = [
    { year: '2023', event: 'Project Phantasia founded' },
    { year: '2023', event: 'First EP "Digital Dreams" released' },
    { year: '2023', event: 'Official website launched' },
    { year: '2024', event: 'First full album "Phantasia" released' }
  ];

  constructor() {}

  ngOnInit(): void {
    // Initialize component (✓)
  }
} 