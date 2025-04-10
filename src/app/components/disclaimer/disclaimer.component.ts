import { Component, OnInit, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition } from '@angular/animations';

/**
 * Displays a brief professional disclaimer before entering the experience
 * Informs users about the digital nature of the 3D content
 * 【✓】
 */
@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('400ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class DisclaimerComponent implements OnInit {
  @Output() acknowledged = new EventEmitter<void>();
  
  isReadyToProceed = true; // Make it immediately clickable
  isDebugMode = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[Disclaimer] Component initialized');
    }
    
    // Force change detection to make sure button is clickable
    this.cdr.detectChanges();
  }

  /**
   * Handles user acknowledgment of the disclaimer
   * Emits event to parent component to proceed
   * 【✓】
   */
  onAcknowledge(): void {
    if (this.isDebugMode) {
      console.log('[Disclaimer] User acknowledged disclaimer');
    }
    
    this.acknowledged.emit();
  }
} 