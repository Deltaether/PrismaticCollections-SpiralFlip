import { Component } from '@angular/core';

@Component({
  selector: 'app-disc-two',
  standalone: true,
  templateUrl: './disc-two.component.html',
  styleUrls: ['./disc-two.component.scss']
})
export class DiscTwoComponent {
  items = Array(20).fill(null);
}
