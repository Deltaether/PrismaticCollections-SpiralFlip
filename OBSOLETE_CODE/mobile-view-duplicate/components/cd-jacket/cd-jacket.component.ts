import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// 【✓】 Define interfaces for type safety
interface JacketConfig {
  readonly isSecret: boolean;
  readonly image: string;
}

@Component({
  selector: 'app-cd-jacket',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="cd-jacket" [class.secret]="isSecret">
      <div class="jacket-content">
        <img [src]="image" [alt]="isSecret ? 'Secret CD Jacket' : 'CD Jacket'" />
      </div>
    </div>
  `,
  styles: [`
    .cd-jacket {
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      transition: transform 0.3s ease;
    }

    .cd-jacket:hover {
      transform: scale(1.05);
    }

    .cd-jacket.secret {
      background: linear-gradient(45deg, #1a1a1a, #2a2a2a);
    }

    .cd-jacket.secret:hover {
      background: linear-gradient(45deg, #2a2a2a, #3a3a3a);
    }

    .jacket-content {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush // 【✓】 Optimize change detection
})
export class CdJacketComponent {
  @Input() isSecret: boolean = false;
  @Input() image: string = ''; // Path to the CD jacket image (fallback to white empty jacket)
}
