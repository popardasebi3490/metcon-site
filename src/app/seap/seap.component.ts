import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'; // <--- 1. IMPORTĂ ASTA

@Component({
  selector: 'app-seap',
  standalone: true,
  imports: [RouterLink], 
  templateUrl: './seap.component.html',
  styleUrl: './seap.component.css'
})
export class SeapComponent {
}