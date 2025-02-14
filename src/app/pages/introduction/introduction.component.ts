import { Component } from '@angular/core';

@Component({
  selector: 'app-introduction',
  standalone: true,
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss']
})
export class IntroductionComponent {
  items = Array(20).fill(null);
}
