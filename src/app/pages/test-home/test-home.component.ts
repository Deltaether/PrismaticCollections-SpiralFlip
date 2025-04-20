import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './test-home.component.html',
  styleUrls: ['./test-home.component.scss']
})
export class TestHomeComponent {
  constructor(private router: Router) {
    console.log('TEST HOME COMPONENT LOADED');
  }

  navigate() {
    console.log('Navigate to collections');
    this.router.navigateByUrl('/collections');
  }
}
