import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root application component that hosts the router outlet
 * Acts as the entry point for the application
 * 【✓】
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  /**
   * Main application component
   * 【✓】
   */
  title = 'Prismatic Collections';
} 