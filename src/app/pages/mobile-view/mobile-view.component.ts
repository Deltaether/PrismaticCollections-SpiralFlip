import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mobile-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mobile-container">
      <div class="mobile-content">
        <h1>Project Phantasia</h1>
        <p>Please visit our desktop site for the full 3D experience.</p>
        <div class="mobile-menu">
          <!-- Add your mobile-specific navigation and content here -->
          <nav>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#music">Music</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mobile-container {
      width: 100%;
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
      color: #ffffff;
      padding: 20px;
    }

    .mobile-content {
      text-align: center;
      max-width: 600px;
      width: 100%;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    p {
      font-size: 1.1rem;
      margin-bottom: 2rem;
      opacity: 0.8;
    }

    .mobile-menu {
      margin-top: 2rem;
    }

    nav ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    nav li {
      margin: 1rem 0;
    }

    nav a {
      color: #ffffff;
      text-decoration: none;
      font-size: 1.2rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s ease;
      display: inline-block;
      width: 80%;
      background: rgba(255, 255, 255, 0.1);
    }

    nav a:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `]
})
export class MobileViewComponent {} 