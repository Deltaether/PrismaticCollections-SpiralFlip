import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UISoundService } from '../../../services/music-player/ui-sound.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface SocialLink {
  readonly name: string;
  readonly url: string;
  readonly icon: string;
}

interface ContactFormData {
  readonly name: string;
  readonly email: string;
  readonly subject: string;
  readonly message: string;
}

interface FormState {
  readonly isSubmitting: boolean;
  readonly isSubmitted: boolean;
  readonly hasError: boolean;
  readonly errorMessages: string[];
}

@Component({
  selector: 'app-mobile-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="contact-container">
      <h1 class="page-title">Contact Us</h1>
      
      <div class="form-container" [class.submitted]="formState.isSubmitted">
        <!-- Success message shown after submission -->
        <div class="success-message" *ngIf="formState.isSubmitted">
          <div class="success-icon">✓</div>
          <h2>Thank you!</h2>
          <p>Your message has been sent successfully.</p>
          <button class="new-message-btn" (click)="resetForm()">Send Another Message</button>
        </div>
        
        <!-- Contact form -->
        <form [formGroup]="contactForm" (ngSubmit)="submitForm()" *ngIf="!formState.isSubmitted">
          <div class="form-group">
            <label for="name">Name</label>
            <input 
              type="text" 
              id="name" 
              formControlName="name" 
              [class.error]="isFieldInvalid('name')"
              placeholder="Your name">
            <div class="error-message" *ngIf="isFieldInvalid('name')">
              Please enter your name
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              [class.error]="isFieldInvalid('email')"
              placeholder="Your email address">
            <div class="error-message" *ngIf="shouldShowEmailError()">
              {{ getEmailErrorMessage() }}
            </div>
          </div>
          
          <div class="form-group">
            <label for="subject">Subject (Optional)</label>
            <input 
              type="text" 
              id="subject" 
              formControlName="subject" 
              placeholder="Subject of your message">
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea 
              id="message" 
              formControlName="message" 
              [class.error]="isFieldInvalid('message')"
              placeholder="Your message" 
              rows="5"></textarea>
            <div class="error-message" *ngIf="isFieldInvalid('message')">
              Please enter your message
            </div>
          </div>
          
          <!-- Form errors -->
          <div class="form-errors" *ngIf="formState.hasError">
            <div class="error-icon">!</div>
            <div class="error-list">
              <p *ngFor="let error of formState.errorMessages">{{ error }}</p>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="submit-btn" 
            [disabled]="formState.isSubmitting || contactForm.invalid"
            [class.submitting]="formState.isSubmitting">
            {{ formState.isSubmitting ? 'Sending...' : 'Send Message' }}
          </button>
        </form>
      </div>
      
      <!-- Social links -->
      <div class="social-links">
        <h2>Connect With Us</h2>
        <div class="social-icons">
          <a 
            *ngFor="let link of socialLinks" 
            [href]="link.url" 
            target="_blank" 
            class="social-icon"
            (click)="openSocialLink($event, link.url)">
            <i [class]="link.icon"></i>
            <span class="social-name">{{ link.name }}</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .contact-container {
      padding: 20px;
      color: #fff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .page-title {
      font-size: 28px;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .form-container {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      padding: 25px;
      margin-bottom: 30px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
    }
    
    .form-container.submitted {
      background: rgba(41, 187, 137, 0.1);
    }
    
    .success-message {
      text-align: center;
      padding: 20px;
    }
    
    .success-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 20px;
      background: #29BB89;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      color: #fff;
    }
    
    .new-message-btn {
      background: #29BB89;
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      margin-top: 20px;
      transition: background 0.3s;
    }
    
    .new-message-btn:hover {
      background: #1D8A64;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }
    
    input, textarea {
      width: 100%;
      padding: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 5px;
      color: #fff;
      font-size: 16px;
      transition: all 0.3s;
    }
    
    input:focus, textarea:focus {
      border-color: rgba(255, 255, 255, 0.3);
      outline: none;
      background: rgba(255, 255, 255, 0.1);
    }
    
    input.error, textarea.error {
      border-color: #FF4D4F;
    }
    
    .error-message {
      color: #FF4D4F;
      font-size: 14px;
      margin-top: 5px;
    }
    
    .form-errors {
      display: flex;
      align-items: flex-start;
      margin-bottom: 20px;
      padding: 15px;
      background: rgba(255, 77, 79, 0.1);
      border-radius: 5px;
    }
    
    .error-icon {
      width: 24px;
      height: 24px;
      background: #FF4D4F;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 10px;
      flex-shrink: 0;
    }
    
    .error-list {
      flex: 1;
    }
    
    .error-list p {
      margin: 0 0 5px;
    }
    
    .submit-btn {
      width: 100%;
      padding: 14px;
      background: #5557f7;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s;
    }
    
    .submit-btn:hover:not(:disabled) {
      background: #4041c7;
    }
    
    .submit-btn:disabled {
      background: #3c3e84;
      cursor: not-allowed;
      opacity: 0.7;
    }
    
    .submit-btn.submitting {
      background: #3c3e84;
      position: relative;
    }
    
    .social-links {
      margin-top: auto;
    }
    
    .social-links h2 {
      font-size: 20px;
      margin-bottom: 15px;
      text-align: center;
    }
    
    .social-icons {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
    }
    
    .social-icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #fff;
      text-decoration: none;
      padding: 10px;
      transition: transform 0.3s;
    }
    
    .social-icon i {
      font-size: 28px;
      margin-bottom: 5px;
    }
    
    .social-icon:hover {
      transform: translateY(-5px);
    }
    
    .social-name {
      font-size: 12px;
      opacity: 0.8;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileContactComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly isDebugMode = false;
  
  contactForm: FormGroup;
  
  formState: FormState = {
    isSubmitting: false,
    isSubmitted: false,
    hasError: false,
    errorMessages: []
  };
  
  readonly socialLinks: readonly SocialLink[] = [
    { name: 'Instagram', url: 'https://instagram.com/projectphantasia', icon: 'fab fa-instagram' },
    { name: 'Twitter', url: 'https://twitter.com/projectphantasia', icon: 'fab fa-twitter' },
    { name: 'YouTube', url: 'https://youtube.com/projectphantasia', icon: 'fab fa-youtube' },
    { name: 'SoundCloud', url: 'https://soundcloud.com/projectphantasia', icon: 'fab fa-soundcloud' }
  ];
  
  constructor(
    private readonly fb: FormBuilder,
    private readonly uiSoundService: UISoundService,
    private readonly cdr: ChangeDetectorRef
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    if (this.isDebugMode) {
      console.log('[MobileContact] Initializing component');
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
  
  shouldShowEmailError(): boolean {
    const email = this.contactForm.get('email');
    return email ? email.invalid && (email.dirty || email.touched) : false;
  }
  
  getEmailErrorMessage(): string {
    const email = this.contactForm.get('email');
    
    if (email?.hasError('required')) {
      return 'Please enter your email address';
    }
    
    if (email?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    
    return 'Invalid email address';
  }

  private updateFormState(newState: Partial<FormState>): void {
    this.formState = {
      ...this.formState,
      ...newState
    };
    
    this.cdr.markForCheck();
    
    if (this.isDebugMode) {
      console.log('[MobileContact] Form state updated:', this.formState);
    }
  }
  
  submitForm(): void {
    if (this.contactForm.invalid) {
      this.highlightFormErrors();
      this.uiSoundService.playUISound('error');
      return;
    }
    
    this.updateFormState({
      isSubmitting: true,
      hasError: false,
      errorMessages: []
    });
    
    setTimeout(() => {
      if (this.isDebugMode) {
        console.log('[MobileContact] Form submitted:', this.contactForm.value);
      }
      
      this.updateFormState({
        isSubmitting: false,
        isSubmitted: true
      });
      
      this.uiSoundService.playUISound('success');
    }, 1500);
  }
  
  private highlightFormErrors(): void {
    Object.keys(this.contactForm.controls).forEach(key => {
      const control = this.contactForm.get(key);
      control?.markAsTouched();
    });
    
    const errorMessages: string[] = [];
    
    if (this.contactForm.get('name')?.invalid) {
      errorMessages.push('Please provide your name.');
    }
    
    if (this.contactForm.get('email')?.invalid) {
      errorMessages.push(this.getEmailErrorMessage());
    }
    
    if (this.contactForm.get('message')?.invalid) {
      errorMessages.push('Please provide a message with at least 5 characters.');
    }
    
    this.updateFormState({
      hasError: true,
      errorMessages
    });
    
    this.cdr.markForCheck();
  }

  resetForm(): void {
    this.contactForm.reset();
    
    this.updateFormState({
      isSubmitted: false,
      hasError: false,
      errorMessages: []
    });
    
    if (this.isDebugMode) {
      console.log('[MobileContact] Form reset');
    }
  }
  
  openSocialLink(event: Event, url: string): void {
    event.preventDefault();
    window.open(url, '_blank');
    this.uiSoundService.playUISound('menu-click');
    
    if (this.isDebugMode) {
      console.log(`[MobileContact] Opening social link: ${url}`);
    }
  }

  ngOnDestroy(): void {
    if (this.isDebugMode) {
      console.log('[MobileContact] Destroying component');
    }
    
    this.destroy$.next();
    this.destroy$.complete();
  }
} 