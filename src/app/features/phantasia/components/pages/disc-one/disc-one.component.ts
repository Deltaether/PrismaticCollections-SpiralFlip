import { Component } from '@angular/core';

@Component({
  selector: 'app-disc-one',
  standalone: true,
  templateUrl: './disc-one.component.html',
  styleUrls: ['./disc-one.component.scss']
})
export class DiscOneComponent {
  items = Array(20).fill(null);
}
