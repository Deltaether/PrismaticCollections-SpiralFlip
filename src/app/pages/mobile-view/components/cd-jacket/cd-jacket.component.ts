import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cd-jacket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cd-jacket.component.html',
  styleUrls: ['./cd-jacket.component.scss']
})
export class CdJacketComponent {
  @Input() isSecret = false;
  @Input() image = ''; // Path to the CD jacket image (fallback to white empty jacket)
}
