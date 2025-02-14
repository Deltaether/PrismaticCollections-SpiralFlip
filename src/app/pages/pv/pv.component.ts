import { Component } from '@angular/core';

@Component({
  selector: 'app-pv',
  standalone: true,
  templateUrl: './pv.component.html',
  styleUrls: ['./pv.component.scss']
})
export class PvComponent {
  items = Array(20).fill(null);
}
