import { Component } from '@angular/core';

@Component({
  selector: 'app-information',
  standalone: true,
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent {
  items = Array(20).fill(null);
}
