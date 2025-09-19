import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  OnInit,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProfileImageService } from '../../services/profile-image.service';

@Component({
  selector: 'app-profile-image',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  template: `
    <div
      class="profile-image-container"
      [class]="containerClass()"
      [style.width]="sizeSignal() + 'px'"
      [style.height]="sizeSignal() + 'px'"
      [matTooltip]="tooltip"
      [matTooltipDisabled]="!tooltip"
      (click)="handleClick()"
    >
      <!-- Loading Spinner -->
      <div
        class="loading-spinner"
        *ngIf="isLoading()"
        [style.width]="sizeSignal() + 'px'"
        [style.height]="sizeSignal() + 'px'"
      >
        <mat-spinner [diameter]="spinnerSize()"></mat-spinner>
      </div>

      <!-- Profile Image -->
      <img
        *ngIf="!isLoading()"
        [src]="imageUrl()"
        [alt]="altText()"
        [width]="sizeSignal()"
        [height]="sizeSignal()"
        class="profile-image"
        [class.clickable]="clickable"
        [class.verified]="verified"
        loading="lazy"
        (error)="onImageError($event)"
        (load)="onImageLoad($event)"
      />

      <!-- Verified Badge -->
      <div class="verified-badge" *ngIf="verified && !isLoading()">
        <mat-icon>verified</mat-icon>
      </div>

      <!-- Status Indicator -->
      <div
        class="status-indicator"
        *ngIf="showStatus && status && !isLoading()"
        [class]="'status-' + status"
      >
        <mat-icon>
          {{ status === 'online' ? 'circle' : status === 'away' ? 'schedule' : 'radio_button_unchecked' }}
        </mat-icon>
      </div>

      <!-- Fallback Icon for Load Errors -->
      <div
        class="fallback-icon"
        *ngIf="showFallback()"
        [style.width]="sizeSignal() + 'px'"
        [style.height]="sizeSignal() + 'px'"
      >
        <mat-icon [style.font-size]="(sizeSignal() * 0.6) + 'px'">person</mat-icon>
      </div>
    </div>
  `,
  styleUrls: ['./profile-image.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileImageComponent implements OnInit {
  private readonly profileImageService = inject(ProfileImageService);

  @Input({ required: true }) username!: string;
  @Input() displayName?: string;
  @Input() size: number = 40;
  @Input() shape: 'circle' | 'rounded' | 'square' = 'circle';
  @Input() clickable: boolean = false;
  @Input() verified: boolean = false;
  @Input() showStatus: boolean = false;
  @Input() status?: 'online' | 'away' | 'offline';
  @Input() tooltip?: string;
  @Input() lazy: boolean = true;

  @Output() imageClick = new EventEmitter<string>();
  @Output() imageLoad = new EventEmitter<Event>();
  @Output() imageError = new EventEmitter<Event>();

  // Reactive state
  private readonly _imageUrl = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);
  private readonly _hasError = signal<boolean>(false);

  // Computed properties
  readonly imageUrl = computed(() => this._imageUrl());
  readonly isLoading = computed(() => this._isLoading());
  readonly hasError = computed(() => this._hasError());
  readonly sizeSignal = signal(this.size);
  readonly showFallback = computed(() => this._hasError() && !this._isLoading());

  readonly containerClass = computed(() => {
    const classes = ['profile-image-container'];
    classes.push(`shape-${this.shape}`);
    if (this.clickable) classes.push('clickable');
    if (this.verified) classes.push('verified-user');
    return classes.join(' ');
  });

  readonly altText = computed(() => {
    return this.displayName
      ? `${this.displayName} (@${this.username})`
      : `@${this.username}`;
  });

  readonly spinnerSize = computed(() => {
    return Math.max(16, Math.min(24, this.sizeSignal() * 0.4));
  });

  ngOnInit(): void {
    // Update size signal when input changes
    this.sizeSignal.set(this.size);

    // Load profile image
    this.loadProfileImage();

    // Set up tooltip if not provided
    if (!this.tooltip && this.displayName) {
      this.tooltip = this.altText();
    }

    // Update responsive size based on screen size if needed
    this.updateResponsiveSize();
  }

  private updateResponsiveSize(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(max-width: 768px)');

      const updateSize = () => {
        if (mediaQuery.matches && this.sizeSignal() > 60) {
          // Reduce size on mobile for better performance
          this.sizeSignal.set(Math.max(40, this.sizeSignal() * 0.8));
        }
      };

      updateSize();
      mediaQuery.addEventListener('change', updateSize);
    }
  }

  private loadProfileImage(): void {
    if (!this.username) {
      this._hasError.set(true);
      return;
    }

    this._isLoading.set(true);
    this._hasError.set(false);

    // Get loading state
    this.profileImageService.getLoadingState(this.username).subscribe(loading => {
      this._isLoading.set(loading);
    });

    // Load the image URL
    this.profileImageService.getProfileImageUrl(this.username).subscribe({
      next: (url) => {
        this._imageUrl.set(url);
        this._isLoading.set(false);
        this._hasError.set(url.includes('default-avatar'));
      },
      error: () => {
        this._hasError.set(true);
        this._isLoading.set(false);
        this._imageUrl.set('/assets/images/default-avatar.svg');
      }
    });
  }

  onImageLoad(event: Event): void {
    this._hasError.set(false);
    this.imageLoad.emit(event);
  }

  onImageError(event: Event): void {
    this._hasError.set(true);
    this._imageUrl.set('/assets/images/default-avatar.svg');
    this.imageError.emit(event);
  }

  handleClick(): void {
    if (this.clickable) {
      this.imageClick.emit(this.username);
    }
  }

  /**
   * Manually refresh the profile image
   */
  refresh(): void {
    this.profileImageService.clearUserCache(this.username);
    this.loadProfileImage();
  }

  /**
   * Preload the image for better performance
   */
  preload(): void {
    this.profileImageService.preloadProfileImages([this.username]);
  }
}